package com.lar.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Column;

import java.time.LocalDateTime;

@Entity
public class PasswordResetToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @Column(unique = true)
    public String token;

    public String email;

    public LocalDateTime dataExpiracao;

    public PasswordResetToken() {
    }

    public PasswordResetToken(String token, String email, LocalDateTime dataExpiracao) {
        this.token = token;
        this.email = email;
        this.dataExpiracao = dataExpiracao;
    }

    public Long getId() {
        return id;
    }

    public String getToken() {
        return token;
    }

    public String getEmail() {
        return email;
    }

    public LocalDateTime getDataExpiracao() {
        return dataExpiracao;
    }
}