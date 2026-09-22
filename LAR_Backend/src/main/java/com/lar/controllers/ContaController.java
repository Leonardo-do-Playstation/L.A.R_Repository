package com.lar.controllers;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lar.dtos.ConfirmarExclusaoOngDTO;
import com.lar.dtos.ConfirmarTrocaEmailDTO;
import com.lar.dtos.SolicitarExclusaoDTO;
import com.lar.dtos.SolicitarTrocaEmailDTO;
import com.lar.services.ContaService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/conta")
public class ContaController {

    @Autowired
    private ContaService contaService;

    @PostMapping("/excluir/solicitar")
    public ResponseEntity<?> solicitar(@Valid @RequestBody SolicitarExclusaoDTO dto,
            Authentication authentication) {
        contaService.solicitarExclusao(authentication.getName(), dto);
        return ResponseEntity.ok(Map.of(
                "mensagem",
                "Se for uma ONG, um e-mail de confirmação foi enviado. Adotantes têm apenas uma confirmação em tela para exclusão."));
    }

    @PostMapping("/excluir/confirmar")
    public ResponseEntity<Void> confirmar(@Valid @RequestBody ConfirmarExclusaoOngDTO dto) {
        contaService.confirmarExclusaoOng(dto.token);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/email/solicitar")
    public ResponseEntity<?> solicitarTrocaEmail(@Valid @RequestBody SolicitarTrocaEmailDTO dto,
            Authentication authentication) {
        contaService.solicitarTrocaEmail(authentication.getName(), dto);
        return ResponseEntity.ok(Map.of(
                "mensagem", "Um link de confirmação foi enviado ao seu e-mail atual."));
    }

    @PostMapping("/email/confirmar")
    public ResponseEntity<?> confirmarTrocaEmail(@Valid @RequestBody ConfirmarTrocaEmailDTO dto) {
        contaService.confirmarTrocaEmail(dto.token);
        return ResponseEntity.ok(Map.of("mensagem", "E-mail atualizado com sucesso."));
    }
}