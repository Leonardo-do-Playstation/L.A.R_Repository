package com.lar.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;

import com.lar.dtos.CadastroOngDTO;
import com.lar.entities.Ong;
import com.lar.services.OngService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "ONGs", description = "Cadastro de ONGs e protetores.")
@RestController
@RequestMapping("/ongs")
public class OngController {

    @Autowired
    private OngService ongService;

    @Operation(summary = "Cadastra uma ONG", description = "Cria uma nova conta de ONG/protetor para posterior análise administrativa.")
    @SecurityRequirements
    @PostMapping("/cadastro")
    public ResponseEntity<Ong> cadastrar(
            @Valid @RequestBody CadastroOngDTO dto) {

        Ong novaOng = ongService.cadastrar(dto);

        return ResponseEntity.ok(novaOng);
    }
}