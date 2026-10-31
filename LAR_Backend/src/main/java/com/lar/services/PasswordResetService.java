package com.lar.services;

import com.lar.entities.PasswordResetToken;
import com.lar.entities.Usuario;
import com.lar.exceptions.RecursoNaoEncontradoException;
import com.lar.exceptions.RegraDeNegocioException;
import com.lar.repositories.PasswordResetTokenRepository;
import com.lar.repositories.UsuarioRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class PasswordResetService {

        @Value("${frontend.url}")
        private String frontendUrl;

        @Autowired
        private UsuarioRepository usuarioRepository;

        @Autowired
        private PasswordResetTokenRepository tokenRepository;

        @Autowired
        private PasswordEncoder passwordEncoder;

        @Autowired
        private EmailService emailService;

        public void solicitarRecuperacao(String email) {

                Optional<Usuario> usuarioOptional = usuarioRepository.findByEmail(email);

                if (usuarioOptional.isEmpty()) {
                        return;
                }

                String token = UUID.randomUUID().toString();
                LocalDateTime expiracao = LocalDateTime.now().plusMinutes(15);

                PasswordResetToken passwordResetToken = new PasswordResetToken(token, email, expiracao);

                tokenRepository.save(passwordResetToken);

                String linkRecuperacao = frontendUrl + "/redefinir-senha?token=" + token;

                emailService.enviar(
                                email,
                                "Recuperação de senha — L.A.R.",
                                "Olá!\n\n" +
                                                "Recebemos uma solicitação para redefinir sua senha.\n\n" +
                                                "Acesse o link abaixo para criar uma nova senha:\n\n" +
                                                linkRecuperacao +
                                                "\n\nEste link expira em 15 minutos.\n\n" +
                                                "Se você não solicitou a recuperação de senha, " +
                                                "ignore este e-mail.");
        }

        public void redefinirSenha(String token, String novaSenha) {

                PasswordResetToken resetToken = tokenRepository.findByToken(token)
                                .orElseThrow(() -> new RecursoNaoEncontradoException(
                                                "Token de recuperação inválido."));

                if (resetToken.getDataExpiracao().isBefore(LocalDateTime.now())) {

                        tokenRepository.delete(resetToken);

                        throw new RegraDeNegocioException(
                                        "Token expirado. Solicite a recuperação novamente.");
                }

                Usuario usuario = usuarioRepository.findByEmail(resetToken.getEmail())
                                .orElseThrow(() -> new RecursoNaoEncontradoException(
                                                "Usuário não encontrado."));

                usuario.setSenha(passwordEncoder.encode(novaSenha));

                usuarioRepository.save(usuario);

                tokenRepository.delete(resetToken);
        }
}