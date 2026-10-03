package com.lar.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tbl_favoritos", uniqueConstraints = @UniqueConstraint(columnNames = { "id_adotante", "id_animal" }))
public class Favorito {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @ManyToOne
    @JoinColumn(name = "id_adotante", nullable = false)
    public Adotante adotante;

    @ManyToOne
    @JoinColumn(name = "id_animal", nullable = false)
    public Animal animal;

    public LocalDateTime dataFavoritado;

    public Favorito() {
    }

    public Favorito(Adotante adotante, Animal animal) {
        this.adotante = adotante;
        this.animal = animal;
        this.dataFavoritado = LocalDateTime.now();
    }
}
