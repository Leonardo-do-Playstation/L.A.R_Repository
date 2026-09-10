package com.lar.controllers;

import com.lar.dtos.CriarAdministradorDTO;
import com.lar.entities.Administrador;
import com.lar.services.AdministradorService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin/administradores")
public class AdministradorController {

    @Autowired
    private AdministradorService administradorService;

    @PostMapping
    public ResponseEntity<Administrador> criar(@Valid @RequestBody CriarAdministradorDTO dto) {
        Administrador novoAdmin = administradorService.criar(dto);
        return ResponseEntity.ok(novoAdmin);
    }
}