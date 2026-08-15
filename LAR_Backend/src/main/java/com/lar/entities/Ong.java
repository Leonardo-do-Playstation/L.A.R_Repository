package com.lar.entities;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;

@Entity
@DiscriminatorValue("ONG")
public class Ong extends Usuario {
    
    @Column(unique = true)
    public String cnpj;

    @OneToMany(mappedBy = "ong")
    public List<Animal> animais = new ArrayList<>();


    public Ong() {
    }

     public Ong(Long id, String nome, String telefone, String email, String senha, String cnpj, String endereço, LocalDateTime data_cadastro) {
        super(id, nome, telefone, email, senha, data_cadastro, endereço);
        this.cnpj = cnpj;
    }

    public String getCnpj() {
         return cnpj; 
        }

    public void setCnpj(String cnpj) { 
        this.cnpj = cnpj;
     }


    public List<Animal> getAnimais() {
        return animais;
    }
}
