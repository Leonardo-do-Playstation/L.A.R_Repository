package com.lar.services;

import com.lar.entities.PasswordResetToken;
import com.lar.entities.Usuario;
import com.lar.exceptions.RecursoNaoEncontradoException;
import com.lar.exceptions.RegraDeNegocioException;
import com.lar.repositories.PasswordResetTokenRepository;
import com.lar.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class PasswordResetService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public String solicitarRecuperacao(String email) {

        if (!usuarioRepository.existsByEmail(email)) {
           // Status 409 para não revelar se o email existe 
            throw new RegraDeNegocioException("Se este e-mail estiver cadastrado, um link de recuperação será enviado.");
        }

        String token = UUID.randomUUID().toString();
        LocalDateTime expiracao = LocalDateTime.now().plusMinutes(15);

        tokenRepository.save(new PasswordResetToken(token, email, expiracao));

        System.out.println("Token de recuperação para " + email + ": " + token);

        return token;
    }

    public void redefinirSenha(String token, String novaSenha) {

        PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Token inválido."));

        if (resetToken.getDataExpiracao().isBefore(LocalDateTime.now())) {
            throw new RegraDeNegocioException("Token expirado. Solicite a recuperação novamente.");
        }

        Usuario usuario = usuarioRepository.findByEmail(resetToken.getEmail())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Usuário não encontrado."));

        usuario.setSenha(passwordEncoder.encode(novaSenha));
        usuarioRepository.save(usuario);

        tokenRepository.delete(resetToken);
    }
}