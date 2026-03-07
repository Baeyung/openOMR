import { Component } from '@angular/core';
import { MetaData } from './metadata';
import { FileuploadTemplateDemo } from './file-upload';

@Component({
    template: `
        <div class="grid grid-cols-4 lg:grid-cols-12 gap-8">
            <div class="col-span-4 lg:col-span-6 xl:col-start-2 xl:col-span-5">
                <meta-data />
            </div>
            <div class="col-span-4 lg:col-span-6 xl:col-span-5">
                <div class="card h-[30rem]">
                    <fileupload />
                </div>
            </div>
        </div>
    `,
    imports: [MetaData, FileuploadTemplateDemo],
})
export class OMRComponent {}
