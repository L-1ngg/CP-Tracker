package com.cptracker.crawler.controller;

import com.cptracker.crawler.dto.BindHandleRequest;
import com.cptracker.crawler.dto.UserHandleDTO;
import com.cptracker.crawler.service.CrawlerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    /**
     * 绑定平台账号
     */
    @PostMapping("/handles/{userId}")
    public ResponseEntity<UserHandleDTO> bindHandle(
            @PathVariable("userId") Long userId,
            @Valid @RequestBody BindHandleRequest request) {
        UserHandleDTO result = crawlerService.bindHandle(
                userId, request.getPlatform(), request.getHandle());
        return ResponseEntity.ok(result);
    }

    /**
     * 解绑平台账号
     */
    @DeleteMapping("/handles/{userId}/{platform}")
    public ResponseEntity<Void> unbindHandle(
            @PathVariable("userId") Long userId,
            @PathVariable("platform") String platform) {
        crawlerService.unbindHandle(userId, platform);
        return ResponseEntity.ok().build();
    }

    /**
     * 获取用户绑定的账号列表
     */
    @GetMapping("/handles/{userId}")
    public ResponseEntity<List<UserHandleDTO>> getUserHandles(
            @PathVariable("userId") Long userId) {
        List<UserHandleDTO> handles = crawlerService.getUserHandles(userId);
        return ResponseEntity.ok(handles);
    }
}
