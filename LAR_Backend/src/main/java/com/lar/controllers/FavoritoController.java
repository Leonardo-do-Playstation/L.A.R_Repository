package com.lar.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import com.lar.dtos.FavoritoResponseDTO;
import com.lar.services.FavoritoService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Favoritos", description = "Gerenciamento dos animais favoritos do adotante.")
@RestController
@RequestMapping("/favoritos")
public class FavoritoController {

    @Autowired
    private FavoritoService favoritoService;

    @Operation(summary = "Adiciona um animal aos favoritos", description = "Favorita o animal para o adotante autenticado.")
    @PostMapping("/{animalId}")
    public ResponseEntity<Void> favoritar(
            @PathVariable Long animalId,
            Authentication authentication) {

        favoritoService.favoritar(
                animalId,
                authentication.getName());

        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Remove um animal dos favoritos", description = "Remove o animal dos favoritos do adotante autenticado.")
    @DeleteMapping("/{animalId}")
    public ResponseEntity<Void> desfavoritar(
            @PathVariable Long animalId,
            Authentication authentication) {

        favoritoService.desfavoritar(
                animalId,
                authentication.getName());

        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Lista os próprios favoritos", description = "Retorna os animais favoritados pelo adotante autenticado.")
    @GetMapping
    public ResponseEntity<List<FavoritoResponseDTO>> listarMeusFavoritos(Authentication authentication) {

        return ResponseEntity.ok(
                favoritoService.listarMeusFavoritos(
                        authentication.getName()));
    }
}