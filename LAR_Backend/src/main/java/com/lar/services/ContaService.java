package com.lar.services;

import com.lar.dtos.SolicitarExclusaoDTO;
import com.lar.dtos.SolicitarTrocaEmailDTO;
import com.lar.entities.*;
import com.lar.exceptions.AcessoNegadoException;
import com.lar.exceptions.RecursoNaoEncontradoException;
import com.lar.exceptions.RegraDeNegocioException;
import com.lar.repositories.*;
import com.lar.storage.StorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.lar.dtos.AlterarSenhaDTO;

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

    @Autowired
    private EmailChangeTokenRepository emailChangeTokenRepository;

    @Autowired
    private EmailService emailService;

    @Value("${frontend.confirmar-email-url}")
    private String confirmarEmailUrl;

    @Value("${frontend.confirmacao-exclusao-url}")
    private String confirmacaoExclusaoUrl;

        public void alterarSenha(String emailAutenticado, AlterarSenhaDTO dto) {
        Usuario usuario = buscarUsuarioAutenticado(emailAutenticado);

        if (!passwordEncoder.matches(dto.senhaAtual, usuario.getSenha())) {
            throw new AcessoNegadoException("Senha atual incorreta.");
        }

        usuario.setSenha(passwordEncoder.encode(dto.novaSenha));
        usuarioRepository.save(usuario);
    }

    public void solicitarTrocaEmail(String emailAutenticado, SolicitarTrocaEmailDTO dto) {
        Usuario usuario = usuarioRepository.findByEmail(emailAutenticado)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Usuário autenticado não encontrado."));

        if (!passwordEncoder.matches(dto.senha, usuario.getSenha())) {
            throw new AcessoNegadoException("Senha incorreta.");
        }

        if (usuarioRepository.existsByEmail(dto.novoEmail)) {
            throw new RegraDeNegocioException("Este e-mail já está em uso por outra conta.");
        }

        String token = UUID.randomUUID().toString();
        LocalDateTime expiracao = LocalDateTime.now().plusMinutes(15);

        emailChangeTokenRepository.save(
                new EmailChangeToken(token, usuario.getEmail(), dto.novoEmail, expiracao));

        String link = confirmarEmailUrl + "?token=" + token;


        emailService.enviar(
                usuario.getEmail(),
                "Confirmação de troca de e-mail — L.A.R.",
                "Foi solicitada a alteração do e-mail desta conta para: " + dto.novoEmail + "\n\n" +
                        "Para confirmar essa mudança, acesse o link abaixo (válido por 15 minutos):\n" + link + "\n\n" +
                        "Se você não solicitou essa alteração, ignore este e-mail — nada será alterado " +
                        "e recomendamos verificar a segurança da sua conta.");
    }

    public void confirmarTrocaEmail(String token) {
        EmailChangeToken changeToken = emailChangeTokenRepository.findByToken(token)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Token inválido."));

        if (changeToken.dataExpiracao.isBefore(LocalDateTime.now())) {
            throw new RegraDeNegocioException("Token expirado. Solicite a troca novamente.");
        }

        Usuario usuario = usuarioRepository.findByEmail(changeToken.emailAtual)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Usuário não encontrado."));

        if (usuarioRepository.existsByEmail(changeToken.novoEmail)) {
            throw new RegraDeNegocioException("Este e-mail já está em uso por outra conta.");
        }

        usuario.setEmail(changeToken.novoEmail);
        usuarioRepository.save(usuario);

        emailChangeTokenRepository.delete(changeToken);
    }

   public void solicitarExclusao(String emailAutenticado, SolicitarExclusaoDTO dto) {
    Usuario usuario = buscarUsuarioAutenticado(emailAutenticado);

    if (!passwordEncoder.matches(dto.senha, usuario.getSenha())) {
        throw new AcessoNegadoException("Senha incorreta. Exclusão não realizada.");
    }

    if (usuario instanceof Ong) {
        String token = UUID.randomUUID().toString();
        LocalDateTime expiracao = LocalDateTime.now().plusMinutes(15);

        exclusaoTokenRepository.save(new ExclusaoContaToken(token, usuario.getEmail(), expiracao));

        String link = confirmacaoExclusaoUrl + "?token=" + token;

        emailService.enviar(
                usuario.getEmail(),
                "Confirmação de exclusão de conta — L.A.R.",
                "Você solicitou a exclusão da conta institucional \"" + usuario.getNome() + "\".\n\n" +
                "Esta ação é irreversível e removerá também todos os animais cadastrados por sua ONG.\n\n" +
                "Para confirmar, acesse o link abaixo (válido por 15 minutos):\n" + link + "\n\n" +
                "Se você não solicitou isso, ignore este e-mail e sua conta permanecerá ativa."
        );

        return;
    }

    excluirDadosDoUsuario(usuario);
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
                favoritoRepository.findByAdotanteIdOrderByDataFavoritadoDesc(usuario.getId()));

        usuarioRepository.delete(usuario);
    }

    private Usuario buscarUsuarioAutenticado(String email) {
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Usuário autenticado não encontrado."));
    }
}