package com.lar.dtos;

import java.time.LocalDateTime;

public class ErroResponseDTO {
    public LocalDateTime timestamp;
    public int status;
    public String erro;
    public String mensagem;
    public String path;

    public ErroResponseDTO() {
    }

    public ErroResponseDTO(int status, String erro, String mensagem, String path) {
        this.timestamp = LocalDateTime.now();
        this.status = status;
        this.erro = erro;
        this.mensagem = mensagem;
        this.path = path;
    }
}