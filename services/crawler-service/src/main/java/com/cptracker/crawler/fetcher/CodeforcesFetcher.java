package com.cptracker.crawler.fetcher;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

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
        String url = apiUrl + "/user.status?handle=" + handle + "&count=100";
        List<SubmissionDTO> submissions = new ArrayList<>();
        try {
            var response = restTemplate.getForObject(url, CodeforcesSubmissionResponse.class);
            if (response != null && "OK".equals(response.getStatus())) {
                for (var item : response.getResult()) {
                    SubmissionDTO dto = new SubmissionDTO();
                    dto.setRemoteId(String.valueOf(item.getId()));
                    dto.setProblemId(item.getProblem().getContestId() + item.getProblem().getIndex());
                    dto.setVerdict(item.getVerdict());
                    dto.setLanguage(item.getProgrammingLanguage());
                    submissions.add(dto);
                }
            }
        } catch (Exception e) {
            log.error("获取CF提交记录失败, handle={}", handle, e);
        }
        return submissions;
    }
}
