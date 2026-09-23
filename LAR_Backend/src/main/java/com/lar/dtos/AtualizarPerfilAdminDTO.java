package com.lar.dtos;

import jakarta.validation.constraints.NotBlank;

public class AtualizarPerfilAdminDTO {

    @NotBlank(message = "Nome é obrigatório")
    public String nome;

    public String telefone;
    public String endereco;

    public AtualizarPerfilAdminDTO() {
    }
}