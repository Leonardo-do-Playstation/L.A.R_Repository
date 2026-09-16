package com.lar.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AlterarSenhaDTO {

    @NotBlank(message = "Senha atual é obrigatória")
    public String senhaAtual;

    @NotBlank(message = "Nova senha é obrigatória")
    @Size(min = 6, message = "A nova senha deve ter pelo menos 6 caracteres")
    public String novaSenha;

    @NotBlank(message = "Confirmação da nova senha é obrigatória")
    public String confirmarNovaSenha;

    public AlterarSenhaDTO() {
    }
}