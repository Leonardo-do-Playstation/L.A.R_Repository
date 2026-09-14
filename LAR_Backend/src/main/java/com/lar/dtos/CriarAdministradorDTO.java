package com.lar.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class CriarAdministradorDTO {

    @NotBlank(message = "Nome é obrigatório")
    public String nome;

    @NotBlank(message = "E-mail é obrigatório")
    @Email(message = "E-mail inválido")
    public String email;

    @NotBlank(message = "Senha é obrigatória")
    public String senha;

    @NotBlank(message = "Código de admin é obrigatório")
    public String codigoAdmin;

    public CriarAdministradorDTO() {
    }
}