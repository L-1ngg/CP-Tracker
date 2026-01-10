package com.cptracker.crawler.fetcher;

import com.cptracker.crawler.config.CrawlerConstants;
import com.google.common.util.concurrent.RateLimiter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
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
public class CodeforcesFetcher implements PlatformFetcher {

    @Value("${crawler.codeforces.api-url}")
    private String apiUrl;

    private final RestTemplate restTemplate;
    private final RateLimiter rateLimiter;

    public CodeforcesFetcher(
            RestTemplate restTemplate,
            @Qualifier("codeforcesRateLimiter") RateLimiter rateLimiter) {
        this.restTemplate = restTemplate;
        this.rateLimiter = rateLimiter;
    }

    @Override
    public String getPlatform() {
        return "CODEFORCES";
    }

    @Override
    public UserInfoDTO fetchUserInfo(String handle) {
        // 获取令牌，阻塞直到获取成功
        rateLimiter.acquire();

        String url = apiUrl + "/user.info?handles=" + handle;
        try {
            var response = restTemplate.getForObject(url, CodeforcesResponse.class);
            if (response != null && "OK".equals(response.getStatus())) {
                var resultList = response.getResult();
                // 检查 result 列表是否为空
                if (resultList == null || resultList.isEmpty()) {
                    log.warn("CF用户不存在或无数据, handle={}", handle);
                    return null;
                }
                var result = resultList.get(0);
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
        // 获取令牌，阻塞直到获取成功
        rateLimiter.acquire();

        // 不限制数量，获取所有提交后过滤365天内的数据
        String url = apiUrl + "/user.status?handle=" + handle;
        List<SubmissionDTO> submissions = new ArrayList<>();
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(CrawlerConstants.DATA_RETENTION_DAYS);

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

                    // 检查 problem 是否存在必要字段
                    var problem = item.getProblem();
                    if (problem == null) {
                        continue;
                    }

                    // 构建 problemId，处理 contestId 可能为 null 的情况（如 gym 比赛）
                    String problemId;
                    if (problem.getContestId() != null) {
                        problemId = problem.getContestId() + problem.getIndex();
                    } else {
                        // gym 或其他无 contestId 的提交，使用 problemsetName 或跳过
                        problemId = "gym_" + problem.getIndex();
                    }

                    SubmissionDTO dto = new SubmissionDTO();
                    dto.setRemoteId(String.valueOf(item.getId()));
                    dto.setProblemId(problemId);
                    dto.setVerdict(item.getVerdict());
                    dto.setLanguage(item.getProgrammingLanguage());
                    dto.setSubmissionTime(submissionTime);
                    dto.setProblemRating(problem.getRating());
                    dto.setTags(problem.getTags());
                    submissions.add(dto);
                }
            }
        } catch (Exception e) {
            log.error("获取CF提交记录失败, handle={}", handle, e);
        }
        return submissions;
    }
}
