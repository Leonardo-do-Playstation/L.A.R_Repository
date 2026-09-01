package com.lar.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.lar.repositories.AdministradorRepository;
import com.lar.services.AdministradorService;

@Configuration
public class AdminSeedConfig {

    @Bean
    public CommandLineRunner criarAdminPadrao(AdministradorRepository administradorRepository,
                                                AdministradorService administradorService) {
        return args -> {
            if (administradorRepository.count() == 0) {
                administradorService.criar(
                        "Administrador do Sistema",
                        "laradmin@gmail.com",
                        "admin123",
                        "ADM-0001"
                );
                System.out.println("Administrador padrão criado: laradmin@gmail.com");
            }
        };
    }
}