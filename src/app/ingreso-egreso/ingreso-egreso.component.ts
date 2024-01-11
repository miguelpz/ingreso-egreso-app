import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import {Store} from '@ngrx/store';
import Swal from 'sweetalert2';
import { AppState } from '../app.reducer';
import * as uiReduc from '../shared/ui.actions';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: [
  ]
})
export class IngresoEgresoComponent implements OnInit, OnDestroy{
  ingresoForm!: FormGroup;
  tipo: string = 'ingreso';
  cargando!:boolean; 
  uiSubscription!: Subscription;

  constructor(private fb: FormBuilder,
              private ingresoEgresoService: IngresoEgresoService,
              private store:Store<AppState>){}
  
  ngOnInit() {
    this.uiSubscription = this.store.select('ui').subscribe(ui =>{
      this.cargando = ui.isLoading;
    });

    this.ingresoForm = this.fb.group({
      descripcion: ['', Validators.required],
      monto: ['', Validators.required]
    });
  }

  ngOnDestroy() {
    this.uiSubscription.unsubscribe();   
  }
  
  guardar(){
    if (this.ingresoForm.invalid) return;
    this.store.dispatch(uiReduc.isLoading());
    

    setTimeout(() => {      
      if (this.cargando) this.store.dispatch(uiReduc.stopLoading()); 
      else console.log('No se ha stop loading  porque ya se candelo antes');          
    }, 2500);

    const {descripcion,monto} = this.ingresoForm.value;
    const ingresoEgreso:IngresoEgreso = new IngresoEgreso(descripcion,monto,this.tipo);
    this.ingresoEgresoService.crearIngresoEgreso(ingresoEgreso)
      .then( () =>{
        Swal.fire('Registro Cradico', descripcion, 'success');
        this.store.dispatch(uiReduc.stopLoading());
        this.ingresoForm.reset();
      })
      .catch(err => {
        Swal.fire('Error al añadir coleccion', err.message, 'error');
        this.store.dispatch(uiReduc.stopLoading());
      });

  

  }

  

}
