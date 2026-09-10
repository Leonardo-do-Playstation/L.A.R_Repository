package com.lar.dtos;

import jakarta.validation.constraints.NotBlank;

public class SolicitarExclusaoDTO {

    @NotBlank(message = "Senha é obrigatória")
    public String senha;

    public SolicitarExclusaoDTO() {
    }
}