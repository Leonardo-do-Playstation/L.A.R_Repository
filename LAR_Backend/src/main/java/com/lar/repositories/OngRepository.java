package com.lar.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lar.entities.Ong;
import com.lar.enums.StatusOng;
import java.util.List;
import java.util.Optional;

public interface OngRepository extends JpaRepository<Ong, Long> {
    boolean existsByCnpj(String cnpj);

    List<Ong> findByStatus(StatusOng status);

    Optional<Ong> findByEmail(String email);

    List<Ong> findByStatusAndNomeContainingIgnoreCase(StatusOng status, String nome);
}
