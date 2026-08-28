package com.lar.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lar.dtos.AnimalResponseDTO;
import com.lar.dtos.CadastroAnimalDTO;
import com.lar.services.AnimalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/animais")
public class AnimalController {

    @Autowired
    private AnimalService animalService;

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<AnimalResponseDTO> cadastrar(@RequestPart("dados") String dadosJson,
                                                         @RequestPart(value = "foto", required = false) MultipartFile foto,
                                                         Authentication authentication) throws Exception {

        CadastroAnimalDTO dto = new ObjectMapper().readValue(dadosJson, CadastroAnimalDTO.class);
        AnimalResponseDTO animal = animalService.cadastrar(dto, foto, authentication.getName());
        return ResponseEntity.ok(animal);
    }

   
}