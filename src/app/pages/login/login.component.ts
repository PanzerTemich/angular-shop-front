import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from 'src/app/store';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private http:HttpClient, private ngRedux:NgRedux<IAppState>,private router:Router) { }

  ngOnInit(): void {
  }
  email:string;
  password:string;
  error:string;
  send(){
    this.http.post('http://localhost:8000/loggin',{
      email:this.email,
      password:this.password
    }).subscribe((data:any)=>{
      if(data.session){
        localStorage.setItem('email',data.email);
        localStorage.setItem('name',data.name);
        localStorage.setItem('lastname',data.lastname);
        localStorage.setItem('session',data.session);
        this.ngRedux.dispatch({
          type:"REGISTER",
          payload:{
            cart:JSON.parse(data.cart)
          }
        })
        this.router.navigate(['/']);
      }else{
        console.log(data);
        this.error=data.error;
        setTimeout(()=>this.error=undefined,8000);
      }
    })
  }
}
