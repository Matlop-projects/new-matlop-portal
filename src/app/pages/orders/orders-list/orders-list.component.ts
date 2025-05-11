import { NgFor } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { ApiService } from "../../../services/api.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-orders-list",
  standalone: true,
  imports: [NgFor],
  templateUrl: "./orders-list.component.html",
  styleUrl: "./orders-list.component.scss",
})
export class OrdersListComponent implements OnInit {
  private router =inject(Router)
  orders: any = [1,2,3,4];
  activeStatus='current'
  searchObject = {
    pageNumber: 1,
    pageSize: 8,
    sortingExpression: "",
    sortingDirection: 0,
    clientId: 0,
    paymentWayId: 0,
    orderStatus: 0,
    packageId: 0,
    nextVistTime: "",
    coponeId: 0,
    orderSubTotal: 0,
    orderTotal: 0,
    locationId: 0,
  };
  private apiService = inject(ApiService);
  ngOnInit(): void {
    const storedData = localStorage.getItem('userData');

if (storedData !== null) {
  const parsed = JSON.parse(storedData);
  const id: number = Number(parsed.id);
  this.searchObject.clientId=id
}
   this.getAllOrders()

   
  }
  onSelectStatus(value:string){
    this.activeStatus=value
    if(value=='current'){

    }
    else if(value=='complete'){

    }
    else{

    }

  }
  getAllOrders() {
    this.apiService.post("Order/GetAllWitPagination",this.searchObject).subscribe((res) => {});
  }

  onOrderDetails(){
    this.router.navigateByUrl('order-details/1')
  }
}
