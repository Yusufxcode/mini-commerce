import { Component, Input } from '@angular/core';
import { Product } from '../../models/product.model';
import { CartService } from '../../services/cart.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
  @Input() product!: Product;
  addingToCart = false;

  constructor(private cartService: CartService, private toast: ToastrService) {}

  addToCart(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    
    this.addingToCart = true;
    this.cartService.addToCart(this.product);

    this.toast.success(`1 ${this.product.name} has been added to cart`, 'Success');
    
    setTimeout(() => {
      this.addingToCart = false;
    }, 1000);
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement | null;
    if (target) {
      target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0xMDAgMTAwTDEwMCA4MEwxMjAgMTAwTDEwMCAxMjBMODAgMTAwTDEwMCA4MFoiIGZpbGw9IiNEREREREQiLz4KPC9zdmc+';
    }
  }
}
