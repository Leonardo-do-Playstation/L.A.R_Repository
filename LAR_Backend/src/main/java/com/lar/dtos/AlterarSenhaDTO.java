package com.lar.dtos;

import com.lar.validators.SenhaForte;

import jakarta.validation.constraints.NotBlank;

public class AlterarSenhaDTO {

    @NotBlank(message = "Senha atual é obrigatória")
    public String senhaAtual;

    @NotBlank(message = "Nova senha é obrigatória")
    @SenhaForte
    public String novaSenha;

    public AlterarSenhaDTO() {
    }
}