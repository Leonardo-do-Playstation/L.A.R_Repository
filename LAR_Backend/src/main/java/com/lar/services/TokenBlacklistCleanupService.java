package com.lar.services;

import com.lar.repositories.TokenBlacklistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class TokenBlacklistCleanupService {

    @Autowired
    private TokenBlacklistRepository tokenBlacklistRepository;

    @Scheduled(cron = "0 0 3 * * *")
    public void limparTokensExpirados() {
        tokenBlacklistRepository.deleteAll();
        System.out.println("Limpeza de token_blacklist executada.");
    }
}