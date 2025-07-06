import { Component } from '@angular/core';
import { Observable, BehaviorSubject, combineLatest, startWith, map } from 'rxjs';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { ProductCardComponent } from "../product-card/product-card.component";

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [NgIf, NgFor, AsyncPipe, ProductCardComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {
   products$: Observable<Product[]>;
  loading$ = new BehaviorSubject<boolean>(true);
  error$ = new BehaviorSubject<string | null>(null);

  constructor(private productService: ProductService) {
    this.products$ = this.productService.getProducts();
    
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading$.next(true);
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.loading$.next(false);
        this.error$.next(null);
      },
      error: (error) => {
        this.loading$.next(false);
        this.error$.next('Failed to load products. Please try again.');
        console.error('Error loading products:', error);
      }
    });
  }

   trackByProductId(index: number, product: Product): number {
    return product.id;
  }


}
