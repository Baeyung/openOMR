import { Component } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FormsModule } from '@angular/forms';
import { InputMaskModule } from 'primeng/inputmask';
import { DatePickerModule } from 'primeng/datepicker';
import { CommonModule } from '@angular/common';

export interface InfoMetaData {
    name: string;
    designation: string;
    phoneNumber: string;
    email: string;
    forMonth: string;
    todayDate: string;
}

@Component({
    selector: 'meta-data',
    template: `
        <div class="card flex flex-col items-start justify-center gap-6 h-[30rem]">
            <div class="flex gap-4 items-center">
                <span class="text-xl pi pi-user"></span>
                <div class="flex">
                    <span class="text-xl">Employee Information</span>
                    <span class="text-xl text-red-500">*</span>
                </div>
            </div>
            <p-floatlabel variant="on" class="w-full">
                <input
                    pInputText
                    id="name"
                    [(ngModel)]="metaData.name"
                    autocomplete="off"
                    class="w-full"
                    pSize="large"
                />
                <label for="name">Employee Name</label>
            </p-floatlabel>
            <p-floatlabel variant="on" class="w-full">
                <input
                    pInputText
                    id="designation"
                    [(ngModel)]="metaData.designation"
                    autocomplete="off"
                    class="w-full"
                    pSize="large"
                />
                <label for="designation">Designation</label>
            </p-floatlabel>
            <p-floatlabel variant="on" class="w-full">
                <input
                    pInputText
                    id="email"
                    [(ngModel)]="metaData.email"
                    autocomplete="off"
                    class="w-full"
                    pSize="large"
                />
                <label for="email">Email</label>
            </p-floatlabel>
            <p-floatlabel variant="on" class="w-full">
                <input
                    pInputText
                    pInputMask="99-999999"
                    class="w-full"
                    id="Phone Number"
                    pSize="large"
                    [(ngModel)]="metaData.phoneNumber"
                />
                <label for="Phone Number">Phone Number</label>
            </p-floatlabel>
            <p-floatlabel variant="on" class="w-full">
                <p-datepicker
                    [(ngModel)]="metaData.forMonth"
                    view="month"
                    dateFormat="mm"
                    [readonlyInput]="true"
                    fluid
                    id="forMonth"
                    size="large"
                />
                <label for="forMonth">For Month</label>
            </p-floatlabel>
        </div>
    `,
    imports: [
        CommonModule,
        InputTextModule,
        FormsModule,
        FloatLabelModule,
        InputMaskModule,
        DatePickerModule,
    ],
})
export class MetaData {
    metaData: InfoMetaData = {
        name: '',
        designation: '',
        phoneNumber: '',
        email: '',
        forMonth: '',
        todayDate: '',
    };
}
