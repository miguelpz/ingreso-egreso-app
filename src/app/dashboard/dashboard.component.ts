import { Component, OnInit, OnDestroy } from '@angular/core';
import {Store} from '@ngrx/store';
import { AppState } from '../app.reducer';
import { Subscription, filter } from 'rxjs';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import { Unsubscribe } from '@angular/fire/auth';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})

export class DashboardComponent implements OnInit, OnDestroy {
  userSubs!: Subscription;
  unSubIngresoEgresoListener! : Unsubscribe;

  constructor(private store:Store<AppState>,
              private ingresoEgresoService : IngresoEgresoService){}
 
  
  ngOnInit(): void {
    this.userSubs = this.store.select('user')
      .pipe(
        filter(auth => auth.user!=null)
      )
      .subscribe(({user}) =>{
       this.unSubIngresoEgresoListener =  this.ingresoEgresoService.initIngresosEgresosListener(user!.uid);
      })
  }

  ngOnDestroy(): void {
    this.userSubs.unsubscribe;
    this.unSubIngresoEgresoListener();
  }


  

}
