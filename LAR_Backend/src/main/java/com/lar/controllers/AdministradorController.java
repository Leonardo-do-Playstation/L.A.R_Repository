package com.lar.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import com.lar.dtos.AdminPerfilDTO;
import com.lar.dtos.CriarAdministradorDTO;
import com.lar.entities.Administrador;
import com.lar.services.AdministradorService;
import com.lar.services.AdminPerfilService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@Tag(
    name = "Administradores",
    description = "Cadastro de novos administradores."
)
@RestController
@RequestMapping("/admin/administradores")
public class AdministradorController {

    @Autowired
    private AdministradorService administradorService;

    @Autowired
    private AdminPerfilService adminPerfilService;

    @Operation(
        summary = "Cria um administrador",
        description = "Cadastra um novo administrador conforme as permissões do administrador autenticado."
    )
    @PostMapping
    public ResponseEntity<AdminPerfilDTO> criar(
            @Valid @RequestBody CriarAdministradorDTO dto,
            Authentication authentication) {

        Administrador novoAdmin = administradorService.criar(
                dto,
                authentication.getName()
        );

        return ResponseEntity.ok(
                adminPerfilService.buscarMeuPerfil(novoAdmin.getEmail()));
    }
}