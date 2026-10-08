package com.lar.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import com.lar.dtos.AtualizarPerfilOngDTO;
import com.lar.dtos.OngPerfilDTO;
import com.lar.services.OngPerfilService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Perfil da ONG", description = "Consulta e atualização do perfil da ONG autenticada.")
@RestController
@RequestMapping("/ong/perfil")
public class OngPerfilController {

    @Autowired
    private OngPerfilService ongPerfilService;

    @Operation(summary = "Consulta o próprio perfil", description = "Retorna os dados de perfil do usuário autenticado.")
    @GetMapping
    public ResponseEntity<OngPerfilDTO> meuPerfil(
            Authentication authentication) {

        return ResponseEntity.ok(
                ongPerfilService.buscarMeuPerfil(
                        authentication.getName()));
    }

    @Operation(summary = "Atualiza o próprio perfil", description = "Atualiza os dados editáveis do perfil autenticado.")
    @PutMapping
    public ResponseEntity<OngPerfilDTO> atualizarPerfil(
            @Valid @RequestBody AtualizarPerfilOngDTO dto,
            Authentication authentication) {

        return ResponseEntity.ok(
                ongPerfilService.atualizarMeuPerfil(
                        dto,
                        authentication.getName()));
    }
}