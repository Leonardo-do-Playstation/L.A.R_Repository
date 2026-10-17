package com.lar.dtos;

import java.time.LocalDateTime;

public class RegistroAuditoriaDTO {
    public Long id;
    public String usuarioResponsavel;
    public String acao;
    public LocalDateTime dataHora;
    public String registroAfetado;

    public RegistroAuditoriaDTO() {
    }
}