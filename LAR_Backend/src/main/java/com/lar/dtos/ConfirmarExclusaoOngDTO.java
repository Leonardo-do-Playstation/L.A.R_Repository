package com.lar.dtos;

import jakarta.validation.constraints.NotBlank;

public class ConfirmarExclusaoOngDTO {

    @NotBlank(message = "Token de confirmação é obrigatório")
    public String token;

    public ConfirmarExclusaoOngDTO() {
    }
}