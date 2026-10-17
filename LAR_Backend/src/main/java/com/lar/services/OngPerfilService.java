package com.lar.services;

import com.lar.dtos.AtualizarPerfilOngDTO;
import com.lar.dtos.OngPerfilDTO;
import com.lar.dtos.OngPublicaDTO;
import com.lar.entities.Ong;
import com.lar.enums.StatusOng;
import com.lar.exceptions.RecursoNaoEncontradoException;
import com.lar.exceptions.RegraDeNegocioException;
import com.lar.repositories.OngRepository;
import com.lar.specifications.OngSpecification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OngPerfilService {

    @Autowired
    private OngRepository ongRepository;

    public OngPerfilDTO buscarMeuPerfil(String emailAutenticado) {
        Ong ong = buscarOngAutenticada(emailAutenticado);
        return toPerfilDTO(ong);
    }

    public OngPerfilDTO atualizarMeuPerfil(AtualizarPerfilOngDTO dto, String emailAutenticado) {
        Ong ong = buscarOngAutenticada(emailAutenticado);

        ong.setNome(dto.nome);
        ong.setTelefone(dto.telefone);
        ong.setEndereco(dto.endereco);
        ong.setObservacoes(dto.observacoes);

        Ong salva = ongRepository.save(ong);
        return toPerfilDTO(salva);
    }

    public OngPublicaDTO buscarPublicaPorId(Long id) {
        Ong ong = ongRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("ONG não encontrada."));

        if (ong.getStatus() != StatusOng.APROVADA) {
            throw new RegraDeNegocioException("Esta ONG ainda não está disponível publicamente.");
        }

        return toPublicaDTO(ong);
    }

    public List<OngPublicaDTO> listarPublicas(String nome, String cidade) {
        Specification<Ong> filtro = Specification
                .where(OngSpecification.comStatus(StatusOng.APROVADA))
                .and(OngSpecification.comNome(nome))
                .and(OngSpecification.comCidade(cidade));

        return ongRepository.findAll(filtro)
                .stream()
                .map(this::toPublicaDTO)
                .collect(Collectors.toList());
    }

    public List<OngPerfilDTO> listarParaAdmin(String status, String nome, String cidade) {
        StatusOng statusFiltro = null;

        if (status != null && !status.isBlank()) {
            try {
                statusFiltro = StatusOng.valueOf(status.trim().toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new RegraDeNegocioException("Status inválido. Use PENDENTE, APROVADA ou RECUSADA.");
            }
        }

        Specification<Ong> filtro = Specification
                .where(OngSpecification.comStatus(statusFiltro))
                .and(OngSpecification.comNome(nome))
                .and(OngSpecification.comCidade(cidade));

        return ongRepository.findAll(filtro)
                .stream()
                .map(this::toPerfilDTO)
                .collect(Collectors.toList());
    }

    private Ong buscarOngAutenticada(String email) {
        return ongRepository.findByEmail(email)
                .orElseThrow(() -> new RecursoNaoEncontradoException("ONG autenticada não encontrada."));
    }

    private OngPerfilDTO toPerfilDTO(Ong ong) {
        OngPerfilDTO dto = new OngPerfilDTO();
        dto.id = ong.getId();
        dto.nome = ong.getNome();
        dto.email = ong.getEmail();
        dto.telefone = ong.getTelefone();
        dto.endereco = ong.getEndereco();
        dto.observacoes = ong.getObservacoes();
        dto.cnpj = ong.getCnpj();
        dto.status = ong.getStatus().name();
        dto.dataCadastro = ong.getData_cadastro();
        return dto;
    }

    private OngPublicaDTO toPublicaDTO(Ong ong) {
        OngPublicaDTO dto = new OngPublicaDTO();
        dto.id = ong.getId();
        dto.nome = ong.getNome();
        dto.cnpj = ong.getCnpj();
        dto.telefone = ong.getTelefone();
        dto.endereco = ong.getEndereco();
        dto.observacoes = ong.getObservacoes();
        return dto;
    }
}