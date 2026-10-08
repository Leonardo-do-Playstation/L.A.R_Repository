package com.lar.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class CadastroOngDTO {
    @NotBlank(message = "Nome é obrigatório")
    public String nome;

    public String telefone;

    @NotBlank(message = "E-mail é obrigatório")
    @Email(message = "E-mail inválido")
    public String email;

    @NotBlank(message = "Senha é obrigatória")
    public String senha;

    public String endereco;

    public String cnpj;
        
    public CadastroOngDTO() {
    }
}
