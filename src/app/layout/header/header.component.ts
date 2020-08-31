import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
email=null
  constructor(private authService:AuthService,
    private Router:Router,
    private toastrService:ToastrService) { 
      this.authService.getUser().subscribe((user)=>{
        this.email = user?.email
      })
    }
   async handleSignOut(){
     try{
       await this.authService.signOut()
       this.Router.navigateByUrl('/signIn')
       this.toastrService.success("login again to continue")
       this.email=null
     }catch(error){
       this.toastrService.error('something is wrong')

     }
   }
  ngOnInit(): void {

  }

}
