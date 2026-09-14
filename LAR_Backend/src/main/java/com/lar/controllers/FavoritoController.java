package com.lar.controllers;

import com.lar.dtos.FavoritoResponseDTO;
import com.lar.services.FavoritoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/favoritos")
public class FavoritoController {

    @Autowired
    private FavoritoService favoritoService;

    @PostMapping("/{animalId}")
    public ResponseEntity<Void> favoritar(@PathVariable Long animalId, Authentication authentication) {
        favoritoService.favoritar(animalId, authentication.getName());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{animalId}")
    public ResponseEntity<Void> desfavoritar(@PathVariable Long animalId, Authentication authentication) {
        favoritoService.desfavoritar(animalId, authentication.getName());
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<FavoritoResponseDTO>> listarMeusFavoritos(Authentication authentication) {
        return ResponseEntity.ok(favoritoService.listarMeusFavoritos(authentication.getName()));
    }
}