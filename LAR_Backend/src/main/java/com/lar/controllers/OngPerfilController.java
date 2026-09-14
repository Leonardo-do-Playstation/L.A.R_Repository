package com.lar.controllers;

import com.lar.dtos.AtualizarPerfilOngDTO;
import com.lar.dtos.OngPerfilDTO;
import com.lar.services.OngPerfilService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ong/perfil")
public class OngPerfilController {

    @Autowired
    private OngPerfilService ongPerfilService;

    @GetMapping
    public ResponseEntity<OngPerfilDTO> meuPerfil(Authentication authentication) {
        return ResponseEntity.ok(ongPerfilService.buscarMeuPerfil(authentication.getName()));
    }

    @PutMapping
    public ResponseEntity<OngPerfilDTO> atualizarPerfil(@Valid @RequestBody AtualizarPerfilOngDTO dto,
                                                          Authentication authentication) {
        return ResponseEntity.ok(ongPerfilService.atualizarMeuPerfil(dto, authentication.getName()));
    }
}