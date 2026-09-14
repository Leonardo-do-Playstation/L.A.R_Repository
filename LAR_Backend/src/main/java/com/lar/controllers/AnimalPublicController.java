package com.lar.controllers;

import com.lar.dtos.AnimalDetalhesDTO;
import com.lar.services.AnimalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/animais")
public class AnimalPublicController {

    @Autowired
    private AnimalService animalService;

    @GetMapping
public ResponseEntity<Page<AnimalDetalhesDTO>> listarComFiltros(
        @RequestParam(required = false) String especie,
        @RequestParam(required = false) String porte,
        @RequestParam(required = false) String sexo,
        @RequestParam(required = false) String status,
        @RequestParam(required = false) String raca,
        @RequestParam(required = false) String cor,
        @RequestParam(required = false) Integer idadeMinima,
        @RequestParam(required = false) Integer idadeMaxima,
        @PageableDefault(page = 0, size = 12) Pageable pageable) {

    Page<AnimalDetalhesDTO> animais = animalService.buscarComFiltros(
            especie, porte, sexo, status, raca, cor, idadeMinima, idadeMaxima, pageable);

    return ResponseEntity.ok(animais);
}

    @GetMapping("/{id}")
    public ResponseEntity<AnimalDetalhesDTO> detalhes(@PathVariable Long id) {
        return ResponseEntity.ok(animalService.buscarDetalhes(id));
    }
}