package com.lar.services;

import com.lar.dtos.AtivarAdministradorDTO;
import com.lar.dtos.CriarAdministradorDTO;
import com.lar.entities.Administrador;
import com.lar.entities.ConviteAdministrador;
import com.lar.exceptions.AcessoNegadoException;
import com.lar.exceptions.RecursoNaoEncontradoException;
import com.lar.exceptions.RegraDeNegocioException;
import com.lar.repositories.AdministradorRepository;
import com.lar.repositories.ConviteAdministradorRepository;
import com.lar.repositories.UsuarioRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.HexFormat;
import java.util.Locale;
import java.util.UUID;

@Service
public class AdministradorService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private AdministradorRepository administradorRepository;

    @Autowired
    private ConviteAdministradorRepository conviteRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuditoriaService auditoriaService;

    @Autowired
    private EmailService emailService;

    @Value("${frontend.url:http://localhost:4200}")
    private String frontendUrl;

    public void convidar(
            CriarAdministradorDTO dto,
            String emailAdminCriador) {

        Administrador solicitante =
                administradorRepository.findByEmail(emailAdminCriador)
                .orElseThrow(() -> new RecursoNaoEncontradoException(
                        "Administrador autenticado não encontrado."
                ));

        if (!Boolean.TRUE.equals(solicitante.getSuperAdmin())) {
            throw new AcessoNegadoException(
                    "Apenas o superadministrador pode convidar administradores."
            );
        }

        String email = dto.email.trim().toLowerCase(Locale.ROOT);
        String codigo = dto.codigoAdmin.trim();

        if (usuarioRepository.existsByEmail(email)
                || conviteRepository.existsByEmailAndUtilizadoEmIsNull(email)) {

            throw new RegraDeNegocioException(
                    "Este e-mail já possui uma conta ou convite pendente."
            );
        }

        if (administradorRepository.existsByCodigoAdmin(codigo)
                || conviteRepository.existsByCodigoAdminAndUtilizadoEmIsNull(codigo)) {

            throw new RegraDeNegocioException(
                    "Código de administrador já utilizado ou reservado."
            );
        }

        String token = UUID.randomUUID().toString()
                + UUID.randomUUID().toString();

        ConviteAdministrador convite = new ConviteAdministrador(
                hash(token),
                dto.nome.trim(),
                email,
                codigo,
                solicitante.getEmail(),
                LocalDateTime.now().plusMinutes(15)
        );

        conviteRepository.save(convite);

        String link = frontendUrl
                + "/ativar-administrador?token=" + token;

        emailService.enviar(
                email,
                "Convite para administrador — L.A.R.",
                "Olá, " + dto.nome.trim() + "!\n\n"
                        + "Você foi convidado para administrar o L.A.R.\n"
                        + "Defina sua senha usando este link "
                        + "(válido por 15 minutos):\n"
                        + link
                        + "\n\nSe você não esperava este convite, "
                        + "ignore a mensagem."
        );

        auditoriaService.registrar(
                solicitante.getEmail(),
                "CONVIDAR_ADMINISTRADOR",
                "Convite para " + email
        );
    }

    @Transactional
    public void ativar(AtivarAdministradorDTO dto) {

        if (!dto.senha.equals(dto.confirmarSenha)) {
            throw new RegraDeNegocioException(
                    "As senhas não coincidem."
            );
        }

        ConviteAdministrador convite =
                conviteRepository.findByTokenHash(hash(dto.token))
                .orElseThrow(() -> new RegraDeNegocioException(
                        "Convite inválido."
                ));

        if (convite.getUtilizadoEm() != null
                || !convite.getExpiraEm().isAfter(LocalDateTime.now())) {

            throw new RegraDeNegocioException(
                    "Convite utilizado ou expirado."
            );
        }

        if (usuarioRepository.existsByEmail(convite.getEmail())
                || administradorRepository.existsByCodigoAdmin(
                        convite.getCodigoAdmin())) {

            throw new RegraDeNegocioException(
                    "E-mail ou código de administrador já cadastrado."
            );
        }

        Administrador admin = new Administrador();

        admin.setNome(convite.getNome());
        admin.setEmail(convite.getEmail());
        admin.setCodigoAdmin(convite.getCodigoAdmin());
        admin.setSenha(passwordEncoder.encode(dto.senha));
        admin.setSuperAdmin(false);
        admin.setBloqueado(false);
        admin.setData_cadastro(LocalDateTime.now());

        administradorRepository.save(admin);

        convite.setUtilizadoEm(LocalDateTime.now());
        conviteRepository.save(convite);

        auditoriaService.registrar(
                convite.getCriadoPor(),
                "ATIVAR_ADMINISTRADOR",
                "Administrador id=" + admin.getId()
                        + " (" + admin.getEmail() + ")"
        );
    }

    private String hash(String token) {
        try {
            byte[] bytes = MessageDigest.getInstance("SHA-256")
                    .digest(token.getBytes(StandardCharsets.UTF_8));

            return HexFormat.of().formatHex(bytes);

        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException(
                    "SHA-256 indisponível", e
            );
        }
    }
}