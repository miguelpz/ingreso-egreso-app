import { Action, createReducer, on } from '@ngrx/store';
import * as auth  from './auth.actions';
import { Usuario } from '../models/usuario.model';

export interface State {
    user : Usuario | null
}

export const initialState: State = {
    user: null
}

export const authReducer = createReducer<State,Action>(initialState,
    on(auth.setUser, (state,{user}) => ({...state, user:{...user}})),
    on(auth.unSetUser, (state) => ({...state, user:null}))

);