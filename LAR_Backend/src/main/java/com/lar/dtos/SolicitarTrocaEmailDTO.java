package com.lar.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class SolicitarTrocaEmailDTO {

    @NotBlank(message = "Novo e-mail é obrigatório")
    @Email(message = "E-mail inválido")
    public String novoEmail;

    @NotBlank(message = "Senha é obrigatória")
    public String senha;

    public SolicitarTrocaEmailDTO() {
    }
}