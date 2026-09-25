package com.lar.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lar.entities.RegistroAuditoria;
import com.lar.repositories.RegistroAuditoriaRepository;



@RestController
@RequestMapping("/admin/auditoria")
public class AuditoriaController {

    @Autowired
    private RegistroAuditoriaRepository registroAuditoriaRepository;

    @GetMapping
    public ResponseEntity<List<RegistroAuditoria>> listar() {
        return ResponseEntity.ok(registroAuditoriaRepository.findAllByOrderByDataHoraDesc());
    }
}