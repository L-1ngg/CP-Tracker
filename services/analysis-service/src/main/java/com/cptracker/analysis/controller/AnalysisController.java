package com.cptracker.analysis.controller;

import com.cptracker.analysis.entity.DailyActivity;
import com.cptracker.analysis.entity.SkillRadar;
import com.cptracker.analysis.entity.UserRating;
import com.cptracker.analysis.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/analysis")
@RequiredArgsConstructor
public class AnalysisController {

    private final ActivityService activityService;
    private final SkillService skillService;
    private final RatingService ratingService;

    @GetMapping("/heatmap/{userId}")
    public ResponseEntity<List<DailyActivity>> getHeatmap(
            @PathVariable("userId") Long userId,
            @RequestParam(defaultValue = "365") int days) {
        return ResponseEntity.ok(activityService.getHeatmapData(userId, days));
    }

    @GetMapping("/skills/{userId}")
    public ResponseEntity<List<SkillRadar>> getSkills(@PathVariable("userId") Long userId) {
        return ResponseEntity.ok(skillService.getSkillRadar(userId));
    }

    @GetMapping("/rating/{userId}")
    public ResponseEntity<UserRating> getRating(@PathVariable("userId") Long userId) {
        return ratingService.getUserRating(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
