import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from 'src/app/store';
import { HttpClient } from '@angular/common/http';
// import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private router:Router,private ngRedux:NgRedux<IAppState>,private http:HttpClient) {
      ngRedux.subscribe(()=>{
        // console.log(ngRedux.getState());
        if(Object.values(ngRedux.getState().cart).length===0){
          this.cart=0;
        }else{
          // console.log(Object.values(ngRedux.getState().cart));
          this.cart=Object.values(ngRedux.getState().cart).reduce((total:number,num:number)=>total+num);
        }
      })
      //Second part
      if(localStorage.getItem("session")){
        this.logged=localStorage.getItem("session");
        this.http.post("http://localhost:8000/logged",{
           session:this.logged,
           email:localStorage.getItem("email")
        }).subscribe((data:any)=>{
          //  console.log(data);
           if(data.cart){
             this.ngRedux.dispatch({
               type:"LOGGED",
               payload:{
                 cart:JSON.parse(data.cart)
               }
             })
           if(Object.values(JSON.parse(data.cart)).length===0){
               this.cart=0;
           }else{
               this.cart=Object.values(JSON.parse(data.cart)).reduce((total:number,num:number)=> total + num);
              //  console.log(this.cart);
           }
           }else{
             console.log(data);
             localStorage.clear();
             location.reload();
           }
        })
      }
   }
   ngOnInit(): void {
  }
  logged:string;
  nombre:string;
  cart:any;
  articulos:number;
  pathname=window.location.pathname!=="/payment";
  payment(){
    this.router.navigate(['/payment']);
  }
  logout(){
    this.http.post('http://localhost:8000/logout',{
      session:localStorage.getItem('session'),
      email:localStorage.getItem('email')
    }).subscribe((data:any)=>{
        console.log(data.response);
        localStorage.clear();
        this.ngRedux.dispatch({
          type:"OUT",
          payload:{
            cart:{}
          }
        })
        location.reload();
    })

  }
  login(){
    this.router.navigate(['/login']);
  }
  signup(){
    this.router.navigate(['/register']);
  }
}
