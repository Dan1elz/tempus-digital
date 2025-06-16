import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule, NgClass } from '@angular/common';
import { UserService } from '../../core/services/user.service';
import { UpdatePasswordDto } from '../../core/interfaces/users-dtos.interface';
@Component({
  selector: 'app-configuracoes',
  imports: [FormsModule, NgClass, CommonModule],
  template: `
    <div
      class="bg-white dark:bg-gray-800 shadow rounded-xl p-6 max-w-2xl mx-auto"
    >
      <h2 class="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        Atualizar Senha
      </h2>

      <form
        #passwordForm="ngForm"
        (ngSubmit)="onSubmit()"
        [noValidate]="false"
        class="grid grid-cols-1 gap-6"
      >
        <!-- Nova Senha -->
        <div>
          <label
            for="newPassword"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >Nova Senha</label
          >
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            [(ngModel)]="newPassword"
            required
            minlength="6"
            class="form-input"
            placeholder="Digite sua nova senha"
            [ngClass]="{
              'border-red-500':
                passwordForm.submitted &&
                passwordForm.controls['newPassword'].invalid
            }"
          />
        </div>

        <!-- Confirmar Senha -->
        <div>
          <label
            for="confirmPassword"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >Confirmar Senha</label
          >
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            [(ngModel)]="confirmPassword"
            required
            class="form-input"
            placeholder="Confirme a nova senha"
            [ngClass]="{
              'border-red-500':
                passwordForm.submitted &&
                (passwordForm.controls['confirmPassword'].invalid ||
                  newPassword !== confirmPassword)
            }"
          />
        </div>

        <!-- Botão -->
        <div class="flex justify-end mt-6">
          <button
            type="submit"
            [disabled]="passwordForm.invalid || loading"
            class="btn-blue"
          >
            Atualizar Senha
          </button>
        </div>

        <!-- Mensagem de erro -->
        <div
          *ngIf="passwordForm.submitted && newPassword !== confirmPassword"
          class="text-red-500 text-sm"
        >
          As senhas não coincidem.
        </div>
      </form>
    </div>
  `,
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
