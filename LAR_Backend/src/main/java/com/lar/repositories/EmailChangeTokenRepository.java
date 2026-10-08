package com.lar.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.lar.entities.EmailChangeToken;
import java.util.Optional;

public interface EmailChangeTokenRepository extends JpaRepository<EmailChangeToken, Long> {
    Optional<EmailChangeToken> findByToken(String token);
}