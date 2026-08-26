package com.lar.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.lar.entities.PasswordResetToken;
import java.util.Optional;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByToken(String token);
}