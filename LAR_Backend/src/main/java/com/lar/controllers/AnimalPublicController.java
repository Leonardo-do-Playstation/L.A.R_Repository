package com.lar.controllers;

import com.lar.dtos.AnimalDetalhesDTO;
import com.lar.services.AnimalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/animais")
public class AnimalPublicController {

    @Autowired
    private AnimalService animalService;

    @GetMapping
    public ResponseEntity<List<AnimalDetalhesDTO>> listarTodos() {
        return ResponseEntity.ok(animalService.listarTodosPublico());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AnimalDetalhesDTO> detalhes(@PathVariable Long id) {
        return ResponseEntity.ok(animalService.buscarDetalhes(id));
    }
}