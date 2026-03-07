import { CommonModule } from '@angular/common';
import { Component, ElementRef, signal, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';

interface UploadedFile {
    id: string;
    name: string;
    size: number;
    preview: string | null;
    status: 'Pending' | 'Uploading' | 'Completed' | 'Error';
    uploadedAt: Date;
}

@Component({
    selector: 'fileupload',
    template: `
        <div class="flex flex-col gap-6">
            <!-- Header Section -->
            <div class="flex items-center gap-3 justify-between">
                <button
                    class="!border-blue-500 !bg-blue-500 hover:!bg-blue-600"
                    (click)="fileInput.click()"
                    pButton
                    type="button"
                    icon="pi pi-plus"
                    label="Choose"
                ></button>
                @if (files().length !== 0) {
                    <button
                        (click)="clearAll()"
                        pButton
                        type="button"
                        label="Clear All"
                        severity="secondary"
                    ></button>
                }
                <input
                    #fileInput
                    (change)="onFileSelected($event)"
                    type="file"
                    hidden
                    multiple
                    accept="image/*"
                />
            </div>

            <!-- Validation Error Message -->
            @if (validationError()) {
                <div class="text-sm font-medium text-red-500">
                    {{ validationError() }}
                </div>
            }

            <!-- Files List Section -->
            @if (files().length > 0) {
                <div class="flex flex-col gap-3">
                    <div
                        class="flex items-center gap-4 rounded-lg border border-gray-200 p-4 transition-shadow hover:shadow-sm"
                        *ngFor="let file of files()"
                    >
                        <!-- File Preview Thumbnail -->
                        <div class="h-16 w-16 flex-shrink-0 overflow-hidden rounded bg-gray-100">
                            <img
                                class="h-full w-full object-cover"
                                *ngIf="file.preview"
                                [src]="file.preview"
                                [alt]="file.name"
                            />
                            <div
                                class="flex h-full w-full items-center justify-center text-gray-400"
                                *ngIf="!file.preview"
                            >
                                <i class="pi pi-image text-2xl"></i>
                            </div>
                        </div>

                        <!-- File Information -->
                        <div class="min-w-0 flex-1">
                            <p class="truncate text-sm font-medium text-gray-900">{{ file.name }}</p>
                            <p class="mt-1 text-xs text-gray-500">{{ formatFileSize(file.size) }}</p>
                        </div>

                        <!-- Status Badge -->
                        <span
                            class="rounded px-3 py-1 text-xs font-medium whitespace-nowrap"
                            [ngClass]="getStatusClass(file.status)"
                        >
                            {{ file.status }}
                        </span>

                        <!-- Delete Button -->
                        <button
                            class="flex-shrink-0 text-red-500 transition-colors hover:text-red-700"
                            (click)="removeFile(file.id)"
                            type="button"
                            title="Delete file"
                        >
                            <i class="pi pi-times text-lg"></i>
                        </button>
                    </div>
                </div>
            } @else {
                <div class="py-8 text-center text-gray-500">
                    <i class="pi pi-inbox mb-3 block text-4xl opacity-50"></i>
                    <p class="text-sm">No files selected. Click Choose to upload images.</p>
                </div>
            }
        </div>
    `,
    standalone: true,
    imports: [CommonModule, ButtonModule],
    providers: []
})
export class FileuploadTemplateDemo {
    @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

    files = signal<UploadedFile[]>([]);
    validationError = signal<string | null>(null);
    isProcessing = signal(false);

    readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
    readonly MAX_FILES = 10;
    readonly ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        const selectedFiles = Array.from(input.files || []);

        // Clear previous error
        this.validationError.set(null);

        // Validate total count
        const totalFiles = this.files().length + selectedFiles.length;
        if (totalFiles > this.MAX_FILES) {
            this.validationError.set(
                `Cannot add ${selectedFiles.length} file(s). Maximum ${this.MAX_FILES} files allowed. Currently have ${this.files().length}.`
            );
            this.resetFileInput();
            return;
        }

        // Process and validate each file
        const newFiles: UploadedFile[] = [];
        let hasError = false;

        selectedFiles.forEach((file) => {
            // Validate file type
            if (!this.ALLOWED_TYPES.includes(file.type)) {
                this.validationError.set(
                    `"${file.name}" is not a supported image format. Please upload JPG, PNG, GIF, or WebP files.`
                );
                hasError = true;
                return;
            }

            // Validate file size
            if (file.size > this.MAX_FILE_SIZE) {
                this.validationError.set(
                    `"${file.name}" exceeds 10 MB limit. File size: ${this.formatFileSize(file.size)}`
                );
                hasError = true;
                return;
            }

            // Generate preview
            const reader = new FileReader();
            reader.onload = (e) => {
                const uploadedFile: UploadedFile = {
                    id: `${Date.now()}-${Math.random()}`,
                    name: file.name,
                    size: file.size,
                    preview: e.target?.result as string,
                    status: 'Pending',
                    uploadedAt: new Date()
                };
                const currentFiles = this.files();
                this.files.set([...currentFiles, uploadedFile]);
            };
            reader.onerror = () => {
                this.validationError.set(`Failed to read file "${file.name}"`);
            };
            reader.readAsDataURL(file);
        });

        if (hasError) {
            this.resetFileInput();
        }
    }

    removeFile(fileId: string): void {
        this.files.update((currentFiles) => currentFiles.filter((f) => f.id !== fileId));
        this.validationError.set(null);
    }

    clearAll(): void {
        this.files.set([]);
        this.validationError.set(null);
        this.resetFileInput();
    }

    formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
    }

    getStatusClass(status: string): string {
        switch (status) {
            case 'Pending':
                return 'bg-orange-100 text-orange-800';
            case 'Uploading':
                return 'bg-blue-100 text-blue-800';
            case 'Completed':
                return 'bg-green-100 text-green-800';
            case 'Error':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    }

    private resetFileInput(): void {
        if (this.fileInput) {
            this.fileInput.nativeElement.value = '';
        }
    }
}
