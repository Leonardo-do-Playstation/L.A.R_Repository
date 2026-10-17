package com.lar.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import com.lar.dtos.RegistroAuditoriaDTO;
import com.lar.services.AuditoriaService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Auditoria", description = "Consulta dos registros de auditoria administrativa.")
@RestController
@RequestMapping("/admin/auditoria")
public class AuditoriaController {

    @Autowired
    private AuditoriaService auditoriaService;

    @Operation(summary = "Lista os registros de auditoria", description = "Retorna os registros de auditoria em ordem decrescente de data e hora. Aceita filtro opcional por responsável (nome ou e-mail do admin, busca parcial) e por data (formato AAAA-MM-DD).")
    @GetMapping
    public ResponseEntity<List<RegistroAuditoriaDTO>> listar(
            @RequestParam(required = false) String responsavel,
            @RequestParam(required = false) String data) {

        return ResponseEntity.ok(
                auditoriaService.listar(responsavel, data));
    }
}