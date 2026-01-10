package com.cptracker.crawler.fetcher;

import com.cptracker.crawler.config.CrawlerConstants;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class AtCoderFetcher implements PlatformFetcher {

    @Value("${crawler.atcoder.api-url:https://kenkoooo.com/atcoder/atcoder-api/v3}")
    private String apiUrl;

    private final RestTemplate restTemplate;

    @Override
    public String getPlatform() {
        return "ATCODER";
    }

    @Override
    public UserInfoDTO fetchUserInfo(String handle) {
        // 从 AtCoder 官网获取用户比赛历史，提取最新 rating
        String historyUrl = "https://atcoder.jp/users/" + handle + "/history/json";

        try {
            var response = restTemplate.exchange(
                    historyUrl,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<List<AtCoderHistoryResponse>>() {}
            );

            List<AtCoderHistoryResponse> history = response.getBody();
            if (history == null || history.isEmpty()) {
                log.warn("AtCoder用户无比赛历史或不存在, handle={}", handle);
                return null;
            }

            UserInfoDTO dto = new UserInfoDTO();
            dto.setHandle(handle);

            // 获取最新一场比赛的 rating
            AtCoderHistoryResponse latest = history.get(history.size() - 1);
            dto.setRating(latest.getNewRating());

            // 计算最高 rating
            int maxRating = history.stream()
                    .mapToInt(AtCoderHistoryResponse::getNewRating)
                    .max()
                    .orElse(0);
            dto.setMaxRating(maxRating);

            return dto;
        } catch (Exception e) {
            log.warn("获取AtCoder用户Rating失败, handle={}, error={}", handle, e.getMessage());
            return null;
        }
    }

    @Override
    public List<SubmissionDTO> fetchUserSubmissions(String handle) {
        String url = apiUrl + "/user/submissions?user=" + handle;
        List<SubmissionDTO> submissions = new ArrayList<>();
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(CrawlerConstants.DATA_RETENTION_DAYS);

        try {
            var response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<List<AtCoderSubmissionResponse>>() {}
            );

            List<AtCoderSubmissionResponse> results = response.getBody();
            if (results != null) {
                for (var item : results) {
                    // 解析提交时间
                    LocalDateTime submissionTime = null;
                    if (item.getEpochSecond() != null) {
                        submissionTime = LocalDateTime.ofInstant(
                                Instant.ofEpochSecond(item.getEpochSecond()),
                                ZoneId.systemDefault()
                        );
                    }

                    // 只保留365天内的提交
                    if (submissionTime == null || submissionTime.isBefore(cutoffDate)) {
                        continue;
                    }

                    SubmissionDTO dto = new SubmissionDTO();
                    dto.setRemoteId(String.valueOf(item.getId()));
                    dto.setProblemId(item.getProblemId());
                    dto.setVerdict(item.getResult());  // AtCoder: "AC", "WA", etc.
                    dto.setLanguage(item.getLanguage());
                    dto.setSubmissionTime(submissionTime);
                    // AtCoder 不设置 tags 和 problemRating（跳过技能雷达）
                    submissions.add(dto);
                }
            }
        } catch (Exception e) {
            log.error("获取AtCoder提交记录失败, handle={}", handle, e);
        }

        return submissions;
    }
}
