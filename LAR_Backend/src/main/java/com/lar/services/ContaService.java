package com.lar.services;

import com.lar.dtos.SolicitarExclusaoDTO;
import com.lar.entities.*;
import com.lar.exceptions.AcessoNegadoException;
import com.lar.exceptions.RecursoNaoEncontradoException;
import com.lar.exceptions.RegraDeNegocioException;
import com.lar.repositories.*;
import com.lar.storage.StorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class ContaService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private AnimalRepository animalRepository;

    @Autowired
    private FavoritoRepository favoritoRepository;

    @Autowired
    private ExclusaoContaTokenRepository exclusaoTokenRepository;

    @Autowired
    private StorageService storageService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public String solicitarExclusao(String emailAutenticado, SolicitarExclusaoDTO dto) {
        Usuario usuario = buscarUsuarioAutenticado(emailAutenticado);

        if (!passwordEncoder.matches(dto.senha, usuario.getSenha())) {
            throw new AcessoNegadoException("Senha incorreta. Exclusão não realizada.");
        }

        if (usuario instanceof Ong) {
            String token = UUID.randomUUID().toString();
            LocalDateTime expiracao = LocalDateTime.now().plusMinutes(15);

            exclusaoTokenRepository.save(new ExclusaoContaToken(token, usuario.getEmail(), expiracao));

            // TODO: substituir por envio de e-mail real quando configurado.
            System.out.println("Token de confirmação de exclusão para " + usuario.getEmail() + ": " + token);

            return token; // exposto na resposta só enquanto não há envio de e-mail real
        }

        // Adotante: exclui direto, sem etapa extra
        excluirDadosDoUsuario(usuario);
        return null;
    }

    public void confirmarExclusaoOng(String token) {
        ExclusaoContaToken exclusaoToken = exclusaoTokenRepository.findByToken(token)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Token de confirmação inválido."));

        if (exclusaoToken.dataExpiracao.isBefore(LocalDateTime.now())) {
            throw new RegraDeNegocioException("Token expirado. Solicite a exclusão novamente.");
        }

        Usuario usuario = usuarioRepository.findByEmail(exclusaoToken.email)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Usuário não encontrado."));

        excluirDadosDoUsuario(usuario);
        exclusaoTokenRepository.delete(exclusaoToken);
    }

    private void excluirDadosDoUsuario(Usuario usuario) {
        if (usuario instanceof Ong ong) {
            for (Animal animal : animalRepository.findByOngId(ong.getId())) {
                if (animal.foto != null && !animal.foto.isBlank()) {
                    storageService.delete(animal.foto);
                }
                animalRepository.delete(animal);
            }
        }

        favoritoRepository.deleteAll(
                favoritoRepository.findByAdotanteIdOrderByDataFavoritadoDesc(usuario.getId())
        );

        usuarioRepository.delete(usuario);
    }

    private Usuario buscarUsuarioAutenticado(String email) {
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Usuário autenticado não encontrado."));
    }
}