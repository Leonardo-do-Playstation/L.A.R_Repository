package com.lar.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.lar.entities.TokenBlacklist;

public interface TokenBlacklistRepository extends JpaRepository<TokenBlacklist, Long> {
    boolean existsByToken(String token);
}