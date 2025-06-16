import { Component, OnInit, inject } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule, NgClass } from '@angular/common';
import { UserService } from '../../core/services/user.service';
import { UpdatePasswordDto } from '../../core/interfaces/users-dtos.interface';
@Component({
  selector: 'app-configuracoes',
  imports: [FormsModule, NgClass, CommonModule],
  templateUrl: './configuracoes.component.html',
})
export class ConfiguracoesComponent implements OnInit {
  private userService = inject(UserService);
  private router = inject(Router);

  newPassword: string = '';
  confirmPassword: string = '';
  loading: boolean = false;

  userId: string = '';
  user = this.userService.readonlyUserInfo;
  ngOnInit(): void {
    this.userId = this.user()!.token.user.id;
  }

  onSubmit(): void {
    if (this.newPassword !== this.confirmPassword) {
      // alert('As senhas não coincidem.');
      return;
    }

    const dto: UpdatePasswordDto = {
      id: this.userId,
      password: this.newPassword,
    };

    this.loading = true;
    this.userService.onUpdatePassword(dto).subscribe({
      next: (res) => {
        console.log('Senha atualizada:', res);
        alert('Senha atualizada com sucesso.');
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao atualizar senha:', err);
        alert('Erro ao atualizar senha. Tente novamente.');
        this.loading = false;
      },
    });
  }
}
