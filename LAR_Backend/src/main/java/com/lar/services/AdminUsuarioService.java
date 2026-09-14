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

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminUsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private OngRepository ongRepository;

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

    public UsuarioAdminDTO editar(Long id, AtualizarUsuarioAdminDTO dto) {
        Usuario usuario = buscarUsuario(id);

        if (!usuario.getEmail().equalsIgnoreCase(dto.email) && usuarioRepository.existsByEmail(dto.email)) {
            throw new RegraDeNegocioException("Este e-mail já está em uso por outra conta.");
        }

        usuario.setNome(dto.nome);
        usuario.setEmail(dto.email);
        usuario.setTelefone(dto.telefone);
        usuario.setEndereco(dto.endereco);

        if (usuario instanceof Ong ong && dto.cnpj != null && !dto.cnpj.isBlank()) {
            if (!dto.cnpj.equals(ong.getCnpj()) && ongRepository.existsByCnpj(dto.cnpj)) {
                throw new RegraDeNegocioException("Este CNPJ já está cadastrado para outra ONG.");
            }
            ong.setCnpj(dto.cnpj);
        }

        Usuario salvo = usuarioRepository.save(usuario);
        return toAdminDTO(salvo);
    }

    public UsuarioAdminDTO alternarBloqueio(Long id, String emailAdminAutenticado) {
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
            throw new AcessoNegadoException("Apenas o administrador principal pode bloquear outros administradores.");
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