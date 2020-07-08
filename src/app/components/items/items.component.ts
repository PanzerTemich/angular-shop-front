import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { stringify } from 'querystring';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from 'src/app/store';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {
  @Input() product:any;
  constructor(private http:HttpClient,private ngRedux:NgRedux<IAppState>) {
    http.post('http://localhost:8000/getcart',{
      email:localStorage.getItem('email')
    }).subscribe((data:any)=>{
      // console.log(data.cart);
      let carrito:Object=JSON.parse(data.cart);
      let id:string=this.product.sku;
      carrito[id]=(carrito[id]?carrito[id]:0);
      if(this.product.stock<carrito[id]){
        carrito[id]=this.product.stock;
        this.added=carrito[id];
        this.ngRedux.dispatch({
          type:'UPDATE',
          payload:{
            cart:carrito
          }
        })
        this.http.post('http://localhost:8000/cart',{
          email:localStorage.getItem('email'),
          cart:JSON.stringify(carrito)
        }).subscribe((d:any)=>{
          console.log(d.cart)
        })
      }else{
        this.added=carrito[id];
      }
    })
   }

  ngOnInit(): void {
  }
  added;
  add(){
    let carrito:any=this.ngRedux.getState().cart;
    carrito[this.product.sku]=(carrito[this.product.sku]?carrito[this.product.sku]:0);
    let qty=carrito[this.product.sku]+1;
    if(qty<=this.product.stock){
      carrito[this.product.sku]=qty;
      this.added=carrito[this.product.sku];
      this.ngRedux.dispatch({
        type:'UPDATE',
        payload:{
          cart:carrito
        }
      })
      this.http.post('http://localhost:8000/cart',{
        email:localStorage.getItem('email'),
        cart:JSON.stringify(carrito)
      }).subscribe((data:any)=>{
        console.log(data);
      })
    }
  }
  rest(){
    let carrito:any=this.ngRedux.getState().cart;
    carrito[this.product.sku]=(carrito[this.product.sku]?carrito[this.product.sku]:0);
    let qty:any=carrito[this.product.sku]-1;
    if(qty>0){
      carrito[this.product.sku]=qty;
      this.added=carrito[this.product.sku];
      this.ngRedux.dispatch({
        type:"UPDATE",
        payload:{
          cart:carrito
        }
      })
      this.http.post('http://localhost:8000/cart',{
        email:localStorage.getItem('email'),
        cart:JSON.stringify(carrito)
      }).subscribe((data:any)=>{
        console.log(data);
      })
    }else if(qty<=0){
      // console.log(qty);
      carrito[this.product.sku]=0;
      this.added=carrito[this.product.sku];
      delete carrito[this.product.sku];
      console.log(carrito);
      this.ngRedux.dispatch({
        type:'UPDATE',
        payload:{
          cart:carrito
        }
      });
      this.http.post('http://localhost:8000/cart',{
        email:localStorage.getItem('email'),
        cart:JSON.stringify(carrito)
      }).subscribe((data:any)=>{
        console.log(data);
      });
    }
  }


}
