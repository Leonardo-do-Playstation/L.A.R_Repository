package com.lar.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lar.dtos.CadastroAdotanteDTO;
import com.lar.entities.Adotante;
import com.lar.services.AdotanteService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/adotantes")
public class AdotanteController {

    @Autowired
    private AdotanteService adotanteService;

    @PostMapping("/cadastro")
    public ResponseEntity<Adotante> cadastrarAdotante(@Valid @RequestBody CadastroAdotanteDTO dto){
        Adotante novoAdotante = adotanteService.cadastrar(dto);
        return ResponseEntity.ok(novoAdotante);
    }
}
