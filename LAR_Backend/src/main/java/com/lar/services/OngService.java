package com.lar.services;

import com.lar.dtos.CadastroOngDTO;
import com.lar.entities.Ong;
import com.lar.enums.StatusOng;
import com.lar.exceptions.RegraDeNegocioException;
import com.lar.repositories.OngRepository;
import com.lar.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class OngService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private OngRepository ongRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Ong cadastrar(CadastroOngDTO dto) {

        if (usuarioRepository.existsByEmail(dto.email)) {
            throw new RegraDeNegocioException("Este e-mail já está cadastrado.");
        }
        if (ongRepository.existsByCnpj(dto.cnpj)) {
            throw new RegraDeNegocioException("Este CNPJ já está cadastrado.");
        }

        String senhaCriptografada = passwordEncoder.encode(dto.senha);

        Ong ong = new Ong();
        ong.setNome(dto.nome);
        ong.setTelefone(dto.telefone);
        ong.setEmail(dto.email);
        ong.setSenha(senhaCriptografada);
        ong.setEndereco(dto.endereco);
        ong.setCnpj(dto.cnpj);
        ong.setData_cadastro(LocalDateTime.now());
        ong.setStatus(StatusOng.PENDENTE);

        return ongRepository.save(ong);
    }
}