import { Component, OnInit, Input } from '@angular/core';
// npm install @fortawesome/free-regular-svg-icons
import {
  faThumbsUp,
  faThumbsDown,
  faShareSquare,
} from '@fortawesome/free-regular-svg-icons';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFireDatabase } from '@angular/fire/database';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  faThumbsUp = faThumbsUp;
  faThumbsDown = faThumbsDown;
  faShareSquare = faShareSquare;
  uid=null;
  upvote=0
  downvote=0
@Input()post;
  constructor(private  authService:AuthService, private angularFireDatabase:AngularFireDatabase) { }

  ngOnInit(): void {
    this.authService.getUser().subscribe((user)=>{
      this.uid=user?.uid
    })
   
  }
  ngOnChanges(): void {
     if(this.post.vote){
       Object.values(this.post.vote).map((val:any)=>{
         if(val.upvote){
           this.upvote+=1
         }
        if(val.downvote){
        this.downvote+=1
        }
       })
     }
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    
  }
  upvotePost(){
     this.angularFireDatabase.object(`/posts/${this.post.id}/vote/${this.uid}`).set({
       upvote:1
     })
  }
  downvotePost(){
      this.angularFireDatabase.object(`/posts/${this.post.id}/vote/${this.uid}`).set({
        downvote:1
      })
  }
  getInstaUrl(){
    return  `https://instagram.com/${this.post.instaId}`
  }
}
