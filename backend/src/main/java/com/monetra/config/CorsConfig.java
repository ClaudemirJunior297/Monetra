/**
 * CorsConfig
 * 
 * Classe de configuração para CORS (Cross-Origin Resource Sharing).
 * Permite que o frontend (Expo/React Native) acesse a API do backend sem restrições de origem.
 * 
 * CORS é um mecanismo de segurança dos navegadores que bloqueia requisições cross-origin
 * por padrão. Esta configuração abre essas requisições para desenvolvimento e produção.
 * 
 * @author Monetra Team
 * @version 1.0.0
 */
package com.monetra.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Classe de configuração anotada com @Configuration.
 * Implementa WebMvcConfigurer para personalizar a configuração MVC do Spring.
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    /**
     * Configura os mapeamentos CORS para a aplicação.
     * 
     * Configurações aplicadas:
     * - Mapping: /api/** - Aplica CORS a todos os endpoints da API
     * - Allowed Origins: * - Aceita requisições de qualquer origem (útil para desenvolvimento)
     * - Allowed Methods: GET, POST, PUT, DELETE, OPTIONS - Métodos HTTP permitidos
     * - Allowed Headers: * - Aceita qualquer header nas requisições
     * - Credentials: false - Não requer credenciais nas requisições
     * - Max Age: 3600 - Cache de preflight requests por 1 hora
     * 
     * NOTA: Em produção, considere restringir allowedOrigins("/api/**") para domínios específicos
     * 
     * @param registry Objeto para registrar as configurações CORS
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                // Permite requisições de qualquer origem (considere restringir em produção)
                .allowedOrigins("*")
                // Métodos HTTP permitidos
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                // Headers permitidos nas requisições
                .allowedHeaders("*")
                // Não requer credenciais (cookies, auth headers)
                .allowCredentials(false)
                // Cache do preflight request por 1 hora (3600 segundos)
                .maxAge(3600);
    }
}
