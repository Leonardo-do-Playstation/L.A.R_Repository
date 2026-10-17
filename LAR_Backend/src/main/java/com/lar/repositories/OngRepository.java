package com.lar.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.lar.entities.Ong;
import com.lar.enums.StatusOng;
import java.util.List;
import java.util.Optional;

public interface OngRepository extends JpaRepository<Ong, Long>, JpaSpecificationExecutor<Ong> {
    boolean existsByCnpj(String cnpj);

    List<Ong> findByStatus(StatusOng status);

    List<Ong> findByStatusAndNomeContainingIgnoreCase(StatusOng status, String nome);

    Optional<Ong> findByEmail(String email);
}
