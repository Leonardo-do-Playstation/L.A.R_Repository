package com.lar.services;

import com.lar.dtos.AdminPerfilDTO;
import com.lar.dtos.AtualizarPerfilAdminDTO;
import com.lar.entities.Administrador;
import com.lar.exceptions.RecursoNaoEncontradoException;
import com.lar.repositories.AdministradorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AdminPerfilService {

    @Autowired
    private AdministradorRepository administradorRepository;

    public AdminPerfilDTO buscarMeuPerfil(String emailAutenticado) {
        return toPerfilDTO(buscarAdminAutenticado(emailAutenticado));
    }

    public AdminPerfilDTO atualizarMeuPerfil(AtualizarPerfilAdminDTO dto, String emailAutenticado) {
        Administrador admin = buscarAdminAutenticado(emailAutenticado);

        admin.setNome(dto.nome);
        admin.setTelefone(dto.telefone);
        admin.setEndereco(dto.endereco);

        Administrador salvo = administradorRepository.save(admin);
        return toPerfilDTO(salvo);
    }

    private Administrador buscarAdminAutenticado(String email) {
        return administradorRepository.findByEmail(email)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Administrador autenticado não encontrado."));
    }

    private AdminPerfilDTO toPerfilDTO(Administrador admin) {
        AdminPerfilDTO dto = new AdminPerfilDTO();
        dto.id = admin.getId();
        dto.nome = admin.getNome();
        dto.email = admin.getEmail();
        dto.telefone = admin.getTelefone();
        dto.endereco = admin.getEndereco();
        dto.codigoAdmin = admin.getCodigoAdmin();
        return dto;
    }
}