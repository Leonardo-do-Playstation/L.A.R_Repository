package com.lar.services;

import com.lar.dtos.AdotantePerfilDTO;
import com.lar.dtos.AtualizarPerfilAdotanteDTO;
import com.lar.entities.Adotante;
import com.lar.exceptions.RecursoNaoEncontradoException;
import com.lar.repositories.AdotanteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AdotantePerfilService {

    @Autowired
    private AdotanteRepository adotanteRepository;

    public AdotantePerfilDTO buscarMeuPerfil(String emailAutenticado) {
        Adotante adotante = buscarAdotanteAutenticado(emailAutenticado);
        return toPerfilDTO(adotante);
    }

    public AdotantePerfilDTO atualizarMeuPerfil(AtualizarPerfilAdotanteDTO dto, String emailAutenticado) {
        Adotante adotante = buscarAdotanteAutenticado(emailAutenticado);

        adotante.setNome(dto.nome);
        adotante.setTelefone(dto.telefone);
        adotante.setEndereco(dto.endereco);

        Adotante salvo = adotanteRepository.save(adotante);
        return toPerfilDTO(salvo);
    }

    private Adotante buscarAdotanteAutenticado(String email) {
        return adotanteRepository.findByEmail(email)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Adotante autenticado não encontrado."));
    }

    private AdotantePerfilDTO toPerfilDTO(Adotante adotante) {
        AdotantePerfilDTO dto = new AdotantePerfilDTO();
        dto.id = adotante.getId();
        dto.nome = adotante.getNome();
        dto.email = adotante.getEmail();
        dto.telefone = adotante.getTelefone();
        dto.endereco = adotante.getEndereco();
        dto.cpf = adotante.getCpf();
        return dto;
    }
}