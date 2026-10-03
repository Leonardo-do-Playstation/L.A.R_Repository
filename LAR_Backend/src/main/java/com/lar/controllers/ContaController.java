package com.lar.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;

import com.lar.dtos.ConfirmarExclusaoOngDTO;
import com.lar.dtos.ConfirmarTrocaEmailDTO;
import com.lar.dtos.SolicitarExclusaoDTO;
import com.lar.dtos.SolicitarTrocaEmailDTO;
import com.lar.services.ContaService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Tag(
    name = "Conta",
    description = "Troca de e-mail e exclusão da própria conta."
)
@RestController
@RequestMapping("/conta")
public class ContaController {

    @Autowired
    private ContaService contaService;

    @Operation(
        summary = "Solicita exclusão da própria conta",
        description = "Valida a solicitação de exclusão; para ONG, envia confirmação por e-mail."
    )
    @PostMapping("/excluir/solicitar")
    public ResponseEntity<?> solicitar(
            @Valid @RequestBody SolicitarExclusaoDTO dto,
            Authentication authentication) {

        contaService.solicitarExclusao(
                authentication.getName(),
                dto
        );

        return ResponseEntity.ok(
                Map.of(
                    "mensagem",
                    "Se for uma ONG, um e-mail de confirmação foi enviado. Adotantes têm apenas uma confirmação em tela para exclusão."
                )
        );
    }

    @Operation(
        summary = "Confirma a exclusão de uma ONG",
        description = "Confirma a exclusão usando o token temporário enviado por e-mail."
    )
    @SecurityRequirements
    @PostMapping("/excluir/confirmar")
    public ResponseEntity<Void> confirmar(
            @Valid @RequestBody ConfirmarExclusaoOngDTO dto) {

        contaService.confirmarExclusaoOng(dto.token);

        return ResponseEntity.noContent().build();
    }

    @Operation(
        summary = "Solicita troca de e-mail",
        description = "Valida a senha e envia ao e-mail atual um link/token de confirmação."
    )
    @PostMapping("/email/solicitar")
    public ResponseEntity<?> solicitarTrocaEmail(
            @Valid @RequestBody SolicitarTrocaEmailDTO dto,
            Authentication authentication) {

        contaService.solicitarTrocaEmail(
                authentication.getName(),
                dto
        );

        return ResponseEntity.ok(
                Map.of(
                        "mensagem",
                        "Um link de confirmação foi enviado ao seu e-mail atual."
                )
        );
    }

    @Operation(
        summary = "Confirma a troca de e-mail",
        description = "Efetiva a alteração usando o token temporário de confirmação."
    )
    @SecurityRequirements
    @PostMapping("/email/confirmar")
    public ResponseEntity<?> confirmarTrocaEmail(
            @Valid @RequestBody ConfirmarTrocaEmailDTO dto) {

        contaService.confirmarTrocaEmail(dto.token);

        return ResponseEntity.ok(
                Map.of(
                        "mensagem",
                        "E-mail atualizado com sucesso."
                )
        );
    }
}