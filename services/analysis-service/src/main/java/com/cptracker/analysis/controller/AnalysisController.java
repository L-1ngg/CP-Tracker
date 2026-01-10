package com.cptracker.analysis.controller;

import com.cptracker.analysis.entity.DailyActivity;
import com.cptracker.analysis.entity.SkillRadar;
import com.cptracker.analysis.entity.UserRating;
import com.cptracker.analysis.service.AnalysisService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/analysis")
@RequiredArgsConstructor
public class AnalysisController {

    private static final int MIN_DAYS = 1;
    private static final int MAX_DAYS = 365;

    private final AnalysisService analysisService;

    @GetMapping("/heatmap/{userId}")
    public ResponseEntity<List<DailyActivity>> getHeatmap(
            @PathVariable("userId") Long userId,
            @RequestParam(value = "days", defaultValue = "365") int days) {
        // 验证 days 参数范围
        int validDays = Math.max(MIN_DAYS, Math.min(days, MAX_DAYS));
        return ResponseEntity.ok(analysisService.getHeatmapData(userId, validDays));
    }

    @GetMapping("/skills/{userId}")
    public ResponseEntity<List<SkillRadar>> getSkills(@PathVariable("userId") Long userId) {
        return ResponseEntity.ok(analysisService.getSkillRadar(userId));
    }

    @GetMapping("/rating/{userId}")
    public ResponseEntity<UserRating> getRating(@PathVariable("userId") Long userId) {
        UserRating rating = analysisService.getUserRating(userId);
        if (rating != null) {
            return ResponseEntity.ok(rating);
        }
        // 用户无 Rating 数据时返回空对象
        UserRating empty = new UserRating();
        empty.setUserId(userId);
        return ResponseEntity.ok(empty);
    }
}
