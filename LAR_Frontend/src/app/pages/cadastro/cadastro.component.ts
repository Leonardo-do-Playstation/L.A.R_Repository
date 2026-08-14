import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.css'
})
export class CadastroComponent {

  tipo: 'adotante' | 'ong';

  cadastroForm;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.tipo = this.route.snapshot.data['tipo'] ?? 'adotante';

    if (this.tipo === 'ong') {
      this.cadastroForm = this.formBuilder.group({
        nomeInstituicao: ['', Validators.required],
        cnpj: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        senha: ['', [Validators.required, Validators.minLength(6)]],
        confirmarSenha: ['', Validators.required]
      });
    } else {
      this.cadastroForm = this.formBuilder.group({
        nome: ['', Validators.required],
        sobrenome: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        senha: ['', [Validators.required, Validators.minLength(6)]],
        confirmarSenha: ['', Validators.required]
      });
    }
  }

  cadastrar(): void {
    if (this.cadastroForm.invalid) {
      this.cadastroForm.markAllAsTouched();
      return;
    }

    console.log(this.cadastroForm.value);
  }
}