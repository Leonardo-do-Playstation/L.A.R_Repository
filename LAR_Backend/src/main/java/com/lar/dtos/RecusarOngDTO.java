package com.lar.dtos;

import jakarta.validation.constraints.NotBlank;

public class RecusarOngDTO {

    @NotBlank(message = "O motivo da recusa é obrigatório")
    public String motivo;

    public RecusarOngDTO() {
    }
}