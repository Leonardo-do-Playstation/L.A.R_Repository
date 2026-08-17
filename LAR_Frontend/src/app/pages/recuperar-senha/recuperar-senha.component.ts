import { Component } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-recuperar-senha',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './recuperar-senha.component.html',
  styleUrl: './recuperar-senha.component.css'
})
export class RecuperarSenhaComponent {

  recuperarForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]]
  });

  constructor(
    private formBuilder: FormBuilder
  ) {}

  recuperarSenha(): void {
    if (this.recuperarForm.invalid) {
      this.recuperarForm.markAllAsTouched();
      return;
    }

    console.log(this.recuperarForm.value);
  }
}