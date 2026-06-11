/* CONFIGURAÇÃO DE SEGURANÇA - SecurityConfig
 * Configura a segurança da aplicação Spring Security.
 * 
 * Funcionalidades:
 * - Desabilita CSRF (para APIs REST)
 * - Configura CORS
 * - Libera endpoints públicos (auth, docs)
 * - Exige autenticação para os demais endpoints
 * - Configura BCrypt para hash de senhas
 * 
 * @author Monetra Team
 * @version 2.0.0
 */

package com.monetra.config;

// ===== IMPORTAÇÕES =====
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

/**
 * CONFIGURAÇÃO DE SEGURANÇA
 * 
 * @Configuration - Indica que esta classe contém configurações do Spring
 * @EnableWebSecurity - Habilita a segurança web do Spring Security
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    /**
     * URLs públicas (não exigem autenticação)
     */
    private static final String[] PUBLIC_URLS = {
        "/api/auth/**",           // Login e registro
        "/api/health",            // Health check
        "/swagger-ui/**",         // Swagger UI
        "/v3/api-docs/**",        // Documentação OpenAPI
        "/h2-console/**"          // Console H2 (apenas desenvolvimento)
    };

    /**
     * Configuração do filtro de segurança
     * 
     * @param http HttpSecurity para configurar a segurança
     * @return SecurityFilterChain configurado
     * @throws Exception em caso de erro na configuração
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        
        http
            // Desabilita CSRF (não necessário para APIs REST stateless)
            .csrf(AbstractHttpConfigurer::disable)
            
            // Configura CORS
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            
            // Configura gerenciamento de sessão (stateless)
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            
            // Configura autorização das requisições
            .authorizeHttpRequests(auth -> auth
                // URLs públicas (não exigem autenticação)
                .requestMatchers(PUBLIC_URLS).permitAll()
                // Qualquer outra requisição exige autenticação
                .anyRequest().authenticated()
            );
        
        return http.build();
    }

    /**
     * Configuração CORS para o Spring Security
     * 
     * @return CorsConfigurationSource configurado
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Origens permitidas
        configuration.setAllowedOrigins(List.of("*"));
        
        // Métodos permitidos
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        
        // Headers permitidos
        configuration.setAllowedHeaders(List.of("*"));
        
        // Headers expostos
        configuration.setExposedHeaders(List.of("Authorization", "Content-Type"));
        
        // Credenciais
        configuration.setAllowCredentials(false);
        
        // Tempo de cache (1 hora)
        configuration.setMaxAge(3600L);
        
        // Registra configuração para todos os endpoints
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        
        return source;
    }

    /**
     * Password encoder usando BCrypt
     * 
     * BCrypt é o algoritmo recomendado para hash de senhas:
     * - Inclui salt automaticamente
     * - É propositalmente lento (dificulta ataques de força bruta)
     * - Pode ser ajustado para ficar mais forte no futuro
     * 
     * @return PasswordEncoder configurado
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}