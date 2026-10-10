package com.lar.specifications;

import com.lar.entities.Animal;
import com.lar.enums.StatusAnimal;
import org.springframework.data.jpa.domain.Specification;

public class AnimalSpecification {

    public static Specification<Animal> comEspecie(String especie) {
        return (root, query, cb) -> especie == null ? null
                : cb.equal(cb.lower(root.get("especie")), especie.toLowerCase());
    }

    public static Specification<Animal> comPorte(String porte) {
        return (root, query, cb) -> porte == null ? null : cb.equal(cb.lower(root.get("porte")), porte.toLowerCase());
    }

    public static Specification<Animal> comSexo(String sexo) {
        return (root, query, cb) -> sexo == null ? null : cb.equal(cb.lower(root.get("sexo")), sexo.toLowerCase());
    }

    public static Specification<Animal> comStatus(StatusAnimal status) {
        return (root, query, cb) -> status == null ? null : cb.equal(root.get("status"), status);
    }

    public static Specification<Animal> comIdadeMinima(Integer idadeMinima) {
        return (root, query, cb) -> idadeMinima == null ? null
                : cb.greaterThanOrEqualTo(root.get("idade"), idadeMinima);
    }

    public static Specification<Animal> comIdadeMaxima(Integer idadeMaxima) {
        return (root, query, cb) -> idadeMaxima == null ? null : cb.lessThanOrEqualTo(root.get("idade"), idadeMaxima);
    }

    public static Specification<Animal> comOngId(Long idOng) {
        return (root, query, cb) -> idOng == null ? null : cb.equal(root.get("ong").get("id"), idOng);
    }

    public static Specification<Animal> comRaca(String raca) {
        return (root, query, cb) -> raca == null ? null : cb.equal(cb.lower(root.get("raca")), raca.toLowerCase());
    }

    public static Specification<Animal> comCor(String cor) {
        return (root, query, cb) -> cor == null ? null : cb.equal(cb.lower(root.get("cor")), cor.toLowerCase());
    }

    public static Specification<Animal> ongNaoBloqueada() {
    return (root, query, cb) -> cb.or(
            cb.isNull(root.get("ong").get("bloqueado")),
            cb.isFalse(root.get("ong").get("bloqueado")));
}
}