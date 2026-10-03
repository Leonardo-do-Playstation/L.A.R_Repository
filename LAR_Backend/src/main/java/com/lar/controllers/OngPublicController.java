package com.lar.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;

import com.lar.dtos.OngPublicaDTO;
import com.lar.services.OngPerfilService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "ONGs - público", description = "Listagem e consulta pública de ONGs.")
@RestController
@RequestMapping("/ongs")
public class OngPublicController {

    @Autowired
    private OngPerfilService ongPerfilService;

    @Operation(summary = "Lista ONGs públicas", description = "Retorna as ONGs disponíveis para consulta pública.")
    @SecurityRequirements
    @GetMapping
    public ResponseEntity<List<OngPublicaDTO>> listarPublicas() {

        return ResponseEntity.ok(
                ongPerfilService.listarPublicas());
    }

    @Operation(summary = "Consulta uma ONG pública", description = "Retorna os dados públicos da ONG pelo ID.")
    @SecurityRequirements
    @GetMapping("/{id}")
    public ResponseEntity<OngPublicaDTO> buscarPublica(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                ongPerfilService.buscarPublicaPorId(id));
    }
}