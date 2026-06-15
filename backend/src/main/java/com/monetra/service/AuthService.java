package com.monetra.service;

import com.monetra.model.AppUser;
import com.monetra.repository.AppUserRepository;
import org.springframework.stereotype.Service;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

@Service
public class AuthService {
    private final AppUserRepository userRepository;

    public AuthService(AppUserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public AppUser register(String name, String email, String password) {
        validateName(name);
        validateEmail(email);
        validatePassword(password);

        String normalizedEmail = email.trim().toLowerCase();
        if (userRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            throw new IllegalArgumentException("E-mail já cadastrado");
        }

        return userRepository.save(new AppUser(name.trim(), normalizedEmail, hash(password)));
    }

    public AppUser login(String email, String password) {
        validateEmail(email);
        validatePassword(password);
        String normalizedEmail = email.trim().toLowerCase();
        AppUser user = userRepository.findByEmailIgnoreCase(normalizedEmail)
                .orElseThrow(() -> new IllegalArgumentException("E-mail ou senha inválidos"));

        if (!user.getPasswordHash().equals(hash(password))) {
            throw new IllegalArgumentException("E-mail ou senha inválidos");
        }
        return user;
    }

    public AppUser resetPassword(String email, String newPassword) {
        validateEmail(email);
        validatePassword(newPassword);
        String normalizedEmail = email.trim().toLowerCase();
        AppUser user = userRepository.findByEmailIgnoreCase(normalizedEmail)
                .orElseThrow(() -> new IllegalArgumentException("E-mail nao encontrado"));
        user.setPasswordHash(hash(newPassword));
        return userRepository.save(user);
    }

    private void validateName(String name) {
        if (name == null || name.trim().length() < 3) {
            throw new IllegalArgumentException("Nome deve ter pelo menos 3 caracteres");
        }
    }

    private void validateEmail(String email) {
        if (email == null || !email.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")) {
            throw new IllegalArgumentException("E-mail inválido");
        }
    }

    private void validatePassword(String password) {
        if (password == null || password.length() < 6) {
            throw new IllegalArgumentException("Senha deve ter pelo menos 6 caracteres");
        }
    }

    private String hash(String value) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] encoded = digest.digest(value.getBytes(StandardCharsets.UTF_8));
            StringBuilder builder = new StringBuilder();
            for (byte b : encoded) {
                builder.append(String.format("%02x", b));
            }
            return builder.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("Algoritmo de hash indisponível", e);
        }
    }
}
