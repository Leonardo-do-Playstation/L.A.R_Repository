package com.lar.dtos;

import jakarta.validation.constraints.NotBlank;

public class ConfirmarTrocaEmailDTO {

    @NotBlank(message = "Token é obrigatório")
    public String token;

    public ConfirmarTrocaEmailDTO() {
    }
}