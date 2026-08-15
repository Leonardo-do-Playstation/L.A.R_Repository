package com.lar.controllers;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lar.entities.Animal;
import com.lar.repositories.AnimalRepository;

@RestController
public class AnimalController {

    @Autowired
    private AnimalRepository animalRepository;

    @GetMapping("/animais")
    public List<Animal> listarAnimais() {
        return animalRepository.findAll();
    }
}