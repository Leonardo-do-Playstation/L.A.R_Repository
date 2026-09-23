package com.lar.controllers;

import com.lar.dtos.AdminPerfilDTO;
import com.lar.dtos.AtualizarPerfilAdminDTO;
import com.lar.services.AdminPerfilService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/perfil")
public class AdminPerfilController {

    @Autowired
    private AdminPerfilService adminPerfilService;

    @GetMapping
    public ResponseEntity<AdminPerfilDTO> meuPerfil(Authentication authentication) {
        return ResponseEntity.ok(adminPerfilService.buscarMeuPerfil(authentication.getName()));
    }

    @PutMapping
    public ResponseEntity<AdminPerfilDTO> atualizarPerfil(@Valid @RequestBody AtualizarPerfilAdminDTO dto,
                                                             Authentication authentication) {
        return ResponseEntity.ok(adminPerfilService.atualizarMeuPerfil(dto, authentication.getName()));
    }
}