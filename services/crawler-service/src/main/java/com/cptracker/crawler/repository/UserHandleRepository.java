package com.cptracker.crawler.repository;

import com.cptracker.crawler.entity.UserHandle;
import com.cptracker.crawler.entity.UserHandleId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserHandleRepository extends JpaRepository<UserHandle, UserHandleId> {

    List<UserHandle> findByPlatform(String platform);

    List<UserHandle> findByUserId(Long userId);
}
