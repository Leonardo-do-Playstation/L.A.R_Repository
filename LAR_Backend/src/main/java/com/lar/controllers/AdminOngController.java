package com.lar.controllers;

import com.lar.entities.Ong;
import com.lar.services.AdminOngService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<Ong> aprovar(@PathVariable Long id) {
        return ResponseEntity.ok(adminOngService.aprovar(id));
    }

    @PutMapping("/{id}/recusar")
    public ResponseEntity<Ong> recusar(@PathVariable Long id) {
        return ResponseEntity.ok(adminOngService.recusar(id));
    }
}