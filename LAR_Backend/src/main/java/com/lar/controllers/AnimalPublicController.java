package com.lar.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;

import com.lar.dtos.AnimalDetalhesDTO;
import com.lar.services.AnimalService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Animais - público", description = "Catálogo público, filtros e detalhes dos animais.")
@RestController
@RequestMapping("/animais")
public class AnimalPublicController {

    @Autowired
    private AnimalService animalService;

    @Operation(summary = "Lista e filtra animais", description = "Retorna o catálogo paginado de animais usando os filtros opcionais informados. Use idOng para ver só os animais de uma ONG específica (ex: botão 'Quero conhecer' na página da ONG).")
    @SecurityRequirements
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
            @RequestParam(required = false) Long idOng,
            @PageableDefault(page = 0, size = 12) Pageable pageable) {

        Page<AnimalDetalhesDTO> animais = animalService.buscarComFiltros(
                especie,
                porte,
                sexo,
                status,
                raca,
                cor,
                idadeMinima,
                idadeMaxima,
                idOng,
                pageable);

        return ResponseEntity.ok(animais);
    }

    @Operation(summary = "Consulta os detalhes de um animal", description = "Retorna as informações públicas detalhadas do animal.")
    @SecurityRequirements
    @GetMapping("/{id}")
    public ResponseEntity<AnimalDetalhesDTO> detalhes(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                animalService.buscarDetalhes(id));
    }
}