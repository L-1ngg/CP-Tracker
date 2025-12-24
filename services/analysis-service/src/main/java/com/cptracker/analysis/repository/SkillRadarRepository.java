package com.cptracker.analysis.repository;

import com.cptracker.analysis.entity.SkillRadar;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SkillRadarRepository extends JpaRepository<SkillRadar, Long> {

    List<SkillRadar> findByUserId(Long userId);
}
