package com.lar.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class CadastroAnimalDTO {

    @NotBlank(message = "Nome é obrigatório")
    public String nome;

    @NotBlank(message = "Espécie é obrigatória")
    public String especie;

    @NotNull(message = "Idade é obrigatória")
    @Positive(message = "Idade deve ser maior que zero")
    public Integer idade;

    public String raca;
    public String sexo;
    public String porte;
    public String cor;
    public String descricao;
    public String foto;

    public CadastroAnimalDTO() {
    }
}
