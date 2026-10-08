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

        if (!usuarioRepository.existsByEmail(email)) {
            throw new RegraDeNegocioException("Se este e-mail estiver cadastrado, um link de recuperação será enviado.");
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