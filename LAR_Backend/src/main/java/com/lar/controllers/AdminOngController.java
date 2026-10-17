package com.lar.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import com.lar.dtos.OngPerfilDTO;
import com.lar.services.AdminOngService;
import com.lar.dtos.RecusarOngDTO;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Administração de ONGs", description = "Análise, aprovação e recusa de cadastros de ONGs.")
@RestController
@RequestMapping("/admin/ongs")
public class AdminOngController {

    @Autowired
    private AdminOngService adminOngService;

    @Operation(summary = "Lista os cadastros de ONGs pendentes de análise", description = "Retorna as ONGs que aguardam análise administrativa.")
    @GetMapping("/pendentes")
    public ResponseEntity<List<OngPerfilDTO>> listarPendentes() {
        return ResponseEntity.ok(adminOngService.listarPendentes());
    }

     @Operation(summary = "Lista ONGs para administração", description = "Retorna as ONGs de qualquer status (ou de um status específico), com filtro opcional por nome e cidade.")
    @GetMapping
    public ResponseEntity<List<OngPerfilDTO>> listarTodas(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String nome,
            @RequestParam(required = false) String cidade) {

        return ResponseEntity.ok(
                adminOngService.listarTodas(status, nome, cidade));
    }

    @Operation(summary = "Aprova o cadastro de uma ONG", description = "Altera a situação da ONG para aprovada e registra a ação administrativa.")
    @PutMapping("/{id}/aprovar")
    public ResponseEntity<OngPerfilDTO> aprovar(
            @PathVariable Long id,
            Authentication authentication) {

        return ResponseEntity.ok(
                adminOngService.aprovar(id, authentication.getName()));
    }

    @Operation(summary = "Recusa o cadastro de uma ONG", description = "Recusa a ONG usando o motivo informado e registra a ação administrativa.")
    @PutMapping("/{id}/recusar")
    public ResponseEntity<OngPerfilDTO> recusar(
            @PathVariable Long id,
            @Valid @RequestBody RecusarOngDTO dto,
            Authentication authentication) {

        return ResponseEntity.ok(
                adminOngService.recusar(
                        id,
                        dto.motivo,
                        authentication.getName()));
    }
}