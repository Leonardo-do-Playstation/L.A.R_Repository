package com.lar.services;

import com.lar.dtos.AlterarStatusAnimalDTO;
import com.lar.dtos.AnimalDetalhesDTO;
import com.lar.dtos.AnimalResponseDTO;
import com.lar.dtos.CadastroAnimalDTO;
import com.lar.dtos.OngPublicaDTO;
import com.lar.entities.Animal;
import com.lar.entities.Ong;
import com.lar.enums.StatusAnimal;
import com.lar.exceptions.AcessoNegadoException;
import com.lar.exceptions.RecursoNaoEncontradoException;
import com.lar.exceptions.RegraDeNegocioException;
import com.lar.repositories.AnimalRepository;
import com.lar.repositories.OngRepository;
import com.lar.specifications.AnimalSpecification;
import com.lar.storage.StorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AnimalService {

    @Autowired
    private AnimalRepository animalRepository;

    @Autowired
    private OngRepository ongRepository;

    @Autowired
    private StorageService storageService;

    public List<AnimalDetalhesDTO> listarTodosPublico() {
        return animalRepository.findAll()
                .stream()
                .map(this::paraDetalhesDTO)
                .collect(Collectors.toList());
    }

    public AnimalResponseDTO cadastrar(CadastroAnimalDTO dto, MultipartFile foto, String emailOngAutenticada) {

        Ong ong = buscarOngAutenticada(emailOngAutenticada);

        Animal animal = new Animal();
        animal.nome = dto.nome;
        animal.especie = dto.especie;
        animal.idade = dto.idade;
        animal.raca = dto.raca;
        animal.sexo = dto.sexo;
        animal.porte = dto.porte;
        animal.cor = dto.cor;
        animal.descricao = dto.descricao;
        animal.status = StatusAnimal.DISPONIVEL;
        animal.ong = ong;

        if (foto != null && !foto.isEmpty()) {
            animal.foto = storageService.upload(foto);
        }

        Animal salvo = animalRepository.save(animal);
        return toResponseDTO(salvo);
    }

    public List<AnimalResponseDTO> listarMeusAnimais(String emailOngAutenticada) {
        Ong ong = buscarOngAutenticada(emailOngAutenticada);
        return animalRepository.findByOngId(ong.getId())
                .stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    public AnimalResponseDTO editar(Long idAnimal, CadastroAnimalDTO dto, MultipartFile foto,
            String emailOngAutenticada) {

        Animal animal = buscarAnimalDaOng(idAnimal, emailOngAutenticada);

        animal.nome = dto.nome;
        animal.especie = dto.especie;
        animal.idade = dto.idade;
        animal.raca = dto.raca;
        animal.sexo = dto.sexo;
        animal.porte = dto.porte;
        animal.cor = dto.cor;
        animal.descricao = dto.descricao;

        if (foto != null && !foto.isEmpty()) {
            storageService.delete(animal.foto);
            animal.foto = storageService.upload(foto);
        }

        Animal salvo = animalRepository.save(animal);
        return toResponseDTO(salvo);
    }

    public AnimalResponseDTO alterarStatus(Long idAnimal, AlterarStatusAnimalDTO dto, String emailOngAutenticada) {

        Animal animal = buscarAnimalDaOng(idAnimal, emailOngAutenticada);

        StatusAnimal novoStatus;
        try {
            novoStatus = StatusAnimal.valueOf(dto.status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RegraDeNegocioException("Status inválido. Use DISPONIVEL, ADOTADO ou EM_TRATAMENTO.");
        }

        animal.status = novoStatus;
        Animal salvo = animalRepository.save(animal);
        return toResponseDTO(salvo);
    }

    public void excluir(Long idAnimal, String emailOngAutenticada) {
        Animal animal = buscarAnimalDaOng(idAnimal, emailOngAutenticada);

        if (animal.foto != null && !animal.foto.isBlank()) {
            storageService.delete(animal.foto);
        }

        animalRepository.delete(animal);
    }

    private Ong buscarOngAutenticada(String email) {
        return ongRepository.findByEmail(email)
                .orElseThrow(() -> new RecursoNaoEncontradoException("ONG autenticada não encontrada."));
    }

    private Animal buscarAnimalDaOng(Long idAnimal, String emailOngAutenticada) {
        Animal animal = animalRepository.findById(idAnimal)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Animal não encontrado."));

        Ong ongAutenticada = buscarOngAutenticada(emailOngAutenticada);

        if (!animal.ong.getId().equals(ongAutenticada.getId())) {
            throw new AcessoNegadoException("Você não tem permissão para alterar animais de outra ONG.");
        }

        return animal;
    }

    public Page<AnimalDetalhesDTO> buscarComFiltros(String especie, String porte, String sexo, String status,
                                                 String raca, String cor,
                                                 Integer idadeMinima, Integer idadeMaxima,
                                                 Pageable pageable) {

        StatusAnimal statusFiltro;
        if (status != null && !status.isBlank()) {
            try {
                statusFiltro = StatusAnimal.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new RegraDeNegocioException("Status inválido. Use DISPONIVEL, ADOTADO ou EM_TRATAMENTO.");
            }
        } else {
            // Sem filtro explícito, o catálogo público mostra só quem está disponível pra adoção
            statusFiltro = StatusAnimal.DISPONIVEL;
        }

        Specification<Animal> filtro = Specification
                .where(AnimalSpecification.comEspecie(especie))
                .and(AnimalSpecification.comPorte(porte))
                .and(AnimalSpecification.comSexo(sexo))
                .and(AnimalSpecification.comStatus(statusFiltro))
                .and(AnimalSpecification.comRaca(raca))
                .and(AnimalSpecification.comCor(cor))
                .and(AnimalSpecification.comIdadeMinima(idadeMinima))
                .and(AnimalSpecification.comIdadeMaxima(idadeMaxima));

        return animalRepository.findAll(filtro, pageable)
                .map(this::paraDetalhesDTO);
    }

    private AnimalResponseDTO toResponseDTO(Animal animal) {
        AnimalResponseDTO dto = new AnimalResponseDTO();
        dto.id = animal.id;
        dto.nome = animal.nome;
        dto.especie = animal.especie;
        dto.idade = animal.idade;
        dto.raca = animal.raca;
        dto.sexo = animal.sexo;
        dto.porte = animal.porte;
        dto.cor = animal.cor;
        dto.descricao = animal.descricao;
        dto.foto = animal.foto;
        dto.status = animal.status.name();
        dto.idOng = animal.ong.getId();
        dto.nomeOng = animal.ong.getNome();
        return dto;
    }

    public AnimalDetalhesDTO buscarDetalhes(Long idAnimal) {
        Animal animal = animalRepository.findById(idAnimal)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Animal não encontrado."));
        return paraDetalhesDTO(animal);
    }

    public AnimalDetalhesDTO paraDetalhesDTO(Animal animal) {
        AnimalDetalhesDTO dto = new AnimalDetalhesDTO();
        dto.id = animal.id;
        dto.nome = animal.nome;
        dto.especie = animal.especie;
        dto.idade = animal.idade;
        dto.raca = animal.raca;
        dto.sexo = animal.sexo;
        dto.porte = animal.porte;
        dto.cor = animal.cor;
        dto.descricao = animal.descricao;
        dto.foto = animal.foto;
        dto.status = animal.status.name();

        OngPublicaDTO ongDto = new OngPublicaDTO();
        ongDto.id = animal.ong.getId();
        ongDto.nome = animal.ong.getNome();
        ongDto.telefone = animal.ong.getTelefone();
        ongDto.endereco = animal.ong.getEndereco();
        dto.ong = ongDto;

        return dto;
    }
}