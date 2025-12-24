package com.cptracker.auth.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Value("${server.port:8081}")
    private String serverPort;

    @Bean
    public OpenAPI authServiceOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("Auth Service API")
                .description("CP-Tracker 认证服务 - 用户注册、登录、JWT令牌管理")
                .version("1.0.0")
                .contact(new Contact()
                    .name("CP-Tracker Team")))
            .servers(List.of(
                new Server().url("http://localhost:" + serverPort).description("本地开发"),
                new Server().url("http://localhost:8080").description("通过Gateway访问")
            ));
    }
}
