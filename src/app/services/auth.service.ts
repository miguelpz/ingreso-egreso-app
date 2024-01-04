import { Injectable, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, addDoc, collection, doc, getDoc, setDoc } from '@angular/fire/firestore';
import {createUserWithEmailAndPassword,signInWithEmailAndPassword } from "firebase/auth";
import Swal from 'sweetalert2'
import { Usuario } from '../models/usuario.model';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as authReduc from '../auth/auth.actions';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public isAuth!:boolean;

  constructor(private auth:Auth, 
              private firestore:Firestore,
              private store:Store<AppState> ) {

    this.isAuth= this.auth.currentUser!= null ? true : false;
    this.auth.beforeAuthStateChanged(user =>{
      this.isAuth= user!=null ? true:false;
      if (user!=null){
        this.isAuth = true;   
        getDoc(doc(this.firestore,user.uid, "usuario")).then ( fireUser =>{
          const user: Usuario = Usuario.fromFirebase(fireUser.data());
          this.store.dispatch(authReduc.setUser({user}));

   
        }).catch(error =>{
          console.log("error")
        });
      }else{
        this.isAuth = false;  
        console.log('No exise el usario. LLamar al unset');
        this.store.dispatch(authReduc.unSetUser());
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
        Swal.showLoading();
      }    
    });
  }

  logout(){
    return this.auth.signOut();
  }

  async getUsuarioFireBase (uid:string){

    const docRef = doc(this.firestore,uid, "usuario");
    return getDoc(docRef);

    

  }
}
