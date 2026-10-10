package com.lar.services;

import com.lar.dtos.OngPerfilDTO;
import com.lar.entities.Ong;
import com.lar.enums.StatusOng;
import com.lar.exceptions.RecursoNaoEncontradoException;
import com.lar.repositories.OngRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminOngService {

        @Autowired
        private OngRepository ongRepository;

        @Autowired
        private OngPerfilService ongPerfilService;

        @Autowired
        private EmailService emailService;

        @Autowired
        private AuditoriaService auditoriaService;

        public List<OngPerfilDTO> listarPendentes() {
                return ongRepository.findByStatus(StatusOng.PENDENTE)
                                .stream()
                                .map(ong -> ongPerfilService.buscarMeuPerfil(ong.getEmail()))
                                .collect(Collectors.toList());
        }

        public OngPerfilDTO aprovar(Long idOng, String emailAdmin) {
                Ong ong = buscarOng(idOng);
                boolean reanalise = ong.getStatus() != StatusOng.PENDENTE;

                ong.setStatus(StatusOng.APROVADA);
                Ong salva = ongRepository.save(ong);

                emailService.enviar(
                                salva.getEmail(),
                                reanalise ? "Situação do cadastro atualizada — L.A.R." : "Cadastro aprovado — L.A.R.",
                                "Olá, " + salva.getNome() + "!\n\n" +
                                                (reanalise
                                                                ? "Após reavaliação, seu cadastro institucional foi aprovado.\n\n"
                                                                : "Seu cadastro institucional foi aprovado.\n\n")
                                                +
                                                "Você já pode acessar sua área e cadastrar animais para adoção.\n\n" +
                                                "Equipe L.A.R.");

                auditoriaService.registrar(emailAdmin, "APROVAR_ONG",
                                "ONG id=" + salva.getId() + " (" + salva.getNome() + ")");

                return ongPerfilService.buscarMeuPerfil(salva.getEmail());
        }

        public OngPerfilDTO recusar(Long idOng, String motivo, String emailAdmin) {
                Ong ong = buscarOng(idOng);
                boolean reanalise = ong.getStatus() != StatusOng.PENDENTE;

                ong.setStatus(StatusOng.RECUSADA);
                Ong salva = ongRepository.save(ong);

                emailService.enviar(
                                salva.getEmail(),
                                reanalise ? "Situação do cadastro atualizada — L.A.R."
                                                : "Cadastro não aprovado — L.A.R.",
                                "Olá, " + salva.getNome() + ".\n\n" +
                                                (reanalise
                                                                ? "Após reavaliação, seu cadastro institucional foi recusado.\n\n"
                                                                : "Infelizmente seu cadastro institucional não foi aprovado.\n\n")
                                                +
                                                "Motivo informado pelo administrador:\n" + motivo + "\n\n" +
                                                "Se desejar esclarecer alguma informação, entre em contato com nosso suporte.\n\n"
                                                +
                                                "Equipe L.A.R.");

                auditoriaService.registrar(emailAdmin, "RECUSAR_ONG",
                                "ONG id=" + salva.getId() + " (" + salva.getNome() + ") — motivo: " + motivo);

                return ongPerfilService.buscarMeuPerfil(salva.getEmail());
        }

        private Ong buscarOng(Long idOng) {
                return ongRepository.findById(idOng)
                                .orElseThrow(() -> new RecursoNaoEncontradoException("ONG não encontrada."));
        }
}