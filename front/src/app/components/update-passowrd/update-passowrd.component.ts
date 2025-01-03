import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Ng2IzitoastService } from 'ng2-izitoast';
import { MustMatch } from 'src/app/_helpers/must-match.validator';
import { ForgetPassowrdService } from 'src/app/_services/forget-passowrd.service';
import { TokenStorageService } from 'src/app/_services/token-storage.service';

@Component({
  selector: 'app-update-passowrd',
  templateUrl: './update-passowrd.component.html',
  styleUrls: ['./update-passowrd.component.css']
})
export class UpdatePassowrdComponent implements OnInit {

  registerForm: FormGroup;
  registerFormCode: FormGroup;
  code =""
  submitted = false;
  submittedVerifCode = false
  loading = false;
  error :boolean = false;
  eroorMessage :string;
  closeResult: string;
  idPath: string[];
  ids: string;
  verifCode = false

  constructor(private formBuilder: FormBuilder,
    private router :Router,private forgetPassword :ForgetPassowrdService,
    public iziToast: Ng2IzitoastService,

  
    ) { }

  ngOnInit() {
    this.idPath=this.router.url.split('/');
    this.ids=this.idPath[2]
    this.registerFormCode = this.formBuilder.group({
          
         
      code: ['', [Validators.required ,]],
    }, 
    );
      this.registerForm = this.formBuilder.group({
          
         
        newpassword: ['', [Validators.required , Validators.pattern('((?=)(?=.*[a-z])(?=.*[A-Z]).{8,})'),]],
        confirmpassword: ['', [Validators.required , Validators.pattern('((?=)(?=.*[a-z])(?=.*[A-Z]).{8,})'),]],
      }, 
      {
        validator: MustMatch('newpassword', 'confirmpassword')
    });
  }
  get f() { return this.registerForm.controls; }
  get f2() { return this.registerFormCode.controls; }

  onSubmit() {
    let role; 
      this.submitted = true;
      if (this.registerForm.invalid) {
          return;
      }
      const user = {
        newPassword: this.registerForm.value.newpassword,
        confirmPassword: this.registerForm.value.confirmpassword,
      };
      
      this.forgetPassword.updatePassword(this.ids, user).subscribe(
        (data) => {
          console.log('Réponse du backend :', data);
          this.iziToast.show({
            message: 'Nouveau mot de passe défini avec succès.',
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
          console.error('Erreur interceptée :', error);
          this.loading = false;
          this.error = true;
          this.eroorMessage = error.error?.message || 'Une erreur est survenue.';
          this.iziToast.show({
            message: this.eroorMessage,
            messageColor: '#800f2f',
            titleColor: '#800f2f',
            progressBarColor: '#c9184a',
            icon: 'bi-exclamation-diamond',
            imageWidth: 45,
            position: 'topRight',
            timeout: 5000,
            backgroundColor: '#ff8fa3',
            transitionIn: 'flipInX',
            transitionOut: 'flipOutX',
          });
        }
      );
  }
go()
{
  this.registerForm.reset();
}
  onReset() {
      this.submitted = false;
      this.registerForm.reset();
  }    

  checkCode()
  {    this.submittedVerifCode = true;
        // stop here if form is invalid
        if (this.registerFormCode.invalid) {
            return;
        }
        this.forgetPassword.verifCodeSended(this.ids, this.registerFormCode.value).subscribe(
          (response) => {
              console.log('Réponse du backend :', response);
              if (response['message'] === 'Code vérifié avec succès') {
                  this.verifCode = true; // Passe à l'étape suivante
                  this.iziToast.show({
                      message: 'Code vérifié avec succès !',
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
              }
          },
          (error) => {
              console.error('Erreur interceptée :', error);
              this.iziToast.show({
                  message: error.error.message || 'Une erreur est survenue.',
                  messageColor: '#800f2f',
                  titleColor: '#800f2f',
                  progressBarColor: '#c9184a',
                  icon: 'bi-exclamation-diamond',
                  imageWidth: 45,
                  position: 'topRight',
                  timeout: 5000,
                  backgroundColor: '#ff8fa3',
                  transitionIn: 'flipInX',
                  transitionOut: 'flipOutX',
              });
          }
      );
      

         
      
    }
  

}
