import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { AppState } from 'src/app/app.reducer';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit, OnDestroy {

  userSubscription!: Subscription;
  nombreUsuarioActivo? :string;

  constructor(private authService: AuthService,
            private router: Router,
            private store:Store<AppState>){

  }
  ngOnInit(): void {
    this.userSubscription = this.userSubscription = this.store.select('user').subscribe(({user:user}) =>{
      console.log('El nombre de usuario es: ' + user?.nombre);
      this.nombreUsuarioActivo = user?.nombre

    });
  }
  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

  

  logout(){
    this.authService.logout().then(()=>{
      this.router.navigate(['/login']);
    })
  }

}
