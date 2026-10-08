package com.lar.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import com.lar.entities.RegistroAuditoria;
import com.lar.repositories.RegistroAuditoriaRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Auditoria", description = "Consulta dos registros de auditoria administrativa.")
@RestController
@RequestMapping("/admin/auditoria")
public class AuditoriaController {

    @Autowired
    private RegistroAuditoriaRepository registroAuditoriaRepository;

    @Operation(summary = "Lista os registros de auditoria", description = "Retorna os registros de auditoria em ordem decrescente de data e hora.")
    @GetMapping
    public ResponseEntity<List<RegistroAuditoria>> listar() {

        return ResponseEntity.ok(
                registroAuditoriaRepository.findAllByOrderByDataHoraDesc());
    }
}