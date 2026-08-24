package com.lar.entities;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.JoinColumn;

import java.time.LocalDateTime;
import java.util.ArrayList;


@Entity
@DiscriminatorValue("ADOTANTE")
public class Adotante extends Usuario {

    @Column(unique = true)
    public String cpf;


    @ManyToMany
    @JoinTable(
        name = "tbl_favoritos",
        joinColumns = @JoinColumn(name = "id_usuario"),
        inverseJoinColumns = @JoinColumn(name = "id_animal")
    )
    public List<Animal> favoritos = new ArrayList<>();

    public Adotante() {
    }

     public Adotante(Long id, String nome, String telefone, String email, String senha, String cpf, String endereco, LocalDateTime data_cadastro) {
        super(id, nome, telefone, email, senha, data_cadastro, endereco);
        this.cpf = cpf;
    }

    public String getCpf() { 
        return cpf; 
    }

    public void setCpf(String cpf) { 
        this.cpf = cpf; 
    }

    public List<Animal> getFavoritos() {
        return favoritos;
    }   
}