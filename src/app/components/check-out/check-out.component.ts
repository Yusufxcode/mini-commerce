import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Observable, map } from 'rxjs';
import { CartItem } from '../../models/cart-item.model';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-check-out',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './check-out.component.html',
  styleUrl: './check-out.component.css'
})
export class CheckOutComponent {
  cartItems$: Observable<CartItem[]>;
  subtotal$: Observable<number>;
  deliveryFee = 5500; // Standard delivery fee
  vatRate = 0.075; // 7.5% VAT
  vat$: Observable<number>;
  total$: Observable<number>;
  isProcessing = false;
  orderComplete = false;
  orderId = '';

  constructor(
    private cartService: CartService,
    private router: Router,
    private toast: ToastrService
  ) {
    this.cartItems$ = this.cartService.getCartItems();
    this.subtotal$ = this.cartService.getCartTotal();
    
    this.vat$ = this.subtotal$.pipe(
      map(subtotal => (subtotal + this.deliveryFee) * this.vatRate)
    );
    
    this.total$ = this.subtotal$.pipe(
      map(subtotal => {
        const vat = (subtotal + this.deliveryFee) * this.vatRate;
        return subtotal + this.deliveryFee + vat;
      })
    );
  }

  ngOnInit(): void {}

  async placeOrder(): Promise<void> {
    this.isProcessing = true;
    
    // Simulate order processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate random order ID
    this.orderId = this.generateOrderId();

    this.toast.success(`Order ${this.orderId} placed successfully!`, 'Success');
    
    // Clear cart
    this.cartService.clearCart();
    
    this.isProcessing = false;
    this.orderComplete = true;
  }

  private generateOrderId(): string {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2, 8);
    return `ORD-${timestamp}-${randomPart}`.toUpperCase();
  }

  continueShopping(): void {
    this.router.navigate(['/products']);
  }

  trackByCartItem(index: number, item: CartItem): number {
    return item.product.id;
  }
}
