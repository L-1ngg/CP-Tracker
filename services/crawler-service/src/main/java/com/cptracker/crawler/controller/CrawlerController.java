package com.cptracker.crawler.controller;

import com.cptracker.crawler.service.CrawlerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/crawler")
@RequiredArgsConstructor
public class CrawlerController {

    private final CrawlerService crawlerService;

    @PostMapping("/sync")
    public ResponseEntity<Void> syncAll() {
        crawlerService.syncAllUsers();
        return ResponseEntity.ok().build();
    }

    @PostMapping("/sync/user/{userId}")
    public ResponseEntity<Void> syncUser(@PathVariable("userId") Long userId) {
        crawlerService.syncUser(userId);
        return ResponseEntity.ok().build();
    }
}
