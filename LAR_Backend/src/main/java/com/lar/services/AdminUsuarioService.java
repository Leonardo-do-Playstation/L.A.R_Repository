package com.lar.services;

import com.lar.dtos.AtualizarUsuarioAdminDTO;
import com.lar.dtos.UsuarioAdminDTO;
import com.lar.entities.Administrador;
import com.lar.entities.Adotante;
import com.lar.entities.Ong;
import com.lar.entities.Usuario;
import com.lar.exceptions.AcessoNegadoException;
import com.lar.exceptions.RecursoNaoEncontradoException;
import com.lar.exceptions.RegraDeNegocioException;
import com.lar.repositories.OngRepository;
import com.lar.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.lar.services.EmailService;
import com.lar.repositories.AdotanteRepository;
import com.lar.validators.DocumentoValidator;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminUsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private OngRepository ongRepository;

    @Autowired
    private AuditoriaService auditoriaService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private AdotanteRepository adotanteRepository;

    public List<UsuarioAdminDTO> listarTodos() {
        return usuarioRepository.findAll()
                .stream()
                .map(this::toAdminDTO)
                .collect(Collectors.toList());
    }

    public List<UsuarioAdminDTO> buscar(String termo) {
        return usuarioRepository.buscarPorNomeOuEmail(termo)
                .stream()
                .map(this::toAdminDTO)
                .collect(Collectors.toList());
    }

    public UsuarioAdminDTO buscarPorId(Long id) {
        return toAdminDTO(buscarUsuario(id));
    }

    public UsuarioAdminDTO editar(Long id, AtualizarUsuarioAdminDTO dto, String emailAdmin) {
        Usuario usuario = buscarUsuario(id);

        String campoAlterado = null;

        if (usuario instanceof Adotante adotante) {
            if (dto.cpf == null || dto.cpf.isBlank()) {
                throw new RegraDeNegocioException("CPF é obrigatório.");
            }
            if (!DocumentoValidator.cpfValido(dto.cpf)) {
                throw new RegraDeNegocioException("CPF inválido.");
            }
            if (!dto.cpf.equals(adotante.getCpf())) {
                if (adotanteRepository.existsByCpf(dto.cpf)) {
                    throw new RegraDeNegocioException("Este CPF já está cadastrado para outra conta.");
                }
                adotante.setCpf(dto.cpf);
                campoAlterado = "CPF";
            }

        } else if (usuario instanceof Ong ong) {
            if (dto.cnpj != null && !dto.cnpj.isBlank() && !dto.cnpj.equals(ong.getCnpj())) {
                if (!DocumentoValidator.cnpjValido(dto.cnpj)) {
                    throw new RegraDeNegocioException("CNPJ inválido.");
                }
                if (ongRepository.existsByCnpj(dto.cnpj)) {
                    throw new RegraDeNegocioException("Este CNPJ já está cadastrado para outra ONG.");
                }
                ong.setCnpj(dto.cnpj);
                campoAlterado = "CNPJ";
            }

        } else {
            throw new RegraDeNegocioException("Este tipo de usuário não possui campo editável nesta tela.");
        }

        Usuario salvo = usuarioRepository.save(usuario);

        if (campoAlterado != null) {
            String justificativaTexto = (dto.justificativa != null && !dto.justificativa.isBlank())
                    ? "\nJustificativa informada pelo administrador:\n" + dto.justificativa.trim() + "\n"
                    : "";

            emailService.enviar(
                    salvo.getEmail(),
                    "Dados cadastrais atualizados — L.A.R.",
                    "Olá, " + salvo.getNome() + ".\n\n" +
                            "Seu " + campoAlterado + " foi atualizado por um administrador do sistema L.A.R.\n"
                            +
                            justificativaTexto +
                            "\nSe você não esperava essa alteração, entre em contato com nosso suporte.\n\n" +
                            "Equipe L.A.R.");
        }

        auditoriaService.registrar(emailAdmin, "EDITAR_USUARIO",
                "Usuario id=" + salvo.getId() + " (" + salvo.getEmail() + ")"
                        + (campoAlterado != null ? " — " + campoAlterado + " alterado" : " — nenhum campo alterado")
                        + (campoAlterado != null && dto.justificativa != null && !dto.justificativa.isBlank()
                                ? " — justificativa: " + dto.justificativa.trim()
                                : ""));

        return toAdminDTO(salvo);
    }

    public UsuarioAdminDTO alternarBloqueio(Long id, String mensagemAdmin, String emailAdminAutenticado) {
        Usuario usuario = buscarUsuario(id);

        if (usuario.getEmail().equalsIgnoreCase(emailAdminAutenticado)) {
            throw new AcessoNegadoException("Você não pode bloquear a própria conta.");
        }

        boolean novoEstado = !Boolean.TRUE.equals(usuario.getBloqueado());

        if (novoEstado && usuario instanceof Administrador) {
            Usuario solicitante = usuarioRepository.findByEmail(emailAdminAutenticado)
                    .orElseThrow(() -> new RecursoNaoEncontradoException("Administrador autenticado não encontrado."));

            boolean ehSuperAdmin = solicitante instanceof Administrador administradorSolicitante
                    && Boolean.TRUE.equals(administradorSolicitante.getSuperAdmin());

            if (!ehSuperAdmin) {
                throw new AcessoNegadoException(
                        "Apenas o administrador principal pode bloquear outros administradores.");
            }

            long adminsAtivos = usuarioRepository.findAll().stream()
                    .filter(u -> u instanceof Administrador)
                    .filter(u -> !Boolean.TRUE.equals(u.getBloqueado()))
                    .count();

            if (adminsAtivos <= 1) {
                throw new RegraDeNegocioException("Não é possível bloquear o único Administrador ativo do sistema.");
            }
        }

        usuario.setBloqueado(novoEstado);
        Usuario salvo = usuarioRepository.save(usuario);

        String mensagemPersonalizada = (mensagemAdmin != null && !mensagemAdmin.isBlank())
                ? "\nMensagem do administrador:\n" + mensagemAdmin.trim() + "\n"
                : "";

        emailService.enviar(
                salvo.getEmail(),
                novoEstado ? "Conta bloqueada — L.A.R." : "Conta reativada — L.A.R.",
                "Olá, " + salvo.getNome() + ".\n\n" +
                        (novoEstado
                                ? "Sua conta no sistema L.A.R. foi bloqueada por um administrador e o acesso está temporariamente suspenso.\n"
                                : "Sua conta no sistema L.A.R. foi reativada e você já pode acessar normalmente.\n")
                        +
                        mensagemPersonalizada +
                        "\nSe você acredita que isso é um engano, entre em contato com nosso suporte.\n\n" +
                        "Equipe L.A.R.");

        auditoriaService.registrar(emailAdminAutenticado, novoEstado ? "BLOQUEAR_USUARIO" : "DESBLOQUEAR_USUARIO",
                "Usuario id=" + salvo.getId() + " (" + salvo.getEmail() + ")"
                        + (mensagemAdmin != null && !mensagemAdmin.isBlank() ? " — mensagem: " + mensagemAdmin.trim() : ""));

        return toAdminDTO(salvo);
    }

    private Usuario buscarUsuario(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Usuário não encontrado."));
    }

    private UsuarioAdminDTO toAdminDTO(Usuario usuario) {
        UsuarioAdminDTO dto = new UsuarioAdminDTO();
        dto.id = usuario.getId();
        dto.nome = usuario.getNome();
        dto.email = usuario.getEmail();
        dto.telefone = usuario.getTelefone();
        dto.endereco = usuario.getEndereco();
        dto.bloqueado = Boolean.TRUE.equals(usuario.getBloqueado());
        dto.tipo = usuario.getClass().getSimpleName().toUpperCase();

        if (usuario instanceof Adotante adotante) {
            dto.cpf = adotante.getCpf();
        } else if (usuario instanceof Ong ong) {
            dto.cnpj = ong.getCnpj();
            dto.statusOng = ong.getStatus().name();
        } else if (usuario instanceof Administrador admin) {
            dto.codigoAdmin = admin.getCodigoAdmin();
        }

        return dto;
    }
}