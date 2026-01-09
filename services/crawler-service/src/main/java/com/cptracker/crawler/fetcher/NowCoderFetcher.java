package com.cptracker.crawler.fetcher;

import com.cptracker.crawler.config.CrawlerConstants;
import com.cptracker.crawler.config.CrawlerConstants;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
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
public class NowCoderFetcher implements PlatformFetcher {

    @Value("${crawler.nowcoder.api-url:https://ac.nowcoder.com}")
    private String apiUrl;

    private final RestTemplate restTemplate;

    private HttpHeaders createHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Accept", MediaType.APPLICATION_JSON_VALUE);
        headers.set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36");
        return headers;
    }

    @Override
    public String getPlatform() {
        return "NOWCODER";
    }

    @Override
    public UserInfoDTO fetchUserInfo(String handle) {
        // NowCoder 竞赛用户信息 API
        String url = apiUrl + "/acm-heavy/acm/contest/profile-info?uid=" + handle;
        UserInfoDTO dto = new UserInfoDTO();
        dto.setHandle(handle);

        try {
            HttpEntity<String> entity = new HttpEntity<>(createHeaders());
            var response = restTemplate.exchange(url, HttpMethod.GET, entity, NowCoderUserResponse.class);
            var body = response.getBody();
            if (body != null && body.getCode() != null && body.getCode() == 0 && body.getData() != null) {
                var data = body.getData();
                dto.setRating(data.getRating());
                dto.setMaxRating(data.getMaxRating());
                dto.setRank(data.getRank());
            }
        } catch (Exception e) {
            log.warn("获取NowCoder用户信息失败, handle={}: {}", handle, e.getMessage());
        }

        return dto;
    }

    @Override
    public List<SubmissionDTO> fetchUserSubmissions(String handle) {
        // NowCoder 提交记录 API
        String url = apiUrl + "/acm/contest/profile/" + handle + "/practice-coding?pageSize=500";
        List<SubmissionDTO> submissions = new ArrayList<>();
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(CrawlerConstants.DATA_RETENTION_DAYS);

        try {
            HttpEntity<String> entity = new HttpEntity<>(createHeaders());
            var response = restTemplate.exchange(url, HttpMethod.GET, entity, NowCoderSubmissionResponse.class);
            var body = response.getBody();
            if (body != null && body.getCode() != null && body.getCode() == 0
                    && body.getData() != null
                    && body.getData().getList() != null) {

                for (var item : body.getData().getList()) {
                    LocalDateTime submissionTime = null;
                    if (item.getSubmitTime() != null) {
                        submissionTime = LocalDateTime.ofInstant(
                                Instant.ofEpochMilli(item.getSubmitTime()),
                                ZoneId.systemDefault()
                        );
                    }

                    // 只保留365天内的提交
                    if (submissionTime == null || submissionTime.isBefore(cutoffDate)) {
                        continue;
                    }

                    SubmissionDTO dto = new SubmissionDTO();
                    dto.setRemoteId(String.valueOf(item.getSubmissionId()));
                    dto.setProblemId(item.getProblemId());
                    // NowCoder status: 5 = AC
                    dto.setVerdict(item.getStatus() == CrawlerConstants.NOWCODER_AC_STATUS ? "AC" : item.getStatusMessage());
                    dto.setLanguage(item.getLanguage());
                    dto.setSubmissionTime(submissionTime);
                    submissions.add(dto);
                }
            }
        } catch (Exception e) {
            log.warn("获取NowCoder提交记录失败, handle={}: {}", handle, e.getMessage());
        }

        return submissions;
    }
}
