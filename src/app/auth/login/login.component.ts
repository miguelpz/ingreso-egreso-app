import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'

import {Store} from '@ngrx/store';
import {AppState} from '../../app.reducer';
import * as ui from 'src/app/shared/ui.actions';
import {Subscription} from 'rxjs';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  cargando!: boolean;
  uiSubscription!: Subscription;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private store: Store<AppState>,
    private router: Router) {}
 
   

  ngOnInit(): void {
     this.loginForm = this.fb.group({
      correo:   ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.uiSubscription = this.store.select('ui').subscribe(ui =>{
      this.cargando = ui.isLoading;
    });
  }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();   
  }

  loginUsuario(){
    //this.authService.showLoading();
    if (this.loginForm.invalid) return;
    this.store.dispatch(ui.isLoading());
    const { correo, password} = this.loginForm.value;
    this.authService.loginUsuario(correo,password)
      .then(credenciales =>{
        console.log(credenciales);
        //Swal.close();
        this.store.dispatch(ui.stopLoading());
        this.router.navigate(['/']);
      }).catch(err =>{
        this.store.dispatch(ui.stopLoading());
        let a = Swal.fire({
          icon: "error",
          title: "Oops...",
          text: err.message,
        });      
      });
  }


  

}
