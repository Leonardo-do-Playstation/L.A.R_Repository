package com.lar.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class AtualizarUsuarioAdminDTO {

    @NotBlank(message = "Nome é obrigatório")
    public String nome;

    @NotBlank(message = "E-mail é obrigatório")
    @Email(message = "E-mail inválido")
    public String email;

    public String telefone;
    public String endereco;
    public String cnpj; // CNPJ pode ser alterado caso incorreto pois não é sensivel.


    public AtualizarUsuarioAdminDTO() {
    }
}