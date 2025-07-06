import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CartService } from '../../services/cart.service';
import { AsyncPipe, NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgIf, AsyncPipe, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  private cartService = inject(CartService);
  cartItemCount$: Observable<number>;

  constructor() {
    this.cartItemCount$ = this.cartService.getCartItemCount();
  }
}
