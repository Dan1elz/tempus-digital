import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SidebarLayoutComponent } from './shared/layouts/sidebar-layout/sidebar-layout.component';
import { isUserLoggedGuard } from './core/guards/is-user-logged.guard';
import { RelatoriosComponent } from './pages/relatorios/relatorios.component';
import { ClientTableComponent } from './pages/clientes/client-table/client-table.component';
import { ClientFormsComponent } from './pages/clientes/client-forms/client-forms.component';
import { UserTableComponent } from './pages/usuarios/user-table/user-table.component';
import { UserFormsComponent } from './pages/usuarios/user-forms/user-forms.component';
import { ConfiguracoesComponent } from './pages/configuracoes/configuracoes.component';

export const routes: Routes = [
  { path: '', redirectTo: '/auth', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },

  {
    path: 'auth',
    component: SidebarLayoutComponent,
    canActivate: [isUserLoggedGuard],
    children: [
      { path: '', redirectTo: '/auth/relatorios', pathMatch: 'full' },
      { path: 'relatorios', component: RelatoriosComponent },
      { path: 'clientes', component: ClientTableComponent },
      { path: 'clientes/item', component: ClientFormsComponent },
      { path: 'clientes/item/:id', component: ClientFormsComponent },
      { path: 'usuarios', component: UserTableComponent },
      { path: 'usuarios/item', component: UserFormsComponent },
      { path: 'usuarios/item/:id', component: UserFormsComponent },
      { path: 'configuracoes', component: ConfiguracoesComponent },
    ],
  },
];
