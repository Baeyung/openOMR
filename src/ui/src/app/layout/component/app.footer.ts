import { Component } from '@angular/core';

@Component({
    standalone: true,
    selector: 'app-footer',
    template: `<div class="layout-footer">
        OpenFF by
        <a
            href="https://github.com/Baeyung/openOMR"
            target="_blank"
            rel="noopener noreferrer"
            class="text-primary font-bold hover:underline"
            >Baeyung</a
        >
    </div>`,
})
export class AppFooter {}
