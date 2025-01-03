import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Ng2IzitoastService } from 'ng2-izitoast';
import { ForgetPassowrdService } from 'src/app/_services/forget-passowrd.service';
import { TokenStorageService } from 'src/app/_services/token-storage.service';

@Component({
  selector: 'app-reset-passowrd',
  templateUrl: './reset-passowrd.component.html',
  styleUrls: ['./reset-passowrd.component.css']
})
export class ResetPassowrdComponent implements OnInit {

  registerForm: FormGroup;
  submitted = false;
  loading = false;
  error :boolean = false;
  eroorMessage :string;
  closeResult: string;
  


  constructor(private formBuilder: FormBuilder,
    private router :Router,private forgetPassowrd :ForgetPassowrdService,
    private tokenStorage :TokenStorageService,
    public iziToast: Ng2IzitoastService,

  
    ) { }

  ngOnInit() {
      this.registerForm = this.formBuilder.group({
          
         
          email: ['', [Validators.required, Validators.email, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      }, {
      });
  }
  get f() { return this.registerForm.controls; }

  onSubmit() {
    let role; 
      this.submitted = true;
      if (this.registerForm.invalid) {
          return;
      }
      this.forgetPassowrd.sendMail(this.registerForm.value).subscribe(
        (data) => {
          this.iziToast.show({
            message:"Veuillez vérifier votre e-mail, un lien a été envoyé pour réinitialiser votre mot de passe.",
            messageColor:'#386641',
            progressBarColor:'#6a994e',
            icon:'bi-check-circle',
            imageWidth:45,
            position:'topRight',
            timeout:5000,
            backgroundColor:'#dde5b6',
            transitionIn: 'flipInX',
            transitionOut: 'flipOutX',
             });
           this.router.navigate(['/connexion'])
          // }
         
           
        },
        (error) => {
          this.loading = false;
          this.error=true
          this.eroorMessage=error.error
          this.iziToast.show({
            message:"Merci de bien vérifier vos informations.",
            messageColor:'#800f2f',
            titleColor:'#800f2f',
            progressBarColor:'#c9184a',
            icon:'bi-exclamation-diamond',	
            imageWidth:45,
            position:'topRight',
            timeout:5000,
            backgroundColor:'#ff8fa3',
            transitionIn: 'flipInX',
            transitionOut: 'flipOutX',
            //overlay:true,
            overlayClose:true,	
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

}
