import { Routes } from '@angular/router';
import { OMRComponent } from './components/omr/omr.component';

export const routes: Routes = [
    {
        path: 'omr',
        component: OMRComponent
    },
    {
        pathMatch: 'full',
        redirectTo: 'omr'
    }
];
