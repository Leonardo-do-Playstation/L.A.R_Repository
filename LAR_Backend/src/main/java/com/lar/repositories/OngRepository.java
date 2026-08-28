package com.lar.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.lar.entities.Ong;
import com.lar.enums.StatusOng;
import java.util.List;


@Repository
public interface OngRepository extends JpaRepository<Ong, Long> {
    boolean existsByCnpj(String cnpj);
      List<Ong> findByStatus(StatusOng status);
}
