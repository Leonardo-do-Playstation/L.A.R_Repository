package com.lar.dtos;

public class LoginResponseDTO {
    public String token;
    public PerfilLogadoDTO perfil;

    public LoginResponseDTO() {
    }

    public LoginResponseDTO(String token, PerfilLogadoDTO perfil) {
        this.token = token;
        this.perfil = perfil;
    }
}