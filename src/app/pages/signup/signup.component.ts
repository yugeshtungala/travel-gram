import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { AngularFireDatabase } from "@angular/fire/database";
import { AngularFireStorage } from "@angular/fire/storage";
import { NgForm } from "@angular/forms";
import { readAndCompressImage } from "browser-image-resizer";
import { config } from '../../utilities/config';
import { finalize } from "rxjs/operators";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  uploadPercent:number=null;
  picture: string =
  "https://learnyst.s3.amazonaws.com/assets/schools/2410/resources/images/logo_lco_i3oab.png";
  constructor(private authService:AuthService,private toastrService:ToastrService,
    private router:Router,private AngularDataBase:AngularFireDatabase,
    private angularFireStore:AngularFireStorage
    ) { }

  ngOnInit(): void {
  }
  onSubmit(f:NgForm){
    const {email,password,username,country,bio,name} = f.form.value 
    this.authService.signUp(email,password)    
    .then((res)=>{
      console.log(res)
      const {uid}=res.user;
      this.AngularDataBase.object(`/users/${uid}`).set({
          id:uid,
        name:name,
        email:email,  
        instaUserName:username,
        country:country,
        bio:bio,
        picture:this.picture
      })
    })    

    .then(()=>{this.router.navigateByUrl('/')
                this.toastrService.success('signUp success')
  })
    .catch((error)=>  this.toastrService.error("signUp failed"))
  }
  async uploadFile(event){
    const file = event.target.files[0]
    let resizedImage= await readAndCompressImage(file,config)
    const filePath= file.name;
    const fileRef = this.angularFireStore.ref(filePath)
    const task = this.angularFireStore.upload(filePath,resizedImage);
    
    task.percentageChanges().subscribe((percentage)=>{this.uploadPercent=percentage})
    task.snapshotChanges().pipe(
      finalize(()=>{
        fileRef.getDownloadURL().subscribe((url)=>{
          this.picture=url;
          this.toastrService.success("image upload success")
        })
      })
    ).subscribe();

  }
}
