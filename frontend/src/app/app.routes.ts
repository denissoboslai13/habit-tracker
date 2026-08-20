import { Routes } from '@angular/router';
import { authGuard } from './helpers/authGuard';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        loadComponent: () => {
            return import('./landing/landing').then(m => m.Landing);
        }
    },
    {
        path: 'register',
        pathMatch: 'full',
        loadComponent: () => {
            return import('./register/register').then(m => m.Register);
        }
    },
    {
        path: 'login',
        pathMatch: 'full',
        loadComponent: () => {
            return import('./login/login').then(m => m.Login);
        }
    },
    {
        path: 'habits',
        canActivate: [authGuard],
        pathMatch: 'full',
        loadComponent: () => {
            return import('./habits/habits').then(m => m.Habits);
        }
    },
    {
        path: 'habits/:id',
        pathMatch: 'full',
        loadComponent: () => {
            return import('./detail/detail').then(m => m.Detail);
        }
    },
];
