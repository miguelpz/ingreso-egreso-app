import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { IngresoEgreso } from 'src/app/models/ingreso-egreso.model';
import { IngresoEgresoService } from 'src/app/services/ingreso-egreso.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: [
  ]
})
export class DetalleComponent implements OnInit, OnDestroy {

  items! : any[];
  subsItems! : Subscription;

  constructor(private store: Store<AppState>,
              private ingresoEgresoService: IngresoEgresoService){}

  ngOnInit(): void {
    this.subsItems = this.store.select('ingresosEgresos').subscribe( store => this.items = store.items);
    
  }

  ngOnDestroy(): void {
    this.subsItems.unsubscribe();
  }
  
  delete (uid:string){
    this.ingresoEgresoService.deleteIngresoEgreso(uid)
      .then(() =>{
        Swal.fire({
          icon: 'success',
          title: 'Record deleted',
          text: `Record deleted: ${uid}`,
          footer: 'Success'
        });
      })
      .catch(error => {
        Swal.fire({
          icon: 'error',
          title: error.name,
          text: error.message,
          footer: error.code
        });
      });
  }



}
