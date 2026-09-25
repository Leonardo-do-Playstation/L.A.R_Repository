package com.lar.controllers;

import com.lar.dtos.AtualizarUsuarioAdminDTO;
import com.lar.dtos.UsuarioAdminDTO;
import com.lar.services.AdminUsuarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/usuarios")
public class AdminUsuarioController {

    @Autowired
    private AdminUsuarioService adminUsuarioService;

    @GetMapping
    public ResponseEntity<List<UsuarioAdminDTO>> listarTodos() {
        return ResponseEntity.ok(adminUsuarioService.listarTodos());
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<UsuarioAdminDTO>> buscar(@RequestParam String termo) {
        return ResponseEntity.ok(adminUsuarioService.buscar(termo));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioAdminDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(adminUsuarioService.buscarPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UsuarioAdminDTO> editar(@PathVariable Long id,
            @Valid @RequestBody AtualizarUsuarioAdminDTO dto,
            Authentication authentication) {
        return ResponseEntity.ok(adminUsuarioService.editar(id, dto, authentication.getName()));
    }

    @PatchMapping("/{id}/bloqueio")
    public ResponseEntity<UsuarioAdminDTO> alternarBloqueio(@PathVariable Long id, Authentication authentication) {
        return ResponseEntity.ok(adminUsuarioService.alternarBloqueio(id, authentication.getName()));
    }
}