package com.cptracker.core.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Value("${server.port:8084}")
    private String serverPort;

    @Bean
    public OpenAPI coreServiceOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("Core Service API")
                .description("CP-Tracker 核心服务 - 博客管理、比赛日历")
                .version("1.0.0"))
            .servers(List.of(
                new Server().url("http://localhost:" + serverPort).description("本地开发"),
                new Server().url("http://localhost:8080").description("通过Gateway访问")
            ));
    }
}
