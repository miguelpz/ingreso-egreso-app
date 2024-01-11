import { Injectable, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, Unsubscribe, addDoc, collection, doc, getDoc, onSnapshot, setDoc } from '@angular/fire/firestore';
import {createUserWithEmailAndPassword,signInWithEmailAndPassword } from "firebase/auth";
import Swal from 'sweetalert2'
import { Usuario } from '../models/usuario.model';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as authReduc from '../auth/auth.actions';
import * as ingresoEgresoActions from '../ingreso-egreso/ingreso-egreso.actions';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public isAuth!:boolean;
  private _user!: Usuario | null;
  unsubUsuarioFire! : Unsubscribe;

  get user(){
    return this._user;
  }

  constructor(private auth:Auth, 
              private firestore:Firestore,
              private store:Store<AppState> ) {

    this.isAuth= this.auth.currentUser!= null ? true : false;
    this.auth.beforeAuthStateChanged(user =>{
      this.isAuth= user!=null ? true:false;
      if (user!=null){
          this.isAuth = true;   
          this.unsubUsuarioFire =onSnapshot(doc(this.firestore,user.uid,  "usuario"), (usuario)  => {
          const user: Usuario = Usuario.fromFirebase(usuario.data());
          this._user = user;
          this.store.dispatch(authReduc.setUser({user}));
      });
      }else{
        this.isAuth = false;  
        this._user = null;
        console.log('No exise el usario. LLamar al unset');
        this.unsubUsuarioFire();
        this.store.dispatch(authReduc.unSetUser());
        this.store.dispatch(ingresoEgresoActions.unSetItems());
      }     
    });
   }

  

  crearUsuario(nombre: string, email: string, password: string){
    return createUserWithEmailAndPassword(this.auth,email,password)
      .then( ({user})=>{
        const newUser = new Usuario(user.uid, nombre, user.email!);
        return setDoc(doc(this.firestore,`${user.uid}`,'usuario'),{...newUser}) ;   
      });
  }

  loginUsuario(email: string, password: string){
    return signInWithEmailAndPassword(this.auth,email,password);
  }

  showLoading() {
    Swal.fire({
      title: 'Espere por favor',     
      willOpen: () => {
        Swal.getConfirmButton()?.setAttribute('hidden','hidden');
        Swal.showLoading;
      }    
    });
  }

  logout(){
    this.unsubUsuarioFire();
    return this.auth.signOut();
  }

  async getUsuarioFireBase (uid:string){

    const docRef = doc(this.firestore,uid, "usuario");
    return getDoc(docRef);

    

  }
}
