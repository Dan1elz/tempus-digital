import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ClientService } from '../../../core/services/client.service';
import { RegisterClientDto } from '../../../core/interfaces/clients-dtos.interface';
import { CommonModule, NgClass } from '@angular/common';

@Component({
  selector: 'app-client-forms',
  imports: [FormsModule, RouterLink, NgClass, CommonModule],
  templateUrl: './client-forms.component.html',
})
export class ClientFormsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private clientService = inject(ClientService);

  client: RegisterClientDto = {
    id: '',
    nome: '',
    cpf: '',
    data_nascimento: '',
    renda_familiar: undefined,
  };

  isEditMode: boolean = false;
  loading: boolean = false;
  today: string = new Date().toISOString().split('T')[0];

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const clientId = params.get('id');
      if (clientId) {
        this.isEditMode = true;
        this.client.id = clientId;
        this.loadClientData(clientId);
      }
    });
  }

  loadClientData(id: string): void {
    this.loading = true;
    this.clientService.onGetById(id).subscribe({
      next: (data: any) => {
        this.client = data.data as RegisterClientDto;
        // Ajusta data_nascimento para o formato aceito pelo input type="date"
        if (this.client.data_nascimento) {
          this.client.data_nascimento =
            this.client.data_nascimento.split('T')[0];
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading client data:', err);
        this.loading = false;
      },
    });
  }

  onSubmit(): void {
    if (this.isEditMode) {
      this.updateClient();
    } else {
      this.createClient();
    }
  }

  createClient(): void {
    this.loading = true;
    const { id, ...clientToCreate } = this.client;
    this.clientService.onCreate(clientToCreate).subscribe({
      next: (res) => {
        console.log('Client created:', res);
        this.loading = false;
        this.router.navigate(['/auth/clientes']);
      },
      error: (err) => {
        console.error('Error creating client:', err);
        this.loading = false;
      },
    });
  }

  updateClient(): void {
    if (!this.client.id) {
      console.error('Cannot update client without an ID.');
      return;
    }
    this.loading = true;
    this.clientService.onUpdate(this.client).subscribe({
      next: (res) => {
        console.log('Client updated:', res);
        this.loading = false;
        this.router.navigate(['/auth/clientes']);
      },
      error: (err) => {
        console.error('Error updating client:', err);
        this.loading = false;
      },
    });
  }
  onCpfChange(event: any): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, ''); // Remove non-numeric characters
    if (value.length > 11) {
      value = value.slice(0, 11);
    }
    this.client.cpf = value;
    input.value = value;
    if (value.length === 11) {
      // Format CPF as XXX.XXX.XXX-XX
      if (
        !/^\d{11}$/.test(value) ||
        [
          '00000000000',
          '11111111111',
          '22222222222',
          '33333333333',
          '44444444444',
          '55555555555',
          '66666666666',
          '77777777777',
          '88888888888',
          '99999999999',
        ].includes(value)
      ) {
        alert('CPF inválido');
        return;
      }
      let sum = 0;
      for (let i = 0; i < 9; i++) {
        sum += parseInt(value.charAt(i)) * (10 - i);
      }
      let firstCheck = 11 - (sum % 11);
      if (firstCheck >= 10) firstCheck = 0;
      if (firstCheck !== parseInt(value.charAt(9))) {
        alert('CPF inválido');
        return;
      }
      sum = 0;
      for (let i = 0; i < 10; i++) {
        sum += parseInt(value.charAt(i)) * (11 - i);
      }
      let secondCheck = 11 - (sum % 11);
      if (secondCheck >= 10) secondCheck = 0;
      if (secondCheck !== parseInt(value.charAt(10))) {
        alert('CPF inválido');
        return;
      }
      input.value = value.replace(
        /(\d{3})(\d{3})(\d{3})(\d{2})/,
        '$1.$2.$3-$4'
      );
    }
  }
}
