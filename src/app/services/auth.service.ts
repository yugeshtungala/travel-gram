import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private angularFireAuth:AngularFireAuth) { }
  signUp(email:string,password:string){
    return this.angularFireAuth.createUserWithEmailAndPassword(email,password)
  }
  signIn(email:string,password:string){
    return this.angularFireAuth.signInWithEmailAndPassword(email,password)
  }
  getUser(){
    return this.angularFireAuth.authState
  }
  signOut(){
    return this.angularFireAuth.signOut()
  }
}
