package com.cptracker.analysis.config;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.Session;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
@Component
public class UserDataFilter extends OncePerRequestFilter {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        String userIdHeader = request.getHeader("X-User-Id");
        if (StringUtils.hasText(userIdHeader)) {
            try {
                Long userId = Long.valueOf(userIdHeader);
                Session session = entityManager.unwrap(Session.class);
                session.enableFilter("userFilter").setParameter("userId", userId);
            } catch (NumberFormatException ex) {
                log.warn("Invalid X-User-Id header: {}", userIdHeader);
            }
        }
        filterChain.doFilter(request, response);
    }
}
