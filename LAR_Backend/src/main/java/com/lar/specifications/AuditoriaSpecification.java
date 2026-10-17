package com.lar.specifications;

import com.lar.entities.RegistroAuditoria;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;

public class AuditoriaSpecification {

    public static Specification<RegistroAuditoria> comResponsavel(String usuarioResponsavel) {
        return (root, query, cb) -> (usuarioResponsavel == null || usuarioResponsavel.isBlank()) ? null
                : cb.like(cb.lower(root.get("usuarioResponsavel")),
                        "%" + usuarioResponsavel.trim().toLowerCase() + "%");
    }

    public static Specification<RegistroAuditoria> noDia(LocalDateTime inicioDoDia, LocalDateTime fimDoDia) {
        return (root, query, cb) -> inicioDoDia == null ? null
                : cb.between(root.get("dataHora"), inicioDoDia, fimDoDia);
    }
}