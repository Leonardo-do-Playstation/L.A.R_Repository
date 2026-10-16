package com.lar.config;

import com.lar.entities.Administrador;
import com.lar.repositories.AdministradorRepository;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;

@Configuration
public class AdminSeedConfig {

    @Bean
    public CommandLineRunner criarAdminPadrao(
            AdministradorRepository administradorRepository,
            PasswordEncoder passwordEncoder,
            @Value("${lar.admin.seed.email:}") String email,
            @Value("${lar.admin.seed.password:}") String senha) {

        return args -> {

            if (administradorRepository.count() > 0) {
                return;
            }

            if (email.isBlank() || senha.isBlank()) {
                System.out.println(
                        "Superadministrador não criado: configure as credenciais iniciais."
                );
                return;
            }

            if (senha.length() < 6) {
                throw new IllegalStateException(
                        "A senha inicial deve conter pelo menos 6 caracteres."
                );
            }

            Administrador admin = new Administrador();

            admin.setNome("Administrador do Sistema");
            admin.setEmail(email.trim());
            admin.setSenha(passwordEncoder.encode(senha));
            admin.setCodigoAdmin("ADM-0001");
            admin.setSuperAdmin(true);
            admin.setData_cadastro(LocalDateTime.now());

            administradorRepository.save(admin);

            System.out.println(
                    "Superadministrador inicial criado: " + admin.getEmail()
            );
        };
    }
}