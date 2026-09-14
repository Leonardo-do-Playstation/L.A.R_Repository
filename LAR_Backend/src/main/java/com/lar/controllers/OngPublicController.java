package com.lar.controllers;

import com.lar.dtos.OngPublicaDTO;
import com.lar.services.OngPerfilService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/ongs")
public class OngPublicController {

    @Autowired
    private OngPerfilService ongPerfilService;

    @GetMapping
    public ResponseEntity<List<OngPublicaDTO>> listarPublicas() {
        return ResponseEntity.ok(ongPerfilService.listarPublicas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<OngPublicaDTO> buscarPublica(@PathVariable Long id) {
        return ResponseEntity.ok(ongPerfilService.buscarPublicaPorId(id));
    }
}