package com.lar.services;

import com.lar.dtos.RegistroAuditoriaDTO;
import com.lar.entities.RegistroAuditoria;
import com.lar.exceptions.RegraDeNegocioException;
import com.lar.repositories.RegistroAuditoriaRepository;
import com.lar.specifications.AuditoriaSpecification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuditoriaService {

    @Autowired
    private RegistroAuditoriaRepository registroAuditoriaRepository;

    public void registrar(String usuarioResponsavel, String acao, String registroAfetado) {
        registroAuditoriaRepository.save(new RegistroAuditoria(usuarioResponsavel, acao, registroAfetado));
    }

    public List<RegistroAuditoriaDTO> listar(String usuarioResponsavel, String data) {
        LocalDateTime inicioDoDia = null;
        LocalDateTime fimDoDia = null;

        if (data != null && !data.isBlank()) {
            try {
                LocalDate dia = LocalDate.parse(data.trim());
                inicioDoDia = dia.atStartOfDay();
                fimDoDia = dia.atTime(23, 59, 59);
            } catch (DateTimeParseException e) {
                throw new RegraDeNegocioException("Data inválida. Use o formato AAAA-MM-DD.");
            }
        }

        Specification<RegistroAuditoria> filtro = Specification
                .where(AuditoriaSpecification.comResponsavel(usuarioResponsavel))
                .and(AuditoriaSpecification.noDia(inicioDoDia, fimDoDia));

        return registroAuditoriaRepository.findAll(filtro, Sort.by(Sort.Direction.DESC, "dataHora"))
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private RegistroAuditoriaDTO toDTO(RegistroAuditoria registro) {
        RegistroAuditoriaDTO dto = new RegistroAuditoriaDTO();
        dto.id = registro.id;
        dto.usuarioResponsavel = registro.usuarioResponsavel;
        dto.acao = registro.acao;
        dto.dataHora = registro.dataHora;
        dto.registroAfetado = registro.registroAfetado;
        return dto;
    }
}