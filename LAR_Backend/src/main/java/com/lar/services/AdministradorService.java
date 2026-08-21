package com.lar.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.lar.entities.Administrador;
import com.lar.repositories.AdministradorRepository;
import com.lar.repositories.UsuarioRepository;

import java.time.LocalDateTime;

@Service
public class AdministradorService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private AdministradorRepository administradorRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Administrador criar(String nome, String email, String senha, String codigoAdmin) {

        if (usuarioRepository.existsByEmail(email)) {
            throw new RuntimeException("Este e-mail já está cadastrado.");
        }

        Administrador admin = new Administrador();
        admin.setNome(nome);
        admin.setEmail(email);
        admin.setSenha(passwordEncoder.encode(senha));
        admin.setCodigoAdmin(codigoAdmin);
        admin.setData_cadastro(LocalDateTime.now());

        return administradorRepository.save(admin);
    }
}