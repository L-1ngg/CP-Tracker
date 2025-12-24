package com.cptracker.analysis.service;

import com.cptracker.analysis.entity.UserRating;
import com.cptracker.analysis.repository.UserRatingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RatingService {

    private final UserRatingRepository userRatingRepository;

    public Optional<UserRating> getUserRating(Long userId) {
        return userRatingRepository.findById(userId);
    }
}
