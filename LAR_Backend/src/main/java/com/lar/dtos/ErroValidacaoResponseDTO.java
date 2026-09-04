package com.lar.dtos;

import java.time.LocalDateTime;
import java.util.Map;

public class ErroValidacaoResponseDTO {
    public LocalDateTime timestamp;
    public int status;
    public String erro;
    public Map<String, String> campos;
    public String path;

    public ErroValidacaoResponseDTO() {
    }

    public ErroValidacaoResponseDTO(int status, String erro, Map<String, String> campos, String path) {
        this.timestamp = LocalDateTime.now();
        this.status = status;
        this.erro = erro;
        this.campos = campos;
        this.path = path;
    }
}