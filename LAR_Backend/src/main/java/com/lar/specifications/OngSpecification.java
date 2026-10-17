package com.lar.specifications;

import com.lar.entities.Ong;
import com.lar.enums.StatusOng;
import org.springframework.data.jpa.domain.Specification;

public class OngSpecification {

    public static Specification<Ong> comStatus(StatusOng status) {
        return (root, query, cb) -> status == null ? null : cb.equal(root.get("status"), status);
    }

    public static Specification<Ong> comNome(String nome) {
        return (root, query, cb) -> (nome == null || nome.isBlank()) ? null
                : cb.like(cb.lower(root.get("nome")), "%" + nome.trim().toLowerCase() + "%");
    }

    public static Specification<Ong> comCidade(String cidade) {
        return (root, query, cb) -> (cidade == null || cidade.isBlank()) ? null
                : cb.like(cb.lower(root.get("endereco")), "%" + cidade.trim().toLowerCase() + "%");
    }
}