package com.lar.entities;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class RegistroAuditoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    public String usuarioResponsavel;
    public String acao;

    public LocalDateTime dataHora;

    @Column(length = 500)
    public String registroAfetado;

    public RegistroAuditoria() {

    }

     public RegistroAuditoria(String usuarioResponsavel, String acao, String registroAfetado) {
        this.usuarioResponsavel = usuarioResponsavel;
        this.acao = acao;
        this.registroAfetado = registroAfetado;
        this.dataHora = LocalDateTime.now();
    }
}
