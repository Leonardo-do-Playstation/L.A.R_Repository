package com.lar.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Column;

import java.time.LocalDateTime;

@Entity
public class ExclusaoContaToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @Column(unique = true)
    public String token;

    public String email;

    public LocalDateTime dataExpiracao;

    public ExclusaoContaToken() {
    }

    public ExclusaoContaToken(String token, String email, LocalDateTime dataExpiracao) {
        this.token = token;
        this.email = email;
        this.dataExpiracao = dataExpiracao;
    }
}