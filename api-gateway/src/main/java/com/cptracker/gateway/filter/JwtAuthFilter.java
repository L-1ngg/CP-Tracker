package com.cptracker.gateway.filter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Slf4j
@Component
public class JwtAuthFilter implements GlobalFilter, Ordered {

    @Value("${jwt.secret}")
    private String secret;

    private static final List<String> PUBLIC_PATHS = List.of(
            "/api/auth/login",
            "/api/auth/register",
            "/v3/api-docs",
            "/swagger-ui"
    );

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String path = exchange.getRequest().getPath().value();

        // 跳过公开路径
        if (isPublicPath(path)) {
            return chain.filter(exchange);
        }

        String authHeader = exchange.getRequest().getHeaders().getFirst("Authorization");

        // 没有 Authorization 头，直接放行（让后端服务决定是否需要认证）
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return chain.filter(exchange);
        }

        try {
            String token = authHeader.substring(7);
            Claims claims = extractClaims(token);

            // 从 token 中提取用户信息
            String username = claims.getSubject();
            Object userIdObj = claims.get("userId");
            String role = (String) claims.get("role");

            // 添加用户信息到请求头
            ServerHttpRequest.Builder requestBuilder = exchange.getRequest().mutate();

            if (username != null) {
                requestBuilder.header("X-User-Name", username);
            }
            if (userIdObj != null) {
                requestBuilder.header("X-User-Id", String.valueOf(userIdObj));
            }
            if (role != null) {
                requestBuilder.header("X-User-Role", role);
            }

            ServerHttpRequest modifiedRequest = requestBuilder.build();
            return chain.filter(exchange.mutate().request(modifiedRequest).build());

        } catch (Exception e) {
            log.warn("JWT 解析失败: {}", e.getMessage());
            // Token 无效，不添加用户信息头，让后端服务决定如何处理
            return chain.filter(exchange);
        }
    }

    private boolean isPublicPath(String path) {
        return PUBLIC_PATHS.stream().anyMatch(path::startsWith);
    }

    private Claims extractClaims(String token) {
        SecretKey key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    @Override
    public int getOrder() {
        return -100; // 高优先级
    }
}
