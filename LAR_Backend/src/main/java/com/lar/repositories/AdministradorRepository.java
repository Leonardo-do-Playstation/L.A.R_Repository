package com.lar.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.lar.entities.Administrador;

public interface AdministradorRepository extends JpaRepository<Administrador, Long> {
    boolean existsByCodigoAdmin(String codigoAdmin);
}
