import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, onSnapshot, setDoc,updateDoc } from '@angular/fire/firestore';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { AuthService } from './auth.service';
import { filter } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { setItems } from '../ingreso-egreso/ingreso-egreso.actions';

@Injectable({
  providedIn: 'root'
})
export class IngresoEgresoService {

  constructor(private firestore:Firestore,
              private authService:AuthService,
              private store:Store<AppState>) { }

  crearIngresoEgreso(ingresoEgreso:IngresoEgreso) {
    const uid=  this.authService.user?.uid;

    console.log('Este es uid de usuario' + uid);
    console.log('el ingreso egreso: ' + ingresoEgreso.descripcion);

    const collectionInstance = collection(
      this.firestore,
      `${uid}`,
      'ingresos-egresos',
      'items'
    )
    return addDoc(collectionInstance,{...ingresoEgreso});
  }

  initIngresosEgresosListener (uid: string|null){
    const collectionInstance = collection(
      this.firestore,
      `${uid}`,
      'ingresos-egresos',
      'items'
    );
    
    return onSnapshot(collectionInstance, (collection) => {
      let ingresosEgresos :any[]  = collection.docs.map(doc => {
        console.log("Se actualiza elemento coleccion");
        let ingresoEgreso: any = ({...doc.data() as any});
        ingresoEgreso.uid = doc.id;
        return ingresoEgreso;
      });  
      this.store.dispatch(setItems({items :ingresosEgresos}));
    }); 
    
  }

  deleteIngresoEgreso (uidItem: string){
    const uid = this.authService.user?.uid;
    const db = getFirestore(this.firestore.app);
    return deleteDoc(doc(db,`${uid}`,'ingresos-egresos','items',`${uidItem}`));
  }
}
