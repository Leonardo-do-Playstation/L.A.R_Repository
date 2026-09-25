package com.lar.controllers;

import com.lar.entities.Ong;
import com.lar.services.AdminOngService;
import com.lar.dtos.RecusarOngDTO;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/ongs")
public class AdminOngController {

    @Autowired
    private AdminOngService adminOngService;

    @GetMapping("/pendentes")
    public ResponseEntity<List<Ong>> listarPendentes() {
        return ResponseEntity.ok(adminOngService.listarPendentes());
    }

    @PutMapping("/{id}/aprovar")
    public ResponseEntity<Ong> aprovar(@PathVariable Long id, Authentication authentication) {
        return ResponseEntity.ok(adminOngService.aprovar(id, authentication.getName()));
    }

    @PutMapping("/{id}/recusar")
    public ResponseEntity<Ong> recusar(@PathVariable Long id, @Valid @RequestBody RecusarOngDTO dto,
            Authentication authentication) {
        return ResponseEntity.ok(adminOngService.recusar(id, dto.motivo, authentication.getName()));
    }
}