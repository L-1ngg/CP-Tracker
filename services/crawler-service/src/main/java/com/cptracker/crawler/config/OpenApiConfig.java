package com.cptracker.crawler.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Value("${server.port:8082}")
    private String serverPort;

    @Bean
    public OpenAPI crawlerServiceOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("Crawler Service API")
                .description("CP-Tracker 爬虫服务 - Codeforces/AtCoder/NowCoder数据同步")
                .version("1.0.0"))
            .servers(List.of(
                new Server().url("http://localhost:" + serverPort).description("本地开发"),
                new Server().url("http://localhost:8080").description("通过Gateway访问")
            ));
    }
}
