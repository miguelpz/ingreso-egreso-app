import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'

import {Store} from '@ngrx/store';
import {AppState} from '../../app.reducer';
import * as ui from 'src/app/shared/ui.actions';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent  implements OnInit {
  registroForm!: FormGroup;
  cargando!: boolean;
  uiSubscription!: Subscription;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private store: Store<AppState>,
    private router: Router) {}

  ngOnInit(): void {
    this.registroForm = this.fb.group({
      nombre:   ['', Validators.required],
      correo:   ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.uiSubscription = this.store.select('ui').subscribe(ui =>{
      this.cargando = ui.isLoading;
    });


  }

  crearUsuario(){
    //this.authService.showLoading();
    if (this.registroForm.invalid) return;
    this.store.dispatch(ui.isLoading());
    const {nombre, correo, password} = this.registroForm.value;
    this.authService.crearUsuario(nombre,correo,password)
      .then(credenciales =>{
        console.log(credenciales);
        //Swal.close();
        this.store.dispatch(ui.stopLoading());
        this.router.navigate(['/']);
      }).catch(err =>{
        this.store.dispatch(ui.stopLoading());
        Swal.fire({        
          icon: "error",
          title: "Oops...",
          text: err.message,
        });
      });
  }
}
