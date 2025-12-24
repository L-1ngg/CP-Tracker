package com.cptracker.gateway.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI gatewayOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("CP-Tracker API Gateway")
                .description("算法竞赛数据聚合与分析平台 - 统一API入口")
                .version("1.0.0"));
    }
}
