import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import {
  AnimalService,
  CadastroAnimal,
  coresPadrao,
  racasPorEspecie,
} from '../../services/animal.service';
import { BotaoVoltarComponent } from '../../components/botao-voltar/botao-voltar.component';

@Component({
  selector: 'app-cadastro-animal',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, BotaoVoltarComponent],
  templateUrl: './cadastro-animal.component.html',
  styleUrl: './cadastro-animal.component.css',
})
export class CadastroAnimalComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly animalService = inject(AnimalService);
  private readonly router = inject(Router);

  cadastroForm = this.formBuilder.group({
    nome: ['', Validators.required],
    especie: ['', Validators.required],
    raca: ['', Validators.required],
    idade: ['', [Validators.required, Validators.min(0)]],
    porte: ['', Validators.required],
    cor: [''],
    sexo: ['', Validators.required],
    descricao: [''],
  });

  fotoSelecionada: File | null = null;
  fotoPreview: string | null = null;

  erroFoto = '';
  erroCadastro = '';
  carregando = false;

  private readonly tamanhoMaximoFoto = 5 * 1024 * 1024;

  readonly coresSugeridas = coresPadrao();

  get racasSugeridas(): string[] {
    return racasPorEspecie(this.cadastroForm.controls.especie.value);
  }

  selecionarFoto(event: Event): void {
    const input = event.target as HTMLInputElement;

    this.erroFoto = '';

    if (!input.files || input.files.length === 0) {
      this.fotoSelecionada = null;
      this.fotoPreview = null;
      return;
    }

    const arquivo = input.files[0];

    if (!arquivo.type.startsWith('image/')) {
      this.fotoSelecionada = null;
      this.fotoPreview = null;
      this.erroFoto = 'Selecione um arquivo de imagem válido.';
      input.value = '';
      return;
    }

    if (arquivo.size > this.tamanhoMaximoFoto) {
      this.fotoSelecionada = null;
      this.fotoPreview = null;
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

  cadastrarAnimal(): void {
    this.erroCadastro = '';

    if (this.cadastroForm.invalid || !this.fotoSelecionada) {
      this.cadastroForm.markAllAsTouched();

      if (!this.fotoSelecionada && !this.erroFoto) {
        this.erroFoto = 'Selecione uma foto para o animal.';
      }

      return;
    }

    this.carregando = true;

    const valor = this.cadastroForm.getRawValue();

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

    this.animalService.cadastrarAnimal(dados, this.fotoSelecionada).subscribe({
      next: () => {
        this.carregando = false;
        this.router.navigate(['/painel-animais']);
      },

      error: (erro: HttpErrorResponse) => {
        this.carregando = false;

        const mensagemBackend = erro.error?.mensagem;

        if (erro.status === 400 || erro.status === 413) {
          this.erroCadastro =
            mensagemBackend ||
            'Não foi possível cadastrar o animal. Verifique os dados informados.';
        } else if (erro.status === 401) {
          this.erroCadastro = 'Sua sessão expirou. Faça login novamente.';
        } else if (erro.status === 403) {
          this.erroCadastro =
            'Você não possui permissão para cadastrar animais.';
        } else {
          this.erroCadastro =
            mensagemBackend ||
            'Ocorreu um erro ao cadastrar o animal. Tente novamente.';
        }
      },
    });
  }
}
