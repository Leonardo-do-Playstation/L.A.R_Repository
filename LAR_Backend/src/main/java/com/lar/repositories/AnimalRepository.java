package com.lar.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lar.entities.Animal;


public interface AnimalRepository extends JpaRepository<Animal, Long> {
}