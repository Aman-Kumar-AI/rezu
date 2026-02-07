import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import emailjs from '@emailjs/browser';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {

  contactForm: FormGroup;
  isSubmitting = false;
  showSuccess = false;
  showError = false;

  messageSent= ""
  info="Thank you for reaching out. I’ll get back to you soon."


  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],
      message: [
        '',
        [
          Validators.required,
          this.minWordsValidator(10)
        ]
      ]
    });
  }

  /* ---------- VALIDATORS ---------- */

  minWordsValidator(minWords: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const words = control.value
        .trim()
        .split(/\s+/)
        .filter(Boolean);

      return words.length >= minWords
        ? null
        : { minWords: true };
    };
  }

  /* ---------- HELPERS ---------- */

  isInvalid(controlName: string): boolean {
    const control = this.contactForm.get(controlName);
    return !!(control && control.touched && control.invalid);
  }

  get emailError(): 'required' | 'invalid' | null {
    const control = this.contactForm.get('email');
    if (!control || !control.touched) return null;

    if (control.hasError('required')) return 'required';
    if (control.hasError('email')) return 'invalid';
    return null;
  }

  get messageError(): 'required' | 'minWords' | null {
    const control = this.contactForm.get('message');
    if (!control || !control.touched) return null;

    if (control.hasError('required')) return 'required';
    if (control.hasError('minWords')) return 'minWords';
    return null;
  }

  /* ---------- SUBMIT ---------- */

  onSubmit(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    emailjs.send(
      'service_y0q9nwr',
      'template_tu0fn7k',
      {
        name: this.contactForm.value.name,
        email: this.contactForm.value.email,
        message: this.contactForm.value.message,
      },
      'WG3ucUQdB8_YfyJ6'
    ).then(
      () => {
        this.contactForm.reset();
        this.isSubmitting = false;
        this.showSuccess = true;
        this.isSubmitting = false;
        this.contactForm.reset();

        setTimeout(() => {
          this.showSuccess = false;
}, 2500);

      },
      (error) => {
        console.error('EmailJS Error:', error);
        this.isSubmitting = false;
this.showError = true;

setTimeout(() => {
  this.showError = false;
}, 3000);

      }
    );
  }
}
