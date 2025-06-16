import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { LoginDto } from '../../core/interfaces/users-dtos.interface';

@Component({
  selector: 'app-login',
  imports: [FormsModule, NgClass],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private readonly service = inject(UserService);
  eye: boolean = false;
  typePassword: string = 'password';
  icon: string = 'bi bi-eye-slash';

  hasSuccess: boolean = false;
  hasError: boolean = false;
  message: string = '';

  actor: LoginDto = { email: 'admin@tempus.com.br', password: 'Tempus@2025' };

  onSubmit(Event: Event) {
    Event.preventDefault();

    this.service.onLogin(this.actor).subscribe({
      next: (response) => {
        this.message = 'Usuario logado com sucesso!';
        this.onOpenSuccess();
      },
      error: (error) => {
        this.message = `Erro ao logar usuário, verifique os dados!`;
        console.log(error.error.message);
        this.onOpenError();
      },
    });
  }

  onEyeToggle() {
    this.eye = !this.eye;
    if (this.eye) {
      this.typePassword = 'text';
      this.icon = 'bi bi-eye';
    } else {
      this.typePassword = 'password';
      this.icon = 'bi bi-eye-slash';
    }
  }

  onOpenError() {
    this.hasError = true;
    setTimeout(() => (this.hasError = false), 5000);
  }
  onOpenSuccess() {
    this.hasSuccess = true;
    setTimeout(() => (this.hasSuccess = false), 5000);
  }
  CloseAlert() {
    this.hasSuccess = false;
    this.hasError = false;
  }
}
