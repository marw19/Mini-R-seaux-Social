import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Ng2IzitoastService } from 'ng2-izitoast';
import { SearchCountryField, CountryISO } from 'ngx-intl-tel-input';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.css'],
})
export class InscriptionComponent implements OnInit {
  // Configuration de ngx-intl-tel-input
  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];

  // Formulaire
  registerForm: FormGroup;
  submitted = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private userService: UserService,
    public iziToast: Ng2IzitoastService
  ) {}

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, this.phoneValidator]], // Ajout de validation personnalisée
    });
  }

  // Validation personnalisée pour le champ téléphone
  phoneValidator(control: any): { [key: string]: boolean } | null {
    if (!control.value || !control.value.internationalNumber) {
      return { invalidPhone: true }; // Retourne une erreur si le numéro est invalide
    }
    return null; // Aucun problème
  }

  // Getter pour un accès facile aux champs du formulaire
  get f() {
    return this.registerForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
  
    if (this.registerForm.invalid) {
      return;
    }
  
    if (this.registerForm.value.phone) {
      this.registerForm.value.phone = this.registerForm.value.phone.internationalNumber;
    }
  
    this.userService.signUp(this.registerForm.value).subscribe(
      (data) => {
        this.iziToast.show({
          message: 'Utilisateurs ajouté avec succès',
          messageColor: '#386641',
          progressBarColor: '#6a994e',
          icon: 'bi-check-circle',
          imageWidth: 45,
          position: 'topRight',
          timeout: 5000,
          backgroundColor: '#dde5b6',
          transitionIn: 'flipInX',
          transitionOut: 'flipOutX',
        });
        this.router.navigate(['/connexion']);
      },
      (error) => {
        console.error('Erreur complète :', error);
  
        const errorMessage = error.error?.message || "Une erreur s'est produite lors de l'inscription.";
        this.iziToast.error({
          title: 'Erreur',
          message: errorMessage,
          position: 'topRight',
          backgroundColor: '#f8d7da',
          titleColor: '#842029',
          messageColor: '#842029',
          timeout: 5000,
        });
      }
    );
  }
  

}
