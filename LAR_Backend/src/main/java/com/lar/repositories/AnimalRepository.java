package com.lar.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.lar.entities.Animal;

@Repository
public interface AnimalRepository extends JpaRepository<Animal, Long> {
}