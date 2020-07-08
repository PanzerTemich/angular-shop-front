import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from 'src/app/store';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { Router } from '@angular/router';
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  constructor(private http:HttpClient,private router:Router,private ngRedux:NgRedux<IAppState>) {
    http.post('http://localhost:8000/getaddress',{
      email:localStorage.getItem('email')
    }).subscribe((datas:any)=>{
      // console.log(data);
      this.receiver=datas.receiver;
      this.mainstreet=datas.mainstreet;
      this.number=datas.number;
      this.secondstreet=datas.secondstreet;
      this.thirdstreet=datas.thirdstreet;
      this.zip=datas.zip;
      this.city=datas.city;
      this.state=datas.state;
      if(this.receiver && this.mainstreet && this.number && this.secondstreet && this.thirdstreet && this.zip && this.city && this.state){
        http.get('http://localhost:8000/products').subscribe((data:any)=>{
          http.post('http://localhost:8000/getcart',{
            email:localStorage.getItem('email')
          }).subscribe((datos:any)=>{
            console.log(datos.cart);//carrito
            console.log(data);//productos
            this.products=data;
            // let carrito=ngRedux.getState().cart;
            let carrito=JSON.parse(datos.cart);
            // console.log(carrito);
            this.products=this.products.filter((e:any)=>{
              // console.log(e);
              let id=e.sku;
              if(carrito.hasOwnProperty(id)){
                e.stock=carrito[id];
                if(e.stock>=1){
                  return e;
                }else{
                  delete carrito[id];
                }
              }
            });//console.log(this.products);
            ngRedux.dispatch({
              type:'UPDATE',
              payload:{
                cart:carrito
              }
            });
            this.http.post('http://localhost:8000/cart',{
              email:localStorage.getItem('email'),
              cart:JSON.stringify(carrito)
            }).subscribe((d:any)=>{
              console.log(d.cart);
            })
            this.total=this.products.map((e:any)=>{
              return e.stock*e.price;
            }).reduce((total:number,number:number)=>total+number,0);
          })
          ///////////////////////////////////////////////////////////////////
        })
        this.datos=true;
      }
    })
   }
   products:Array<any>=[];
   datos:boolean;
   receiver:string;
   mainstreet:string;
   number:number;
   secondstreet:string;
   thirdstreet:string;
   zip:string;
   city:string;
   state:string;
   total:number;
   add(producto){
     console.log(producto);
   }
   del(producto){
     console.log(producto);
   }
   update(){
     this.datos=false;
     this.http.post('http://localhost:8000/getaddress',{
       email:localStorage.getItem('email')
     }).subscribe((data:any)=>{
      this.receiver=data.receiver;
      this.mainstreet=data.mainstreet;
      this.number=data.number;
      this.secondstreet=data.secondstreet;
      this.thirdstreet=data.thirdstreet;
      this.zip=data.zip;
      this.city=data.city;
      this.state=data.state;
      // if(this.receiver && this.mainstreet && this.number && this.secondstreet && this.thirdstreet && this.zip && this.city && this.state){
        // this.datos=false;
      // }
     });
    //  this.http.post()
   }
   send(){
     this.http.post('http://localhost:8000/updateaddress',{
       email:localStorage.getItem('email'),
       receiver:this.receiver,
       mainstreet:this.mainstreet,
       number:this.number,
       secondstreet:this.secondstreet,
       thirdstreet:this.thirdstreet,
       zip:this.zip,
       city:this.city,
       state:this.state
     }).subscribe((data:any)=>{
       if(data){         
         this.receiver=data.receiver;
         this.mainstreet=data.mainstreet;
         this.number=data.number;
         this.secondstreet=data.secondstreet;
         this.thirdstreet=data.thirdstreet;
         this.zip=data.zip;
         this.city=data.city;
         this.state=data.state;
         if(this.receiver && this.mainstreet && this.number && this.secondstreet && this.thirdstreet && this.zip && this.city && this.state){
          // this.datos=true;
          location.reload();
        }
       }
     })
   }
  ngOnInit(): void {
    this.initConfig();
  }
  public payPalConfig?: IPayPalConfig;
  private initConfig(): void {
    this.payPalConfig = {
    currency: 'MXN',
    clientId: 'Aef8aAwJkCp-o3RuT8BTJr5_dSThENaqRj5M7PdLLzLFqO5ySbtQs-4B8nBh9J-6ZkqSsJj6fF6S6LZJ',
    createOrderOnClient: (data) => <ICreateOrderRequest>{
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'MXN',
            value: this.total.toString(),
            breakdown: {
              item_total: {
                currency_code: 'MXN',
                value: this.total.toString()
              }
            }
          },
          // items: [
          //   {
          //     name: 'Enterprise Subscription',
          //     quantity: '1',
          //     category: 'DIGITAL_GOODS',
          //     unit_amount: {
          //       currency_code: 'MXN',
          //       value: this.total.toString(),
          //     },
          //   }
          // ]
        }
      ]
    },
    advanced: {
      commit: 'true'
    },
    style: {
      label: 'paypal',
      layout: 'vertical',
    },
    onApprove: (data, actions) => {
      console.log('onApprove - transaction was approved, but not authorized', data, actions);
      this.http.post('http://localhost:8000/cart',{
        email:localStorage.getItem('email'),
        cart:'{}'
      }).subscribe((d:any)=>{
        console.log(d.cart);
      });
      this.ngRedux.dispatch({
          type:'UPDATE',
        payload:{
          cart:{}
        }
      });
      this.router.navigate(['/']);
      actions.order.get().then(details => {
        console.log('onApprove - you can get full order details inside onApprove: ', details);
      });
    },
    onClientAuthorization: (data) => {
      console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
      // this.showSuccess = true;
    },
    onCancel: (data, actions) => {
      console.log('OnCancel', data, actions);
    },
    onError: err => {
      console.log('OnError', err);
    },
    onClick: (data, actions) => {
      console.log('onClick', data, actions);
    },
  };
  }
}
