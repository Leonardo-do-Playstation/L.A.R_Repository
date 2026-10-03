package com.lar.entities;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

import java.time.LocalDateTime;

@Entity
@DiscriminatorValue("ADOTANTE")
public class Adotante extends Usuario {

    @Column(unique = true)
    public String cpf;

    public Adotante() {
    }

    public Adotante(Long id, String nome, String telefone, String email, String senha, String cpf, String endereco,
            LocalDateTime data_cadastro) {
        super(id, nome, telefone, email, senha, data_cadastro, endereco);
        this.cpf = cpf;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }
}