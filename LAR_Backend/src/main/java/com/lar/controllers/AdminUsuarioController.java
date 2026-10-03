package com.lar.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import com.lar.dtos.AtualizarUsuarioAdminDTO;
import com.lar.dtos.UsuarioAdminDTO;
import com.lar.services.AdminUsuarioService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Administração de usuários", description = "Consulta, edição, bloqueio e reativação de usuários.")
@RestController
@RequestMapping("/admin/usuarios")
public class AdminUsuarioController {

    @Autowired
    private AdminUsuarioService adminUsuarioService;

    @Operation(summary = "Lista todos os usuários", description = "Retorna os usuários disponíveis para gerenciamento administrativo.")
    @GetMapping
    public ResponseEntity<List<UsuarioAdminDTO>> listarTodos() {
        return ResponseEntity.ok(adminUsuarioService.listarTodos());
    }

    @Operation(summary = "Busca usuários", description = "Pesquisa usuários pelo termo informado.")
    @GetMapping("/buscar")
    public ResponseEntity<List<UsuarioAdminDTO>> buscar(
            @RequestParam String termo) {

        return ResponseEntity.ok(adminUsuarioService.buscar(termo));
    }

    @Operation(summary = "Consulta um usuário por ID", description = "Retorna os dados administrativos do usuário informado.")
    @GetMapping("/{id}")
    public ResponseEntity<UsuarioAdminDTO> buscarPorId(
            @PathVariable Long id) {

        return ResponseEntity.ok(adminUsuarioService.buscarPorId(id));
    }

    @Operation(summary = "Edita um usuário", description = "Atualiza os dados permitidos do usuário pelo administrador.")
    @PutMapping("/{id}")
    public ResponseEntity<UsuarioAdminDTO> editar(
            @PathVariable Long id,
            @Valid @RequestBody AtualizarUsuarioAdminDTO dto,
            Authentication authentication) {

        return ResponseEntity.ok(
                adminUsuarioService.editar(
                        id,
                        dto,
                        authentication.getName()));
    }

    @Operation(summary = "Bloqueia ou reativa um usuário", description = "Alterna o estado de bloqueio da conta respeitando as permissões administrativas.")
    @PatchMapping("/{id}/bloqueio")
    public ResponseEntity<UsuarioAdminDTO> alternarBloqueio(
            @PathVariable Long id,
            Authentication authentication) {

        return ResponseEntity.ok(
                adminUsuarioService.alternarBloqueio(
                        id,
                        authentication.getName()));
    }
}