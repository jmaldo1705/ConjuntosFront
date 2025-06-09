import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  contactForm: FormGroup;
  submitted = false;
  success = false;

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      visitorType: ['', [Validators.required]],
      message: ['', [Validators.required]]
    });
  }

  onSubmit() {
    this.submitted = true;

    if (this.contactForm.valid) {
      // Here you would typically send the form data to a backend service
      console.log('Form submitted:', this.contactForm.value);
      this.success = true;
      this.contactForm.reset();
      this.submitted = false;

      // Reset success message after 5 seconds
      setTimeout(() => {
        this.success = false;
      }, 5000);
    }
  }
}
