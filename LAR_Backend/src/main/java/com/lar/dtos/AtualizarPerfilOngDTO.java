package com.lar.dtos;

import jakarta.validation.constraints.NotBlank;

public class AtualizarPerfilOngDTO {

    @NotBlank(message = "Nome é obrigatório")
    public String nome;

    public String telefone;
    public String endereco;
    public String observacoes;

    public AtualizarPerfilOngDTO() {
    }
}