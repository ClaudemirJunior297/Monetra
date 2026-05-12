/**
 * MonetaBackendApplication
 * 
 * Classe principal da aplicação Spring Boot para o backend do Monetra.
 * Responsável por inicializar a aplicação e configurar a documentação da API.
 * 
 * @author Monetra Team
 * @version 1.0.0
 */
package com.monetra;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

/**
 * Classe anotada com @SpringBootApplication que marca como ponto de entrada da aplicação.
 * Habilita auto-configuração do Spring Boot e component scanning automático.
 */
@SpringBootApplication
public class MonetaBackendApplication {

    /**
     * Método main - Ponto de entrada da aplicação.
     * Inicializa o servidor Spring Boot na porta 8080.
     * 
     * @param args Argumentos de linha de comando (não utilizado)
     */
    public static void main(String[] args) {
        SpringApplication.run(MonetaBackendApplication.class, args);
    }

    /**
     * Configura a documentação OpenAPI (Swagger) da aplicação.
     * Este bean personalizado define as informações que aparecerão na documentação automática.
     * 
     * Acessível em: http://localhost:8080/swagger-ui.html
     * 
     * @return Objeto OpenAPI com as informações da API configuradas
     */
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Monetra API")
                        .version("1.0.0")
                        .description("Backend REST API para gerenciamento de transações financeiras"));
    }
}
