package com.lar.controllers;

import com.lar.dtos.PerfilLogadoDTO;
import com.lar.services.PerfilUsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthTestController {

    @Autowired
    private PerfilUsuarioService perfilUsuarioService;

    @GetMapping("/me")
    public ResponseEntity<PerfilLogadoDTO> usuarioAutenticado(Authentication authentication) {
        return ResponseEntity.ok(perfilUsuarioService.obterPerfil(authentication.getName()));
    }
}