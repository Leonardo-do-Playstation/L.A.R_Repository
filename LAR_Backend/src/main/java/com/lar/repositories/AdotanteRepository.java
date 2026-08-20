package com.lar.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.lar.entities.Adotante;

@Repository
public interface AdotanteRepository extends JpaRepository<Adotante, Long> {
    boolean existsByCpf(String cpf);
}