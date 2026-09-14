package com.lar.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.lar.entities.Animal;

@Repository
public interface AnimalRepository extends JpaRepository<Animal, Long> , JpaSpecificationExecutor<Animal> {
    List<Animal> findByOngId(Long idOng);
}