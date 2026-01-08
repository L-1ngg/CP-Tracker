package com.cptracker.crawler.fetcher;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.ArrayList;

@Slf4j
@Component
@RequiredArgsConstructor
public class CodeforcesFetcher implements PlatformFetcher {

    @Value("${crawler.codeforces.api-url}")
    private String apiUrl;

    private final RestTemplate restTemplate;

    @Override
    public String getPlatform() {
        return "CODEFORCES";
    }

    @Override
    public UserInfoDTO fetchUserInfo(String handle) {
        String url = apiUrl + "/user.info?handles=" + handle;
        try {
            var response = restTemplate.getForObject(url, CodeforcesResponse.class);
            if (response != null && "OK".equals(response.getStatus())) {
                var result = response.getResult().get(0);
                UserInfoDTO dto = new UserInfoDTO();
                dto.setHandle(result.getHandle());
                dto.setRating(result.getRating());
                dto.setMaxRating(result.getMaxRating());
                dto.setRank(result.getRank());
                return dto;
            }
        } catch (Exception e) {
            log.error("获取CF用户信息失败, handle={}", handle, e);
        }
        return null;
    }

    @Override
    public List<SubmissionDTO> fetchUserSubmissions(String handle) {
        // 不限制数量，获取所有提交后过滤365天内的数据
        String url = apiUrl + "/user.status?handle=" + handle;
        List<SubmissionDTO> submissions = new ArrayList<>();
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(365);

        try {
            var response = restTemplate.getForObject(url, CodeforcesSubmissionResponse.class);
            if (response != null && "OK".equals(response.getStatus())) {
                for (var item : response.getResult()) {
                    // 解析提交时间
                    LocalDateTime submissionTime = null;
                    if (item.getCreationTimeSeconds() != null) {
                        submissionTime = LocalDateTime.ofInstant(
                                Instant.ofEpochSecond(item.getCreationTimeSeconds()),
                                ZoneId.systemDefault()
                        );
                    }

                    // 只保留365天内的提交
                    if (submissionTime == null || submissionTime.isBefore(cutoffDate)) {
                        continue;
                    }

                    SubmissionDTO dto = new SubmissionDTO();
                    dto.setRemoteId(String.valueOf(item.getId()));
                    dto.setProblemId(item.getProblem().getContestId() + item.getProblem().getIndex());
                    dto.setVerdict(item.getVerdict());
                    dto.setLanguage(item.getProgrammingLanguage());
                    dto.setSubmissionTime(submissionTime);
                    dto.setProblemRating(item.getProblem().getRating());
                    dto.setTags(item.getProblem().getTags());
                    submissions.add(dto);
                }
            }
        } catch (Exception e) {
            log.error("获取CF提交记录失败, handle={}", handle, e);
        }
        return submissions;
    }
}
