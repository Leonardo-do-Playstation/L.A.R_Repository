package com.lar.services;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.lar.dtos.CadastroAdotanteDTO;
import com.lar.entities.Adotante;
import com.lar.exceptions.RegraDeNegocioException;
import com.lar.repositories.AdotanteRepository;
import com.lar.repositories.UsuarioRepository;

@Service
public class AdotanteService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private AdotanteRepository adotanteRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Adotante cadastrar(CadastroAdotanteDTO dto) {

        if (usuarioRepository.existsByEmail(dto.email)) {
            throw new RegraDeNegocioException("Este e-mail já está cadastrado.");
        }
        if (adotanteRepository.existsByCpf(dto.cpf)) {
            throw new RegraDeNegocioException("Este CPF já está cadastrado.");
        }

        String senhaCriptografada = passwordEncoder.encode(dto.senha);

        Adotante adotante = new Adotante();
        adotante.setNome(dto.nome);
        adotante.setTelefone(dto.telefone);
        adotante.setEmail(dto.email);
        adotante.setSenha(senhaCriptografada);
        adotante.setEndereco(dto.endereco);
        adotante.setCpf(dto.cpf);
        adotante.setData_cadastro(LocalDateTime.now());

        return adotanteRepository.save(adotante);
    }
}
