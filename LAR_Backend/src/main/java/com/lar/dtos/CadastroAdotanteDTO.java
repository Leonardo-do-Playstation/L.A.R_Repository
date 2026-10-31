package com.lar.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import com.lar.validators.CpfValido;
import com.lar.validators.SenhaForte;

public class CadastroAdotanteDTO {
    @NotBlank(message = "Nome é obrigatório")
    public String nome;

    public String telefone;

    @NotBlank(message = "E-mail é obrigatório")
    @Email(message = "E-mail inválido")
    public String email;

   
    @NotBlank(message = "Nova senha é obrigatória")
    @SenhaForte
    public String senha;


    public String endereco;

    @NotBlank(message = "CPF é obrigatório")
    @CpfValido
    public String cpf;

    public CadastroAdotanteDTO() {
    }

}
