package com.lar.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "convites_administrador")
public class ConviteAdministrador {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 64)
    private String tokenHash;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String codigoAdmin;

    @Column(nullable = false)
    private String criadoPor;

    @Column(nullable = false)
    private LocalDateTime expiraEm;

    private LocalDateTime utilizadoEm;

    protected ConviteAdministrador() {}

    public ConviteAdministrador(
            String tokenHash,
            String nome,
            String email,
            String codigoAdmin,
            String criadoPor,
            LocalDateTime expiraEm) {

        this.tokenHash = tokenHash;
        this.nome = nome;
        this.email = email;
        this.codigoAdmin = codigoAdmin;
        this.criadoPor = criadoPor;
        this.expiraEm = expiraEm;
    }

    public Long getId() { return id; }
    public String getNome() { return nome; }
    public String getEmail() { return email; }
    public String getCodigoAdmin() { return codigoAdmin; }
    public String getCriadoPor() { return criadoPor; }
    public LocalDateTime getExpiraEm() { return expiraEm; }
    public LocalDateTime getUtilizadoEm() { return utilizadoEm; }

    public void setUtilizadoEm(LocalDateTime data) {
        this.utilizadoEm = data;
    }
}