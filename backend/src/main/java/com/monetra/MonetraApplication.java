/**
 * ============================================================================
 * CLASSE PRINCIPAL DA APLICAÇÃO - MonetraApplication
 * ============================================================================
 * 
 * Ponto de entrada da aplicação Spring Boot.
 * Esta classe contém o método main que inicia todo o sistema.
 * 
 * Funcionalidades:
 * - Inicializa o contexto Spring
 * - Sobe o servidor embutido (Tomcat)
 * - Configura componentes automaticamente via @SpringBootApplication
 * 
 * @author Monetra Team
 * @version 1.0.0
 * ============================================================================
 */

package com.monetra;

// ===== IMPORTAÇÕES =====
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * CLASSE PRINCIPAL DA APLICAÇÃO
 * 
 * @SpringBootApplication - Anotação principal do Spring Boot que combina:
 *   - @Configuration: Marca a classe como fonte de definições de beans
 *   - @EnableAutoConfiguration: Configura automaticamente o Spring baseado nas dependências
 *   - @ComponentScan: Escaneia componentes na pasta com.monetra
 * 
 * @EnableJpaAuditing - Habilita auditoria automática (createdAt, updatedAt)
 * @EnableScheduling - Habilita tarefas agendadas (se necessário)
 * @EnableConfigurationProperties - Habilita propriedades de configuração customizadas
 */
@SpringBootApplication
@EnableJpaAuditing
@EnableScheduling
@EnableConfigurationProperties
public class MonetraApplication {

    /**
     * ========================================================================
     * MÉTODO PRINCIPAL - MAIN
     * ========================================================================
     * 
     * Ponto de entrada da aplicação. O Spring Boot inicia:
     * 1. O contêiner IoC (Inversão de Controle)
     * 2. O servidor web embutido (Tomcat por padrão)
     * 3. Todas as configurações automáticas
     * 
     * @param args Argumentos de linha de comando (opcionais)
     */
    public static void main(String[] args) {
        // Inicia a aplicação Spring Boot
        // O parâmetro args permite passar configurações na linha de comando
        // Exemplo: java -jar monetra-api.jar --server.port=9090
        SpringApplication.run(MonetraApplication.class, args);
        
        // Mensagem opcional para indicar que a aplicação iniciou
        System.out.println("""
        \n
        ╔═══════════════════════════════════════════════════════════════╗
        ║                                                               ║
        ║     ███╗   ███╗ ██████╗ ███╗   ██╗███████╗████████╗██████╗   ║
        ║     ████╗ ████║██╔═══██╗████╗  ██║██╔════╝╚══██╔══╝██╔══██╗  ║
        ║     ██╔████╔██║██║   ██║██╔██╗ ██║█████╗     ██║   ██████╔╝  ║
        ║     ██║╚██╔╝██║██║   ██║██║╚██╗██║██╔══╝     ██║   ██╔══██╗  ║
        ║     ██║ ╚═╝ ██║╚██████╔╝██║ ╚████║███████╗   ██║   ██║  ██║  ║
        ║     ╚═╝     ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚══════╝   ╚═╝   ╚═╝  ╚═╝  ║
        ║                                                               ║
        ║              API MONETRA - Controle Financeiro                ║
        ║                      Versão 1.0.0                             ║
        ║                                                               ║
        ║  Servidor iniciado com sucesso! 🚀                            ║
        ║                                                               ║
        ║  📍 API: http://localhost:8080                                ║
        ║  📍 Swagger UI: http://localhost:8080/swagger-ui.html        ║
        ║  📍 Health Check: http://localhost:8080/api/health           ║
        ║                                                               ║
        ╚═══════════════════════════════════════════════════════════════╝
        """);
    }
}