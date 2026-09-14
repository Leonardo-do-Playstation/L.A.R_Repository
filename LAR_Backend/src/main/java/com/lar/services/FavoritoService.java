package com.lar.services;

import com.lar.dtos.FavoritoResponseDTO;
import com.lar.entities.Adotante;
import com.lar.entities.Animal;
import com.lar.entities.Favorito;
import com.lar.exceptions.RecursoNaoEncontradoException;
import com.lar.exceptions.RegraDeNegocioException;
import com.lar.repositories.AdotanteRepository;
import com.lar.repositories.AnimalRepository;
import com.lar.repositories.FavoritoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FavoritoService {

    @Autowired
    private FavoritoRepository favoritoRepository;

    @Autowired
    private AdotanteRepository adotanteRepository;

    @Autowired
    private AnimalRepository animalRepository;

    @Autowired
    private AnimalService animalService;

    public void favoritar(Long idAnimal, String emailAdotante) {
        Adotante adotante = buscarAdotante(emailAdotante);
        Animal animal = buscarAnimal(idAnimal);

        if (favoritoRepository.existsByAdotanteIdAndAnimalId(adotante.getId(), idAnimal)) {
            throw new RegraDeNegocioException("Este animal já está nos seus favoritos.");
        }

        favoritoRepository.save(new Favorito(adotante, animal));
    }

    public void desfavoritar(Long idAnimal, String emailAdotante) {
        Adotante adotante = buscarAdotante(emailAdotante);

        Favorito favorito = favoritoRepository.findByAdotanteIdAndAnimalId(adotante.getId(), idAnimal)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Este animal não está nos seus favoritos."));

        favoritoRepository.delete(favorito);
    }

    public List<FavoritoResponseDTO> listarMeusFavoritos(String emailAdotante) {
        Adotante adotante = buscarAdotante(emailAdotante);

        return favoritoRepository.findByAdotanteIdOrderByDataFavoritadoDesc(adotante.getId())
                .stream()
                .map(fav -> {
                    FavoritoResponseDTO dto = new FavoritoResponseDTO();
                    dto.animal = animalService.paraDetalhesDTO(fav.animal);
                    dto.dataFavoritado = fav.dataFavoritado;
                    return dto;
                })
                .collect(Collectors.toList());
    }

    private Adotante buscarAdotante(String email) {
        return adotanteRepository.findByEmail(email)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Adotante autenticado não encontrado."));
    }

    private Animal buscarAnimal(Long idAnimal) {
        return animalRepository.findById(idAnimal)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Animal não encontrado."));
    }
}