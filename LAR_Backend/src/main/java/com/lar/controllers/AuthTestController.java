package com.lar.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import com.lar.dtos.PerfilLogadoDTO;
import com.lar.services.PerfilUsuarioService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@Tag(
    name = "Autenticação",
    description = "Consulta do usuário autenticado."
)
@RestController
@RequestMapping("/auth")
public class AuthTestController {

    @Autowired
    private PerfilUsuarioService perfilUsuarioService;

    @Operation(
        summary = "Consulta o usuário autenticado",
        description = "Retorna o perfil associado ao token JWT informado."
    )
    @GetMapping("/me")
    public ResponseEntity<PerfilLogadoDTO> usuarioAutenticado(
            Authentication authentication) {

        return ResponseEntity.ok(
                perfilUsuarioService.obterPerfil(
                        authentication.getName()
                )
        );
    }
}