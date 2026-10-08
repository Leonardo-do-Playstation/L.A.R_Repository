package com.lar.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import com.lar.dtos.AdotantePerfilDTO;
import com.lar.dtos.AtualizarPerfilAdotanteDTO;
import com.lar.services.AdotantePerfilService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Perfil do adotante", description = "Consulta e atualização do perfil do adotante autenticado.")
@RestController
@RequestMapping("/adotante/perfil")
public class AdotantePerfilController {

    @Autowired
    private AdotantePerfilService adotantePerfilService;

    @Operation(summary = "Consulta o próprio perfil", description = "Retorna os dados de perfil do usuário autenticado.")
    @GetMapping
    public ResponseEntity<AdotantePerfilDTO> meuPerfil(
            Authentication authentication) {

        return ResponseEntity.ok(
                adotantePerfilService.buscarMeuPerfil(
                        authentication.getName()));
    }

    @Operation(summary = "Atualiza o próprio perfil", description = "Atualiza os dados editáveis do perfil autenticado.")
    @PutMapping
    public ResponseEntity<AdotantePerfilDTO> atualizarPerfil(
            @Valid @RequestBody AtualizarPerfilAdotanteDTO dto,
            Authentication authentication) {

        return ResponseEntity.ok(
                adotantePerfilService.atualizarMeuPerfil(
                        dto,
                        authentication.getName()));
    }
}