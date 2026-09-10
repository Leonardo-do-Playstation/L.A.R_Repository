package com.lar.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.lar.entities.ExclusaoContaToken;
import java.util.Optional;

public interface ExclusaoContaTokenRepository extends JpaRepository<ExclusaoContaToken, Long> {
    Optional<ExclusaoContaToken> findByToken(String token);
}