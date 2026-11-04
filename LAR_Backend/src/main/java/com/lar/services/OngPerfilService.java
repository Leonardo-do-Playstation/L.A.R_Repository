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
import com.lar.storage.StorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class OngPerfilService {

    private static final long TAMANHO_MAXIMO_FOTO = 5L * 1024 * 1024;

    private static final Set<String> TIPOS_FOTO_PERMITIDOS = Set.of(
            "image/jpeg", "image/png", "image/webp", "image/gif");

    @Autowired
    private OngRepository ongRepository;

    @Autowired
    private StorageService storageService;

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

    public OngPerfilDTO atualizarFoto(MultipartFile foto, String emailAutenticado) {
        if (foto == null || foto.isEmpty()) {
            throw new RegraDeNegocioException("Selecione uma imagem para enviar.");
        }

        if (foto.getContentType() == null || !TIPOS_FOTO_PERMITIDOS.contains(foto.getContentType())) {
            throw new RegraDeNegocioException("Envie uma imagem válida (JPG, PNG, WEBP ou GIF).");
        }

        if (foto.getSize() > TAMANHO_MAXIMO_FOTO) {
            throw new RegraDeNegocioException("A foto deve ter no máximo 5 MB.");
        }

        Ong ong = buscarOngAutenticada(emailAutenticado);

        String fotoAnterior = ong.getFoto();

        ong.setFoto(storageService.upload(foto));
        Ong salva = ongRepository.save(ong);

        storageService.delete(fotoAnterior);

        return toPerfilDTO(salva);
    }

    public OngPerfilDTO removerFoto(String emailAutenticado) {
        Ong ong = buscarOngAutenticada(emailAutenticado);

        String fotoAnterior = ong.getFoto();

        ong.setFoto(null);
        Ong salva = ongRepository.save(ong);

        storageService.delete(fotoAnterior);

        return toPerfilDTO(salva);
    }

    public OngPublicaDTO buscarPublicaPorId(Long id) {
        Ong ong = ongRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("ONG não encontrada."));

        if (ong.getStatus() != StatusOng.APROVADA) {
            throw new RegraDeNegocioException("Esta ONG ainda não está disponível publicamente.");
        }

        if (Boolean.TRUE.equals(ong.getBloqueado())) {
            throw new RecursoNaoEncontradoException("ONG não encontrada ou indisponível para consulta pública.");
        }

        return toPublicaDTO(ong);
    }

    public List<OngPublicaDTO> listarPublicas(String nome, String cidade) {
        Specification<Ong> filtro = Specification
                .where(OngSpecification.disponivelPublicamente())
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
        dto.foto = ong.getFoto();
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
        dto.foto = ong.getFoto();
        return dto;
    }
}