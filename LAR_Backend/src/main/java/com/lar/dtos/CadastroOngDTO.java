package com.lar.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import com.lar.validators.CnpjValido;

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

    @NotBlank(message = "CNPJ é obrigatório")
    @CnpjValido
    public String cnpj;
        
    public CadastroOngDTO() {
    }
}
