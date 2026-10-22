package com.lar.dtos;

import java.time.LocalDateTime;

public class OngPerfilDTO {
    public Long id;
    public String nome;
    public String email;
    public String telefone;
    public String endereco;
    public String observacoes;
    public String cnpj;
    public String foto;
    public String status;
    public LocalDateTime dataCadastro;

    public OngPerfilDTO() {
    }
}