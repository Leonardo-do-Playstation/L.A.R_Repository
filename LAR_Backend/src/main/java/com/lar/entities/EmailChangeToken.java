package com.lar.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Column;

import java.time.LocalDateTime;

@Entity
public class EmailChangeToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @Column(unique = true)
    public String token;

    public String emailAtual;
    public String novoEmail;
    public LocalDateTime dataExpiracao;

    public EmailChangeToken() {
    }

    public EmailChangeToken(String token, String emailAtual, String novoEmail, LocalDateTime dataExpiracao) {
        this.token = token;
        this.emailAtual = emailAtual;
        this.novoEmail = novoEmail;
        this.dataExpiracao = dataExpiracao;
    }
}