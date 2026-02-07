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

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.maxLength(100),
          this.maxWordsValidator(3)
        ]
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.maxLength(150)
        ]
      ],
      message: [
        '',
        [
          Validators.required,
          Validators.maxLength(500),
          this.minWordsValidator(10)
        ]
      ],
      company: [''] // honeypot
    });
  }

  /* ---------------- CUSTOM VALIDATORS ---------------- */

  maxWordsValidator(maxWords: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const words = control.value
        .trim()
        .split(/\s+/)
        .filter(Boolean);

      return words.length <= maxWords
        ? null
        : { maxWords: true };
    };
  }

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

  /* ---------------- ERROR HELPERS ---------------- */

  isInvalid(controlName: string): boolean {
    const control = this.contactForm.get(controlName);
    return !!(control && control.touched && control.invalid);
  }

  get nameError(): 'required' | 'maxLength' | 'maxWords' | null {
    const c = this.contactForm.get('name');
    if (!c || !c.touched) return null;

    if (c.hasError('required')) return 'required';
    if (c.hasError('maxlength')) return 'maxLength';
    if (c.hasError('maxWords')) return 'maxWords';
    return null;
  }

  get emailError(): 'required' | 'invalid' | 'maxLength' | null {
    const c = this.contactForm.get('email');
    if (!c || !c.touched) return null;

    if (c.hasError('required')) return 'required';
    if (c.hasError('email')) return 'invalid';
    if (c.hasError('maxlength')) return 'maxLength';
    return null;
  }

  get messageError(): 'required' | 'minWords' | 'maxLength' | null {
    const c = this.contactForm.get('message');
    if (!c || !c.touched) return null;

    if (c.hasError('required')) return 'required';
    if (c.hasError('minWords')) return 'minWords';
    if (c.hasError('maxlength')) return 'maxLength';
    return null;
  }

  /* ---------------- SUBMIT ---------------- */

  onSubmit(): void {
    if (this.contactForm.invalid || this.isSubmitting) {
      this.contactForm.markAllAsTouched();
      return;
    }

    // Honeypot protection
    if (this.contactForm.value.company) return;

    this.isSubmitting = true;

    emailjs.send(
      'service_y0q9nwr',
      'template_tu0fn7k',
      {
        name: this.contactForm.value.name,
        email: this.contactForm.value.email,
        message: this.contactForm.value.message,
      },
      'WG3ucUQdB8_YfyJ6w'
    ).then(
      () => {
        this.isSubmitting = false;
        this.showSuccess = true;
        this.contactForm.reset();

        setTimeout(() => (this.showSuccess = false), 2500);
      },
      () => {
        this.isSubmitting = false;
        this.showError = true;

        setTimeout(() => (this.showError = false), 3000);
      }
    );
  }
}
