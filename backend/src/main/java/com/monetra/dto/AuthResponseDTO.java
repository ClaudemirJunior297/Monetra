/**
 * ============================================================================
 * DTO PARA RESPOSTAS DE AUTENTICAÇÃO - AuthResponseDTO
 * ============================================================================
 * 
 * Data Transfer Object para enviar dados do usuário após login/registro.
 * 
 * @author Monetra Team
 * @version 1.0.0
 * ============================================================================
 */

package com.monetra.dto;

// ===== IMPORTAÇÕES =====
import com.monetra.model.AppUser;
import com.monetra.model.UserRole;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

/**
 * DTO para resposta de autenticação
 */
@Schema(description = "Resposta com dados do usuário autenticado")
public class AuthResponseDTO {
    
    @Schema(description = "ID do usuário", example = "1")
    private Long id;
    
    @Schema(description = "Nome do usuário", example = "João Silva")
    private String name;
    
    @Schema(description = "E-mail do usuário", example = "joao@email.com")
    private String email;
    
    @Schema(description = "Papel do usuário", example = "ROLE_USER")
    private String role;
    
    @Schema(description = "Token JWT (opcional)", example = "eyJhbGciOiJIUzI1NiIs...")
    private String token;
    
    @Schema(description = "Data de criação da conta")
    private LocalDateTime createdAt;
    
    // Construtores
    public AuthResponseDTO() {}
    
    public AuthResponseDTO(Long id, String name, String email, String role, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.createdAt = createdAt;
    }
    
    /**
     * Cria um AuthResponseDTO a partir de um AppUser
     * @param user Objeto AppUser
     * @return AuthResponseDTO
     */
    public static AuthResponseDTO fromUser(AppUser user) {
        return new AuthResponseDTO(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getRole() != null ? user.getRole().name() : UserRole.ROLE_USER.name(),
            user.getCreatedAt()
        );
    }
    
    /**
     * Cria um AuthResponseDTO com token JWT
     * @param user Objeto AppUser
     * @param token Token JWT
     * @return AuthResponseDTO
     */
    public static AuthResponseDTO fromUserWithToken(AppUser user, String token) {
        AuthResponseDTO dto = fromUser(user);
        dto.setToken(token);
        return dto;
    }
    
    // Getters e Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getRole() {
        return role;
    }
    
    public void setRole(String role) {
        this.role = role;
    }
    
    public String getToken() {
        return token;
    }
    
    public void setToken(String token) {
        this.token = token;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}