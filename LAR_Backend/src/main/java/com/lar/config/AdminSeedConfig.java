package com.lar.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.lar.dtos.CriarAdministradorDTO;
import com.lar.entities.Administrador;
import com.lar.repositories.AdministradorRepository;
import com.lar.services.AdministradorService;

@Configuration
public class AdminSeedConfig {

    @Bean
    public CommandLineRunner criarAdminPadrao(AdministradorRepository administradorRepository,
                                                AdministradorService administradorService) {
        return args -> {
            if (administradorRepository.count() == 0) {
                CriarAdministradorDTO dto = new CriarAdministradorDTO();
                dto.nome = "Administrador do Sistema";
                dto.email = "laradmin@gmail.com";
                dto.senha = "admin123";
                dto.codigoAdmin = "ADM-0001";

                Administrador admin = administradorService.criar(dto);
                admin.setSuperAdmin(true);
                administradorRepository.save(admin);

                System.out.println("Administrador principal criado: laradmin@gmail.com");
            }
        };
    }
}