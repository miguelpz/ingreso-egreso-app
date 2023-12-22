import { Injectable, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, addDoc, collection, doc, setDoc } from '@angular/fire/firestore';
import {createUserWithEmailAndPassword,signInWithEmailAndPassword } from "firebase/auth";
import Swal from 'sweetalert2'
import { Usuario } from '../models/usuario.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public isAuth!:boolean;

  constructor(private auth:Auth, private firestore:Firestore ) {
    this.isAuth= this.auth.currentUser!= null ? true : false;
    this.auth.beforeAuthStateChanged(user =>{
      this.isAuth= user!=null ? true:false;
      console.log('Estado usuario: ' + this.isAuth); 
      console.log('Cambio de estado');
      console.log(user);
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
}
