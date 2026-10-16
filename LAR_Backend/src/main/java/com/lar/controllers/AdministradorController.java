package com.lar.controllers;

import com.lar.dtos.AtivarAdministradorDTO;
import com.lar.dtos.CriarAdministradorDTO;
import com.lar.services.AdministradorService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Tag(
    name = "Administradores",
    description = "Convites e ativação de administradores"
)
@RestController
@RequestMapping("/admin/administradores")
public class AdministradorController {

    @Autowired
    private AdministradorService administradorService;

    @Operation(
        summary = "Envia convite para novo administrador (somente superadministrador)"
    )
    @PostMapping
    public ResponseEntity<Map<String, String>> convidar(
            @Valid @RequestBody CriarAdministradorDTO dto,
            Authentication authentication) {

        administradorService.convidar(
                dto,
                authentication.getName()
        );

        return ResponseEntity.accepted().body(
                Map.of("mensagem", "Convite enviado por e-mail.")
        );
    }

    @Operation(summary = "Ativa conta administrativa por convite")
    @SecurityRequirements
    @PostMapping("/ativar")
    public ResponseEntity<Map<String, String>> ativar(
            @Valid @RequestBody AtivarAdministradorDTO dto) {

        administradorService.ativar(dto);

        return ResponseEntity.ok(
                Map.of("mensagem", "Conta ativada. Você já pode entrar.")
        );
    }
}