import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { v4 as uuidv4 } from "uuid";
import { config } from 'process';
import { readAndCompressImage } from "browser-image-resizer";
import { finalize } from 'rxjs/operators';
@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.css']
})
export class AddPostComponent implements OnInit {
  locationName:string
  description:string
  picture:string=null
  user=null
  uploadPercent:number=null

  constructor(private angularFireDataBase:AngularFireDatabase,
    private angularFireStorage:AngularFireStorage,
    private toastrService:ToastrService,
    private router:Router,
    private authService:AuthService
    ) { 
         this.authService.getUser().subscribe((user)=>{
           this.angularFireDataBase.object(`/user/${user.uid}`).valueChanges()
           .subscribe((user)=>this.user = user)
         })
    }

  ngOnInit(): void {
  }
   onSubmit(){
     const uid = uuidv4();
     this.angularFireDataBase.object(`/posts/${uid}`).set({
       id:uid,
       locationName:this.locationName,
       description:this.description,
       picture:this.picture,
       by:this.user.name,
       instaId:this.user.instaUserName,
       date:Date.now()
     }).then(()=>{
       this.router.navigateByUrl('/')
       this.toastrService.success('upload sucess')
     }).catch((err)=>{
       this.toastrService.error(err.message)
     })

   }
   async uploadFile(event){
     const file =event.target.files[0];
     let resizeImage= await readAndCompressImage(file,config)
     const filePath=file.name;
     const fileref=this.angularFireStorage.ref(filePath)

     const task= this.angularFireStorage.upload(filePath,resizeImage)

     task.percentageChanges().subscribe((percentage)=> this.uploadPercent = percentage)

     task.snapshotChanges().pipe(
       finalize(()=>{
         fileref.getDownloadURL().subscribe((url)=>{
           this.picture = url
         })
       })
     ).subscribe()

   }
}
