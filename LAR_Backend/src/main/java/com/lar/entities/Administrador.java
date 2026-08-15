package com.lar.entities;

import java.time.LocalDateTime;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("ADMIN")
public class Administrador extends Usuario {



    public Administrador() {
    }

    public Administrador(Long id, String nome, String telefone, String email, String senha, String endereço, LocalDateTime data_cadastro) {
        super(id, nome, telefone, email, senha, data_cadastro, endereço);
    }



}
