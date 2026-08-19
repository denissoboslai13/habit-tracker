import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        loadComponent: () => {
            return import('./home/home').then(m => m.Home);
        }
    },
    {
        path: 'habits',
        pathMatch: 'full',
        loadComponent: () => {
            return import('./habits/habits').then(m => m.Habits);
        }
    },
    {
        path: 'credentials',
        pathMatch: 'full',
        loadComponent: () => {
            return import('./credentials/credentials').then(m => m.Credentials);
        }
    },
];
