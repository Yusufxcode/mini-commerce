import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../models/product.model';
import { CartItem } from '../models/cart-item.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  private cartItems$ = this.cartItemsSubject.asObservable();
  private storageService = inject(StorageService);

  constructor() {
    // Load cart items from localStorage on initialization
    const savedCart = this.storageService.getCartItems();
    if (savedCart) {
      this.cartItemsSubject.next(savedCart);
    }
  }

  getCartItems(): Observable<CartItem[]> {
    return this.cartItems$;
  }

  getCartItemCount(): Observable<number> {
    return this.cartItems$.pipe(
      map(items => items.reduce((total, item) => total + item.quantity, 0))
    );
  }

  getCartTotal(): Observable<number> {
    return this.cartItems$.pipe(
      map(items => items.reduce((total, item) => total + (item.product.price * item.quantity), 0))
    );
  }

  addToCart(product: Product): void {
    const currentItems = this.cartItemsSubject.value;
    const existingItemIndex = currentItems.findIndex(item => item.product.id === product.id);

    if (existingItemIndex > -1) {
      // Product already exists in cart, increase quantity
      const updatedItems = [...currentItems];
      updatedItems[existingItemIndex].quantity += 1;
      this.updateCartItems(updatedItems);
    } else {
      // New product, add to cart
      const newItem: CartItem = {
        product: product,
        quantity: 1
      };
      const updatedItems = [...currentItems, newItem];
      this.updateCartItems(updatedItems);
    }
  }

  removeFromCart(productId: number): void {
    const currentItems = this.cartItemsSubject.value;
    const updatedItems = currentItems.filter(item => item.product.id !== productId);
    this.updateCartItems(updatedItems);
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const currentItems = this.cartItemsSubject.value;
    const updatedItems = currentItems.map(item => {
      if (item.product.id === productId) {
        return { ...item, quantity };
      }
      return item;
    });
    this.updateCartItems(updatedItems);
  }

  clearCart(): void {
    this.updateCartItems([]);
  }

  private updateCartItems(items: CartItem[]): void {
    this.cartItemsSubject.next(items);
    this.storageService.setCartItems(items);
  }

  isInCart(productId: number): Observable<boolean> {
    return this.cartItems$.pipe(
      map(items => items.some(item => item.product.id === productId))
    );
  }

  getItemQuantity(productId: number): Observable<number> {
    return this.cartItems$.pipe(
      map(items => {
        const item = items.find(item => item.product.id === productId);
        return item ? item.quantity : 0;
      })
    );
  }
}
