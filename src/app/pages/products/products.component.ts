import { Component, OnInit } from '@angular/core';
// import { NavbarComponent } from '../../components/navbar/navbar.component'
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  constructor(private http:HttpClient) { 
    this.http.get('http://localhost:8000/products').subscribe((data)=>{
      this.products=data;
      console.log(data)
    });
    this.session=localStorage.getItem("session");
  }
  products;
  session;
  ngOnInit(): void {

  }

}
