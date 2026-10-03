package com.lar.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import com.fasterxml.jackson.databind.ObjectMapper;

import com.lar.dtos.AlterarStatusAnimalDTO;
import com.lar.dtos.AnimalResponseDTO;
import com.lar.dtos.CadastroAnimalDTO;
import com.lar.services.AnimalService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Tag(name = "Animais da ONG", description = "CRUD e alteração de status dos animais pertencentes à ONG autenticada.")
@RestController
@RequestMapping("/ong/animais")
public class OngAnimalController {

        @Autowired
        private AnimalService animalService;

        @Operation(summary = "Lista os animais da ONG autenticada", description = "Retorna somente os animais pertencentes à ONG autenticada.")
        @GetMapping
        public ResponseEntity<List<AnimalResponseDTO>> listarMeusAnimais(Authentication authentication) {

                return ResponseEntity.ok(
                                animalService.listarMeusAnimais(
                                                authentication.getName()));
        }

        @Operation(summary = "Cadastra um animal", description = "Cadastra um animal para a ONG autenticada, recebendo dados em JSON e foto opcional.")
        @PostMapping(consumes = "multipart/form-data")
        public ResponseEntity<AnimalResponseDTO> cadastrar(
                        @RequestPart("dados") String dadosJson,
                        @RequestPart(value = "foto", required = false) MultipartFile foto,
                        Authentication authentication) throws Exception {

                CadastroAnimalDTO dto = new ObjectMapper().readValue(
                                dadosJson,
                                CadastroAnimalDTO.class);

                AnimalResponseDTO animal = animalService.cadastrar(
                                dto,
                                foto,
                                authentication.getName());

                return ResponseEntity.ok(animal);
        }

        @Operation(summary = "Edita um animal", description = "Atualiza os dados e, opcionalmente, a foto do animal pertencente à ONG autenticada.")
        @PutMapping(value = "/{id}", consumes = "multipart/form-data")
        public ResponseEntity<AnimalResponseDTO> editar(
                        @PathVariable Long id,
                        @RequestPart("dados") String dadosJson,
                        @RequestPart(value = "foto", required = false) MultipartFile foto,
                        Authentication authentication) throws Exception {

                CadastroAnimalDTO dto = new ObjectMapper().readValue(
                                dadosJson,
                                CadastroAnimalDTO.class);

                AnimalResponseDTO animal = animalService.editar(
                                id,
                                dto,
                                foto,
                                authentication.getName());

                return ResponseEntity.ok(animal);
        }

        @Operation(summary = "Altera o status de um animal", description = "Atualiza o status do animal pertencente à ONG autenticada.")
        @PatchMapping("/{id}/status")
        public ResponseEntity<AnimalResponseDTO> alterarStatus(
                        @PathVariable Long id,
                        @Valid @RequestBody AlterarStatusAnimalDTO dto,
                        Authentication authentication) {

                AnimalResponseDTO animal = animalService.alterarStatus(
                                id,
                                dto,
                                authentication.getName());

                return ResponseEntity.ok(animal);
        }

        @Operation(summary = "Remove um animal", description = "Exclui o animal pertencente à ONG autenticada.")
        @DeleteMapping("/{id}")
        public ResponseEntity<Void> excluir(
                        @PathVariable Long id,
                        Authentication authentication) {

                animalService.excluir(
                                id,
                                authentication.getName());

                return ResponseEntity.noContent().build();
        }
}