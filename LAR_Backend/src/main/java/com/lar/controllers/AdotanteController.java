package com.lar.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;

import com.lar.dtos.AdotantePerfilDTO;
import com.lar.dtos.CadastroAdotanteDTO;
import com.lar.entities.Adotante;
import com.lar.services.AdotanteService;
import com.lar.services.AdotantePerfilService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Adotantes", description = "Cadastro de adotantes.")
@RestController
@RequestMapping("/adotantes")
public class AdotanteController {

    @Autowired
    private AdotanteService adotanteService;

    @Autowired
    private AdotantePerfilService adotantePerfilService;

    @Operation(summary = "Cadastra um adotante", description = "Cria uma nova conta de adotante.")
    @SecurityRequirements
    @PostMapping("/cadastro")
    public ResponseEntity<AdotantePerfilDTO> cadastrarAdotante(
            @Valid @RequestBody CadastroAdotanteDTO dto) {

        Adotante novoAdotante = adotanteService.cadastrar(dto);

        return ResponseEntity.ok(
                adotantePerfilService.buscarMeuPerfil(novoAdotante.getEmail()));
    }
}