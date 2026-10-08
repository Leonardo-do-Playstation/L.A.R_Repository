package com.lar.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import com.lar.dtos.CriarAdministradorDTO;
import com.lar.entities.Administrador;
import com.lar.services.AdministradorService;

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

    @Operation(
        summary = "Cria um administrador",
        description = "Cadastra um novo administrador conforme as permissões do administrador autenticado."
    )
    @PostMapping
    public ResponseEntity<Administrador> criar(
            @Valid @RequestBody CriarAdministradorDTO dto,
            Authentication authentication) {

        return ResponseEntity.ok(
                administradorService.criar(
                        dto,
                        authentication.getName()
                )
        );
    }
}