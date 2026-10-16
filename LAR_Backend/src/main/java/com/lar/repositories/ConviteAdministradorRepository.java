package com.lar.repositories;

import com.lar.entities.ConviteAdministrador;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ConviteAdministradorRepository
        extends JpaRepository<ConviteAdministrador, Long> {

    Optional<ConviteAdministrador> findByTokenHash(String tokenHash);

    boolean existsByEmailAndUtilizadoEmIsNull(String email);

    boolean existsByCodigoAdminAndUtilizadoEmIsNull(String codigoAdmin);
}