package com.lar.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.lar.entities.Administrador;

public interface AdministradorRepository extends JpaRepository<Administrador, Long> {
    boolean existsByCodigoAdmin(String codigoAdmin);

    Optional<Administrador> findByEmail(String email);
}
