package com.lar.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AtivarAdministradorDTO {

    @NotBlank
    public String token;

    @NotBlank
    @Size(min = 8, message = "A senha deve ter ao menos 8 caracteres")
    public String senha;

    @NotBlank
    public String confirmarSenha;
}