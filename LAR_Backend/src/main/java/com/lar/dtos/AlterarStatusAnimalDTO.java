package com.lar.dtos;

import jakarta.validation.constraints.NotBlank;

public class AlterarStatusAnimalDTO {

    @NotBlank(message = "Status é obrigatório")
    public String status;

    public AlterarStatusAnimalDTO() {
    }
}