package com.lar.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.lar.dtos.CriarAdministradorDTO;
import com.lar.entities.Administrador;
import com.lar.exceptions.RegraDeNegocioException;
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

    @Autowired
    private AuditoriaService auditoriaService;

   public Administrador criar(CriarAdministradorDTO dto, String emailAdminCriador) {

    if (usuarioRepository.existsByEmail(dto.email)) {
        throw new RegraDeNegocioException("Este e-mail já está cadastrado.");
    }
    if (administradorRepository.existsByCodigoAdmin(dto.codigoAdmin)) {
        throw new RegraDeNegocioException("Este código de administrador já está em uso.");
    }

    Administrador admin = new Administrador();
    admin.setNome(dto.nome);
    admin.setEmail(dto.email);
    admin.setSenha(passwordEncoder.encode(dto.senha));
    admin.setCodigoAdmin(dto.codigoAdmin);
    admin.setData_cadastro(LocalDateTime.now());

    Administrador salvo = administradorRepository.save(admin);

    if (emailAdminCriador != null) { 
        auditoriaService.registrar(emailAdminCriador, "CRIAR_ADMINISTRADOR",
                "Administrador id=" + salvo.getId() + " (" + salvo.getEmail() + ")");
    }

    return salvo;
    }
}