package com.lar.services;

import com.lar.dtos.AnimalResponseDTO;
import com.lar.dtos.CadastroAnimalDTO;
import com.lar.entities.Animal;
import com.lar.entities.Ong;
import com.lar.enums.StatusAnimal;
import com.lar.repositories.AnimalRepository;
import com.lar.repositories.OngRepository;
import com.lar.storage.StorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class AnimalService {

    @Autowired
    private AnimalRepository animalRepository;

    @Autowired
    private OngRepository ongRepository;

    @Autowired
    private StorageService storageService;

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

    public AnimalResponseDTO editar(Long idAnimal, CadastroAnimalDTO dto, MultipartFile foto, String emailOngAutenticada) {

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
            animal.foto = storageService.upload(foto);
        }

        Animal salvo = animalRepository.save(animal);
        return toResponseDTO(salvo);
    }

    public void excluir(Long idAnimal, String emailOngAutenticada) {
        Animal animal = buscarAnimalDaOng(idAnimal, emailOngAutenticada);
        animalRepository.delete(animal);
    }

    private Ong buscarOngAutenticada(String email) {
        return ongRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("ONG autenticada não encontrada."));
    }

    private Animal buscarAnimalDaOng(Long idAnimal, String emailOngAutenticada) {
        Animal animal = animalRepository.findById(idAnimal)
                .orElseThrow(() -> new RuntimeException("Animal não encontrado."));

        Ong ongAutenticada = buscarOngAutenticada(emailOngAutenticada);

        if (!animal.ong.getId().equals(ongAutenticada.getId())) {
            throw new RuntimeException("Você não tem permissão para alterar animais de outra ONG.");
        }

        return animal;
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
}