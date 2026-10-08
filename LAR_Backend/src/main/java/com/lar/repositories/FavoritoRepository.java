package com.lar.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.lar.entities.Favorito;

import java.util.List;
import java.util.Optional;

public interface FavoritoRepository extends JpaRepository<Favorito, Long> {
    boolean existsByAdotanteIdAndAnimalId(Long idAdotante, Long idAnimal);

    Optional<Favorito> findByAdotanteIdAndAnimalId(Long idAdotante, Long idAnimal);

    List<Favorito> findByAdotanteIdOrderByDataFavoritadoDesc(Long idAdotante);
}