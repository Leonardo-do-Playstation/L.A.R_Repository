package com.lar.entities;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("ADMIN")
public class Administrador extends Usuario {

    @Column(unique = true)
    public String codigoAdmin;

    public Boolean superAdmin = false;

    public Administrador() {
    }

    public Administrador(Long id, String nome, String telefone, String email, String senha, String codigoAdmin,
            String endereco, LocalDateTime data_cadastro) {
        super(id, nome, telefone, email, senha, data_cadastro, endereco);
        this.codigoAdmin = codigoAdmin;
    }

    public String getCodigoAdmin() {
        return codigoAdmin;
    }

    public void setCodigoAdmin(String codigoAdmin) {
        this.codigoAdmin = codigoAdmin;
    }

    public Boolean getSuperAdmin() {
        return superAdmin;
    }

    public void setSuperAdmin(Boolean superAdmin) {
        this.superAdmin = superAdmin;
    }
}