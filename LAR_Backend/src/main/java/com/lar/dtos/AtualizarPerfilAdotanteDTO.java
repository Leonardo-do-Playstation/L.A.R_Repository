package com.lar.dtos;

import jakarta.validation.constraints.NotBlank;

public class AtualizarPerfilAdotanteDTO {

    @NotBlank(message = "Nome é obrigatório")
    public String nome;

    public String telefone;
    public String endereco;

    public AtualizarPerfilAdotanteDTO() {
    }
}