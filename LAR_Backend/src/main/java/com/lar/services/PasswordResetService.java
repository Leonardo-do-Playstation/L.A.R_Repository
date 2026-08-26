package com.lar.services;

import com.lar.entities.PasswordResetToken;
import com.lar.entities.Usuario;
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
            // Por segurança, não revelamos se o e-mail existe ou não
            throw new RuntimeException("Se este e-mail estiver cadastrado, um link de recuperação será enviado.");
        }

        String token = UUID.randomUUID().toString();
        LocalDateTime expiracao = LocalDateTime.now().plusMinutes(15);

        tokenRepository.save(new PasswordResetToken(token, email, expiracao));

        // TODO: quando o envio de e-mail estiver configurado, trocar por envio real.
        // Por enquanto, o token é exibido no console pra fins de teste.
        System.out.println("Token de recuperação para " + email + ": " + token);

        return token; // devolvido na resposta só enquanto não há e-mail real
    }

    public void redefinirSenha(String token, String novaSenha) {

        PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Token inválido."));

        if (resetToken.getDataExpiracao().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token expirado. Solicite a recuperação novamente.");
        }

        Usuario usuario = usuarioRepository.findByEmail(resetToken.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));

        usuario.setSenha(passwordEncoder.encode(novaSenha));
        usuarioRepository.save(usuario);

        tokenRepository.delete(resetToken); // token de uso único
    }
}