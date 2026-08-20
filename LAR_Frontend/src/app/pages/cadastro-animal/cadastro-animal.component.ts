import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cadastro-animal',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './cadastro-animal.component.html',
  styleUrl: './cadastro-animal.component.css'
})
export class CadastroAnimalComponent {

  cadastroForm = this.formBuilder.group({
    nome: ['', Validators.required],
    especie: ['', Validators.required],
    raca: ['', Validators.required],
    idade: ['', Validators.required],
    porte: ['', Validators.required],
    cor: [''],
    sexo: ['', Validators.required],
    descricao: ['', Validators.required]
  });

  fotoSelecionada: File | null = null;
  fotoPreview: string | null = null;

  constructor(private formBuilder: FormBuilder) {}

  selecionarFoto(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const arquivo = input.files[0];

    if (!arquivo.type.startsWith('image/')) {
      this.fotoSelecionada = null;
      this.fotoPreview = null;
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
    if (this.cadastroForm.invalid || !this.fotoSelecionada) {
      this.cadastroForm.markAllAsTouched();
      return;
    }

    console.log(this.cadastroForm.value);
    console.log(this.fotoSelecionada);
  }
}