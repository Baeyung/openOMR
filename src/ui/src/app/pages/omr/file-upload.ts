import { Component, inject } from '@angular/core';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { PrimeNG } from 'primeng/config';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'fileupload',
    template: `
        
    `,
    standalone: true,
    imports: [
        BadgeModule,
        ButtonModule,
        FileUploadModule,
        ProgressBarModule,
        ToastModule,
    ],
    providers: [MessageService],
})
export class FileuploadTemplateDemo {
    
}
