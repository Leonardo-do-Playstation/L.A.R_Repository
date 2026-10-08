package com.lar.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;

import com.lar.dtos.LoginDTO;
import com.lar.dtos.LoginResponseDTO;
import com.lar.dtos.PerfilLogadoDTO;
import com.lar.security.JwtUtil;
import com.lar.services.PerfilUsuarioService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Tag(name = "Autenticação", description = "Login e emissão de token JWT.")
@RestController
@RequestMapping("/auth")
public class AuthController {

        @Autowired
        private AuthenticationManager authenticationManager;

        @Autowired
        private JwtUtil jwtUtil;

        @Autowired
        private PerfilUsuarioService perfilUsuarioService;

        @Operation(summary = "Realiza login", description = "Autentica por e-mail e senha e retorna o token JWT e os dados do perfil.")
        @SecurityRequirements
        @PostMapping("/login")
        public ResponseEntity<?> login(@RequestBody LoginDTO dto) {

                try {

                        authenticationManager.authenticate(
                                        new UsernamePasswordAuthenticationToken(
                                                        dto.email,
                                                        dto.senha));

                } catch (DisabledException e) {

                        return ResponseEntity
                                        .status(HttpStatus.FORBIDDEN)
                                        .body(Map.of(
                                                        "erro",
                                                        "Esta conta está suspensa. Entre em contato com o suporte."));

                } catch (BadCredentialsException e) {

                        return ResponseEntity
                                        .status(HttpStatus.UNAUTHORIZED)
                                        .body(Map.of(
                                                        "erro",
                                                        "E-mail ou senha inválidos."));
                }

                String token = jwtUtil.gerarToken(dto.email);

                PerfilLogadoDTO perfil = perfilUsuarioService.obterPerfil(dto.email);

                return ResponseEntity.ok(
                                new LoginResponseDTO(token, perfil));
        }
}