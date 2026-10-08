package com.lar.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import com.lar.dtos.AdminPerfilDTO;
import com.lar.dtos.AtualizarPerfilAdminDTO;
import com.lar.services.AdminPerfilService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@Tag(
    name = "Perfil do administrador",
    description = "Consulta e atualização do perfil do administrador autenticado."
)
@RestController
@RequestMapping("/admin/perfil")
public class AdminPerfilController {

    @Autowired
    private AdminPerfilService adminPerfilService;

    @Operation(
        summary = "Consulta o próprio perfil",
        description = "Retorna os dados de perfil do usuário autenticado."
    )
    @GetMapping
    public ResponseEntity<AdminPerfilDTO> meuPerfil(
            Authentication authentication) {

        return ResponseEntity.ok(
                adminPerfilService.buscarMeuPerfil(authentication.getName())
        );
    }

    @Operation(
        summary = "Atualiza o próprio perfil",
        description = "Atualiza os dados editáveis do perfil autenticado."
    )
    @PutMapping
    public ResponseEntity<AdminPerfilDTO> atualizarPerfil(
            @Valid @RequestBody AtualizarPerfilAdminDTO dto,
            Authentication authentication) {

        return ResponseEntity.ok(
                adminPerfilService.atualizarMeuPerfil(
                        dto,
                        authentication.getName()
                )
        );
    }
}