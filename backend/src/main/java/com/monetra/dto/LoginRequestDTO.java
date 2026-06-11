/**
 * ============================================================================
 * DTO PARA REQUISIÇÕES DE AUTENTICAÇÃO - AuthRequestDTO
 * ============================================================================
 * 
 * Data Transfer Object para receber dados de login e registro.
 * 
 * @author Monetra Team
 * @version 1.0.0
 * ============================================================================
 */

package com.monetra.dto;

// ===== IMPORTAÇÕES =====
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import io.swagger.v3.oas.annotations.media.Schema;

/**
 * DTO para requisição de login
 */
@Schema(description = "Dados para autenticação do usuário")
public class LoginRequestDTO {
    
    @Schema(description = "E-mail do usuário", example = "joao@email.com", required = true)
    @NotBlank(message = "E-mail é obrigatório")
    @Email(message = "E-mail inválido")
    private String email;
    
    @Schema(description = "Senha do usuário", example = "123456", required = true)
    @NotBlank(message = "Senha é obrigatória")
    private String password;
    
    // Construtores
    public LoginRequestDTO() {}
    
    public LoginRequestDTO(String email, String password) {
        this.email = email;
        this.password = password;
    }
    
    // Getters e Setters
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
}

/**
 * DTO para requisição de registro
 */
@Schema(description = "Dados para registro de novo usuário")
class RegisterRequestDTO {
    
    @Schema(description = "Nome completo do usuário", example = "João Silva", required = true)
    @NotBlank(message = "Nome é obrigatório")
    @Size(min = 3, max = 100, message = "Nome deve ter entre 3 e 100 caracteres")
    private String name;
    
    @Schema(description = "E-mail do usuário", example = "joao@email.com", required = true)
    @NotBlank(message = "E-mail é obrigatório")
    @Email(message = "E-mail inválido")
    private String email;
    
    @Schema(description = "Senha do usuário", example = "123456", required = true)
    @NotBlank(message = "Senha é obrigatória")
    @Size(min = 6, max = 100, message = "Senha deve ter entre 6 e 100 caracteres")
    private String password;
    
    // Construtores
    public RegisterRequestDTO() {}
    
    public RegisterRequestDTO(String name, String email, String password) {
        this.name = name;
        this.email = email;
        this.password = password;
    }
    
    // Getters e Setters
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
    
    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
}