import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Ng2IzitoastService } from "ng2-izitoast";
import { AuthenticationService } from "src/app/_services/authentication.service";
import { TokenStorageService } from "src/app/_services/token-storage.service";
import { UserService } from "src/app/_services/user.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  registerForm: FormGroup;
  submitted = false;
  loading = false;
  error = false;
  RememberMe = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private tokenStorage: TokenStorageService,
    private userService: UserService,
    public iziToast: Ng2IzitoastService
  ) {}

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      email: [
        "",
        [
          Validators.required,
          Validators.email,
          Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"),
        ],
      ],
      password: ["", [Validators.required]],
    });
  }

  get f() {
    return this.registerForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    // Vérifiez si le formulaire est invalide
    if (this.registerForm.invalid) {
      this.showError("Veuillez remplir correctement tous les champs.");
      return;
    }

    this.loading = true;

    // Appelez le service d'authentification
    this.authenticationService.loginUser(this.registerForm.value).subscribe(
      (response) => {
        if (!response || !response.user || !response.token) {
          this.showError("Réponse inattendue du serveur.");
          this.loading = false;
          return;
        }

        const { user, token } = response;

        // Sauvegarder les données utilisateur et le token
        this.tokenStorage.saveToken(token);
        this.tokenStorage.saveUser(user);

        // Redirigez en fonction du rôle
        const role = user.role?.type;
        if (role === "utilisateur") {
          this.router.navigate(["/home"]);
        } else {
          this.showError("Vous n'êtes pas autorisé à accéder à cette page.");
        }

        this.loading = false;
      },
      (error) => {
        this.loading = false;
        this.error = true;

        const errorMessage =
          error.error?.message ||
          "Une erreur s'est produite. Veuillez réessayer.";
        this.showError(errorMessage);
      }
    );
  }

  onReset() {
    this.submitted = false;
    this.registerForm.reset();
  }

  private showError(message: string) {
    this.iziToast.show({
      message,
      messageColor: "#800f2f",
      titleColor: "#800f2f",
      progressBarColor: "#c9184a",
      icon: "bi-exclamation-diamond",
      imageWidth: 45,
      position: "topRight",
      timeout: 5000,
      backgroundColor: "#ff8fa3",
      transitionIn: "flipInX",
      transitionOut: "flipOutX",
      overlayClose: true,
    });
  }
}
