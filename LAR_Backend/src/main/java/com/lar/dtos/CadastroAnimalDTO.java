package com.lar.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public class CadastroAnimalDTO {

    @NotBlank(message = "Nome é obrigatório")
    public String nome;

    @NotBlank(message = "Espécie é obrigatória")
    public String especie;

    @NotNull(message = "Idade é obrigatória")
    @PositiveOrZero(message = "Idade não pode ser negativa")
    public Integer idade;

    public String raca;
    public String sexo;
    public String porte;
    public String cor;
    public String descricao;

    public CadastroAnimalDTO() {
    }
}