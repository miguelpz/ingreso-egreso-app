import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

import { provideFirebaseApp, getApp, initializeApp} from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore'; 
import { getAuth, provideAuth, connectAuthEmulator, Auth } from '@angular/fire/auth';

import { NgChartsModule } from 'ng2-charts';



import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component'; 
import { RegisterComponent } from './auth/register/register.component'; 
import { DashboardComponent } from './dashboard/dashboard.component';
import { IngresoEgresoComponent } from './ingreso-egreso/ingreso-egreso.component';
import { EstadisticaComponent } from './ingreso-egreso/estadistica/estadistica.component';
import { DetalleComponent } from './ingreso-egreso/detalle/detalle.component';
import { FooterComponent } from './shared/footer/footer.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { environment } from 'src/environments/environment';


import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { appReducers } from './app.reducer';
import { OrdenIngresoPipe } from './pipes/orden-ingreso.pipe';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent, 
    DashboardComponent,
    IngresoEgresoComponent,
    EstadisticaComponent,
    DetalleComponent,
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    OrdenIngresoPipe
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NgChartsModule,
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideFirestore(()=>getFirestore()),
    provideAuth(()=>getAuth()),
    StoreModule.forRoot(appReducers),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: !isDevMode()})  
  

  
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
