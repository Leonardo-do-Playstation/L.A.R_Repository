package com.lar.controllers;

import com.lar.dtos.AdotantePerfilDTO;
import com.lar.dtos.AtualizarPerfilAdotanteDTO;
import com.lar.services.AdotantePerfilService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/adotante/perfil")
public class AdotantePerfilController {

    @Autowired
    private AdotantePerfilService adotantePerfilService;

    @GetMapping
    public ResponseEntity<AdotantePerfilDTO> meuPerfil(Authentication authentication) {
        return ResponseEntity.ok(adotantePerfilService.buscarMeuPerfil(authentication.getName()));
    }

    @PutMapping
    public ResponseEntity<AdotantePerfilDTO> atualizarPerfil(@Valid @RequestBody AtualizarPerfilAdotanteDTO dto,
                                                                Authentication authentication) {
        return ResponseEntity.ok(adotantePerfilService.atualizarMeuPerfil(dto, authentication.getName()));
    }
}