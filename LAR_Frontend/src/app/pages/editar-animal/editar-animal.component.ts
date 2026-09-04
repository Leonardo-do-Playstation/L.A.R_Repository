import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import {
  Animal,
  AnimalService,
  CadastroAnimal,
} from '../../services/animal.service';

@Component({
  selector: 'app-editar-animal',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './editar-animal.component.html',
  styleUrl: './editar-animal.component.css',
})
export class EditarAnimalComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly animalService = inject(AnimalService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  editarForm = this.formBuilder.group({
    nome: ['', Validators.required],
    especie: ['', Validators.required],
    raca: ['', Validators.required],
    idade: ['', [Validators.required, Validators.min(1)]],
    porte: ['', Validators.required],
    cor: [''],
    sexo: ['', Validators.required],
    descricao: ['', Validators.required],
  });

  animalId!: number;

  fotoSelecionada: File | null = null;
  fotoPreview: string | null = null;

  erroFoto = '';
  erroEdicao = '';

  carregando = true;
  salvando = false;

  private readonly tamanhoMaximoFoto = 5 * 1024 * 1024;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.erroEdicao = 'Animal não encontrado.';
      this.carregando = false;
      return;
    }

    this.animalId = id;

    this.carregarAnimal();
  }

  carregarAnimal(): void {
    this.carregando = true;
    this.erroEdicao = '';

    this.animalService.listarMeusAnimais().subscribe({
      next: (animais) => {
        const animal = animais.find((item) => item.id === this.animalId);

        if (!animal) {
          this.erroEdicao = 'Animal não encontrado.';
          this.carregando = false;
          return;
        }

        this.preencherFormulario(animal);
        this.carregando = false;
      },

      error: (erro: HttpErrorResponse) => {
        this.carregando = false;

        if (erro.status === 401) {
          this.erroEdicao = 'Sua sessão expirou. Faça login novamente.';
        } else if (erro.status === 403) {
          this.erroEdicao =
            'Você não possui permissão para editar este animal.';
        } else {
          this.erroEdicao = 'Não foi possível carregar os dados do animal.';
        }
      },
    });
  }

  preencherFormulario(animal: Animal): void {
    this.editarForm.patchValue({
      nome: animal.nome,
      especie: animal.especie,
      raca: animal.raca,
      idade: String(animal.idade),
      porte: animal.porte,
      cor: animal.cor ?? '',
      sexo: animal.sexo,
      descricao: animal.descricao,
    });

    if (animal.foto) {
      this.fotoPreview = animal.foto;
    }
  }

  selecionarFoto(event: Event): void {
    const input = event.target as HTMLInputElement;

    this.erroFoto = '';

    if (!input.files || input.files.length === 0) {
      this.fotoSelecionada = null;
      return;
    }

    const arquivo = input.files[0];

    if (!arquivo.type.startsWith('image/')) {
      this.fotoSelecionada = null;
      this.erroFoto = 'Selecione um arquivo de imagem válido.';
      input.value = '';
      return;
    }

    if (arquivo.size > this.tamanhoMaximoFoto) {
      this.fotoSelecionada = null;
      this.erroFoto = 'A foto deve ter no máximo 5 MB.';
      input.value = '';
      return;
    }

    this.fotoSelecionada = arquivo;

    const reader = new FileReader();

    reader.onload = () => {
      this.fotoPreview = reader.result as string;
    };

    reader.readAsDataURL(arquivo);
  }

  editarAnimal(): void {
    this.erroEdicao = '';

    if (this.editarForm.invalid) {
      this.editarForm.markAllAsTouched();
      return;
    }

    this.salvando = true;

    const valor = this.editarForm.getRawValue();

    const dados: CadastroAnimal = {
      nome: valor.nome!.trim(),
      especie: valor.especie!,
      idade: Number(valor.idade),
      raca: valor.raca!.trim(),
      sexo: valor.sexo!,
      porte: valor.porte!,
      cor: valor.cor?.trim() ?? '',
      descricao: valor.descricao!.trim(),
    };

    this.animalService
      .editarAnimal(this.animalId, dados, this.fotoSelecionada)
      .subscribe({
        next: () => {
          this.salvando = false;
          this.router.navigate(['/painel-animais']);
        },

        error: (erro: HttpErrorResponse) => {
          this.salvando = false;

          if (erro.status === 400) {
            this.erroEdicao =
              'Não foi possível salvar as alterações. Verifique os dados informados.';
          } else if (erro.status === 401) {
            this.erroEdicao = 'Sua sessão expirou. Faça login novamente.';
          } else if (erro.status === 403) {
            this.erroEdicao =
              'Você não possui permissão para editar este animal.';
          } else if (erro.status === 404) {
            this.erroEdicao = 'Animal não encontrado.';
          } else {
            this.erroEdicao =
              'Ocorreu um erro ao salvar as alterações. Tente novamente.';
          }
        },
      });
  }
}
