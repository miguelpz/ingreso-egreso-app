import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router) {}
 
   

  ngOnInit(): void {
     this.loginForm = this.fb.group({
      correo:   ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  loginUsuario(){
    this.authService.showLoading();
    if (this.loginForm.invalid) return;
    const { correo, password} = this.loginForm.value;
    this.authService.loginUsuario(correo,password)
      .then(credenciales =>{
        console.log(credenciales);
        Swal.close();
        this.router.navigate(['/']);
      }).catch(err =>{
        let a = Swal.fire({
          icon: "error",
          title: "Oops...",
          text: err.message,
        });      
      });
  }


  

}
