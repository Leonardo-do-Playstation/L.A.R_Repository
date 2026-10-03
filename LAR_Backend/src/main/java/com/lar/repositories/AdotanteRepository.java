package com.lar.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lar.entities.Adotante;

public interface AdotanteRepository extends JpaRepository<Adotante, Long> {
    boolean existsByCpf(String cpf);

    Optional<Adotante> findByEmail(String email);
}