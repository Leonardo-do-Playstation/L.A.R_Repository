package com.lar.services;

import com.lar.entities.RegistroAuditoria;
import com.lar.repositories.RegistroAuditoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuditoriaService {

    @Autowired
    private RegistroAuditoriaRepository registroAuditoriaRepository;

    public void registrar(String usuarioResponsavel, String acao, String registroAfetado) {
        registroAuditoriaRepository.save(new RegistroAuditoria(usuarioResponsavel, acao, registroAfetado));
    }
}