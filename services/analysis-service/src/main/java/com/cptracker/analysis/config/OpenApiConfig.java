package com.cptracker.analysis.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Value("${server.port:8083}")
    private String serverPort;

    @Bean
    public OpenAPI analysisServiceOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("Analysis Service API")
                .description("CP-Tracker 分析服务 - 热力图、技能雷达、Rating分析")
                .version("1.0.0"))
            .servers(List.of(
                new Server().url("http://localhost:" + serverPort).description("本地开发"),
                new Server().url("http://localhost:8080").description("通过Gateway访问")
            ));
    }
}
