import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';


export const authGuard: CanActivateFn = (route, state) => {    
  let checkResult= inject(AuthService).isAuth;
  if (!checkResult) inject(Router).navigate(['/login']);
  return checkResult;    
}
    



