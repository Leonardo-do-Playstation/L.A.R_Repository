package com.lar.controllers;

import com.lar.dtos.CadastroOngDTO;
import com.lar.entities.Ong;
import com.lar.services.OngService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/ongs")
public class OngController {

    @Autowired
    private OngService ongService;

    @PostMapping("/cadastro")
    public ResponseEntity<Ong> cadastrar(@Valid @RequestBody CadastroOngDTO dto) {
        Ong novaOng = ongService.cadastrar(dto);
        return ResponseEntity.ok(novaOng);
    }
}