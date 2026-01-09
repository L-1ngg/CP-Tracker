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

    private final AnalysisService analysisService;

    @GetMapping("/heatmap/{userId}")
    public ResponseEntity<List<DailyActivity>> getHeatmap(
            @PathVariable("userId") Long userId,
            @RequestParam(value = "days", defaultValue = "365") int days) {
        return ResponseEntity.ok(analysisService.getHeatmapData(userId, days));
    }

    @GetMapping("/skills/{userId}")
    public ResponseEntity<List<SkillRadar>> getSkills(@PathVariable("userId") Long userId) {
        return ResponseEntity.ok(analysisService.getSkillRadar(userId));
    }

    @GetMapping("/rating/{userId}")
    public ResponseEntity<UserRating> getRating(@PathVariable("userId") Long userId) {
        return ResponseEntity.ok(
            analysisService.getUserRating(userId)
                .orElseGet(() -> {
                    UserRating empty = new UserRating();
                    empty.setUserId(userId);
                    return empty;
                })
        );
    }
}
