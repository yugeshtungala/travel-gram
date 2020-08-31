import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private toastr:ToastrService,private angularFireDataBase:AngularFireDatabase) { }
  users=[]
  posts=[]
  isLoading=false
  ngOnInit(): void {
    this.isLoading=true
    this.angularFireDataBase.object('/user').valueChanges().subscribe(
    (obj)=>{
      if(obj){
        this.users=Object.values(obj)
        this.isLoading=false
      }
      else{
        this.toastr.error('no user found')
        this.users=[]
        this.isLoading=false
      }
    })
    this.angularFireDataBase.object('/posts').valueChanges().subscribe(
      (obj)=>{
        if(obj){
          this.posts= Object.values(obj).sort((a, b) => b.date - a.date);
          this.isLoading=false
        }else{
          this.toastr.error('no post to display')
          this.posts=[]
          this.isLoading=false
        }
      }
    )
  }

}
