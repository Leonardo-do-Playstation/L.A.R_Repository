package com.lar.dtos;

import com.lar.validators.SenhaForte;

import jakarta.validation.constraints.NotBlank;

public class RedefinirSenhaDTO {

    @NotBlank(message = "Token é obrigatório")
    public String token;

    @NotBlank(message = "Nova senha é obrigatória")
    @SenhaForte
    public String novaSenha;

    public RedefinirSenhaDTO() {}
}