package com.lar.dtos;

import com.lar.validators.SenhaForte;

import jakarta.validation.constraints.NotBlank;

public class AtivarAdministradorDTO {

    @NotBlank
    public String token;

    @NotBlank
    @SenhaForte
    public String senha;

    @NotBlank
    public String confirmarSenha;
}