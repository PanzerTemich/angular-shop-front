import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from 'src/app/store';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private router:Router,private http:HttpClient,private ngRedux:NgRedux<IAppState>) {
    // this.ngRedux.subscribe(()=>{
    //   console.log(this.ngRedux.getState());
    //   console.log("Working the data retriving");
    // });
   }

  ngOnInit(): void {
  }
  name:string="";
  lastname:string="";
  email:string="";
  password:string="";
  error:string;
  send(){
    // console.log(this.name);
    // console.log(this.lastname);
    // console.log(this.email);
    // console.log(this.password);
    //Tengo que ponerle any para que pueda gestionar los datos recibidos o pasarle una interface <>
    this.http.post<IAppState>('http://localhost:8000/register',{
      name:this.name,
      lastname:this.lastname,
      email:this.email,
      password:this.password
    }).subscribe((data:any)=>{
      //Poner que data es de tipo de dato any para poder acceder
      // console.log(data.session);
      if(data.session){
        localStorage.setItem("session",data.session);
        localStorage.setItem("email",data.email);
        localStorage.setItem("name",data.name);
        localStorage.setItem("lastname",data.lastname);
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
          setTimeout(()=>this.error=undefined,5500);
      }
    })
  }
}
