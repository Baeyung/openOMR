import { Component } from "@angular/core";

@Component({
    template: `
        <div class="grid grid-cols-4 lg:grid-cols-12 gap-4">
            <div class="col-span-4 lg:col-span-6 xl:col-start-2 xl:col-span-5">
                <div class="card">
                    open ff works
                </div>
            </div>
            <div class="col-span-4 lg:col-span-6 xl:col-span-5">
                <div class="card">
                    open ff works
                </div>
            </div>
        </div>
    `
})
export class OMRComponent {}