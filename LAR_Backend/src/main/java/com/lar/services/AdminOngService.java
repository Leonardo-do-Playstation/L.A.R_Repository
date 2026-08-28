package com.lar.services;

import com.lar.entities.Ong;
import com.lar.enums.StatusOng;
import com.lar.repositories.OngRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminOngService {

    @Autowired
    private OngRepository ongRepository;

    public List<Ong> listarPendentes() {
        return ongRepository.findByStatus(StatusOng.PENDENTE);
    }

    public Ong aprovar(Long idOng) {
        Ong ong = buscarOngPendente(idOng);
        ong.setStatus(StatusOng.APROVADA);
        return ongRepository.save(ong);
    }

    public Ong recusar(Long idOng) {
        Ong ong = buscarOngPendente(idOng);
        ong.setStatus(StatusOng.RECUSADA);
        return ongRepository.save(ong);
    }

    private Ong buscarOngPendente(Long idOng) {
        Ong ong = ongRepository.findById(idOng)
                .orElseThrow(() -> new RuntimeException("ONG não encontrada."));

        if (ong.getStatus() != StatusOng.PENDENTE) {
            throw new RuntimeException("Esta ONG já foi analisada anteriormente (status atual: " + ong.getStatus() + ").");
        }

        return ong;
    }
}