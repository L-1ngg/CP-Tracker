package com.cptracker.analysis.service;

import com.cptracker.analysis.entity.SkillRadar;
import com.cptracker.analysis.repository.SkillRadarRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SkillService {

    private final SkillRadarRepository skillRadarRepository;

    public List<SkillRadar> getSkillRadar(Long userId) {
        return skillRadarRepository.findByUserId(userId);
    }
}
