import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { CartItem } from '../models/cart-item.model';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly PRODUCTS_KEY = 'mini-commerce-products';
  private readonly CART_KEY = 'mini-commerce-cart';

  constructor() {}

  // Product storage methods
  setProducts(products: Product[]): void {
    try {
      localStorage.setItem(this.PRODUCTS_KEY, JSON.stringify(products));
    } catch (error) {
      console.error('Error saving products to localStorage:', error);
    }
  }

  getProducts(): Product[] | null {
    try {
      const products = localStorage.getItem(this.PRODUCTS_KEY);
      return products ? JSON.parse(products) : null;
    } catch (error) {
      console.error('Error loading products from localStorage:', error);
      return null;
    }
  }

  // Cart storage methods
  setCartItems(cartItems: CartItem[]): void {
    try {
      localStorage.setItem(this.CART_KEY, JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving cart items to localStorage:', error);
    }
  }

  getCartItems(): CartItem[] | null {
    try {
      const cartItems = localStorage.getItem(this.CART_KEY);
      return cartItems ? JSON.parse(cartItems) : null;
    } catch (error) {
      console.error('Error loading cart items from localStorage:', error);
      return null;
    }
  }

  // Utility methods
  clearProducts(): void {
    try {
      localStorage.removeItem(this.PRODUCTS_KEY);
    } catch (error) {
      console.error('Error clearing products from localStorage:', error);
    }
  }

  clearCart(): void {
    try {
      localStorage.removeItem(this.CART_KEY);
    } catch (error) {
      console.error('Error clearing cart from localStorage:', error);
    }
  }

  clearAll(): void {
    try {
      localStorage.removeItem(this.PRODUCTS_KEY);
      localStorage.removeItem(this.CART_KEY);
    } catch (error) {
      console.error('Error clearing all data from localStorage:', error);
    }
  }

  // Check if localStorage is available
  isLocalStorageAvailable(): boolean {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, 'test');
      localStorage.removeItem(test);
      return true;
    } catch (error) {
      return false;
    }
  }
}
