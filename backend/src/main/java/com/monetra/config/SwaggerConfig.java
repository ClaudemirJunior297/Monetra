/* CONFIGURAÇÃO SWAGGER/OPENAPI - SwaggerConfig
 * Configura a documentação automática da API usando OpenAPI 3.0.
 * 
 * Após configurar, a documentação estará disponível em:
 * - Swagger UI: http://localhost:8080/swagger-ui.html
 * - OpenAPI JSON: http://localhost:8080/v3/api-docs
 * 
 * @author Monetra Team
 * @version 1.0.0
 */

package com.monetra.config;

// ===== IMPORTAÇÕES =====
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import io.swagger.v3.oas.models.tags.Tag;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.security.SecurityRequirement;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * CONFIGURAÇÃO DO SWAGGER/OPENAPI
 * 
 * @Configuration - Indica que esta classe contém configurações do Spring
 */
@Configuration
public class SwaggerConfig {

    /**
     * Configuração principal do OpenAPI
     * 
     * @return OpenAPI configurado com informações do projeto
     */
    @Bean
    public OpenAPI customOpenAPI() {
        
        // Informações gerais da API
        Info info = new Info()
            .title("API Monetra - Controle Financeiro")
            .version("1.0.0")
            .description("""
                ## API REST para gerenciamento de finanças pessoais
                
                ### Funcionalidades:
                - ✅ Cadastro e autenticação de usuários
                - ✅ CRUD completo de transações financeiras
                - ✅ Resumo financeiro (receitas, despesas, saldo)
                - ✅ Filtros por categoria, tipo e período
                - ✅ Gráficos e estatísticas
                
                ### Tecnologias:
                - Spring Boot 3.x
                - Spring Data JPA
                - PostgreSQL
                - BCrypt para hash de senhas
                """)
            .contact(new Contact()
                .name("Monetra Team")
                .email("suporte@monetra.com")
                .url("https://monetra.com"))
            .license(new License()
                .name("MIT License")
                .url("https://opensource.org/licenses/MIT"));
        
        // Servidores disponíveis
        Server devServer = new Server()
            .url("http://localhost:8080")
            .description("Servidor de Desenvolvimento");
        
        Server prodServer = new Server()
            .url("https://api.monetra.com")
            .description("Servidor de Produção");
        
        // Tags para organizar os endpoints no Swagger
        List<Tag> tags = List.of(
            new Tag().name("Auth").description("Endpoints de autenticação (login/registro)"),
            new Tag().name("Transactions").description("Endpoints de gerenciamento de transações")
        );
        
        // Configuração de segurança para JWT (futuro)
        SecurityScheme securityScheme = new SecurityScheme()
            .name("bearerAuth")
            .type(SecurityScheme.Type.HTTP)
            .scheme("bearer")
            .bearerFormat("JWT")
            .description("Informe o token JWT: Bearer {token}");
        
        Components components = new Components()
            .addSecuritySchemes("bearerAuth", securityScheme);
        
        SecurityRequirement securityRequirement = new SecurityRequirement()
            .addList("bearerAuth");
        
        return new OpenAPI()
            .info(info)
            .servers(List.of(devServer, prodServer))
            .tags(tags)
            .components(components)
            .addSecurityItem(securityRequirement);
    }
}