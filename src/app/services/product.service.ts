import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Product } from '../models/product.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsSubject = new BehaviorSubject<Product[]>([]);
  private products$ = this.productsSubject.asObservable();

  private http = inject(HttpClient);
  private storageService =inject(StorageService); 

  constructor(
  ) {
    this.loadProducts();
  }

  private loadProducts(): void {
    // Try to get products from localStorage first
    const cachedProducts = this.storageService.getProducts();
    if (cachedProducts && cachedProducts.length > 0) {
      this.productsSubject.next(cachedProducts);
      return;
    }

    // If no cached products, fetch from JSON file
    this.http.get<Product[]>('/assets/data/products.json')
      .pipe(
        tap(products => {
          // Cache products in localStorage
          this.storageService.setProducts(products);
          this.productsSubject.next(products);
        }),
        catchError(error => {
          console.error('Error loading products from JSON:', error);
          // Return empty array on error
          return of([]);
        })
      )
      .subscribe();
  }

  getProducts(): Observable<Product[]> {
    return this.products$;
  }

  getProductById(id: number): Observable<Product | null> {
    return this.products$.pipe(
      map(products => products.find(p => p.id === id) || null)
    );
  }

  searchProducts(query: string): Observable<Product[]> {
    return this.products$.pipe(
      map(products => 
        products.filter(product => 
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.description.toLowerCase().includes(query.toLowerCase())
        )
      )
    );
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    return this.products$.pipe(
      map(products => 
        category === 'all' 
          ? products 
          : products.filter(product => product.category === category)
      )
    );
  }

  refreshProducts(): void {
    this.loadProducts();
  }
}
