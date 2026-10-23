package com.lar.services;

import com.lar.dtos.PerfilLogadoDTO;
import com.lar.entities.Administrador;
import com.lar.entities.Ong;
import com.lar.entities.Usuario;
import com.lar.exceptions.RecursoNaoEncontradoException;
import com.lar.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PerfilUsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public PerfilLogadoDTO obterPerfil(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Usuário não encontrado."));

        PerfilLogadoDTO dto = new PerfilLogadoDTO();
        dto.id = usuario.getId();
        dto.nome = usuario.getNome();
        dto.email = usuario.getEmail();
        dto.tipo = usuario.getClass().getSimpleName().toUpperCase();

        if (usuario instanceof Ong ong) {
            dto.statusOng = ong.getStatus().name();
        }
        if (usuario instanceof Administrador admin) {
            dto.superAdmin = Boolean.TRUE.equals(admin.getSuperAdmin());
        }
        return dto;
    }
}