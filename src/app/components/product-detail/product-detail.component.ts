import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, switchMap, of, catchError } from 'rxjs';
import { Product } from '../../models/product.model';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-detail',
  standalone: true,
    imports: [CommonModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent {
  product$: Observable<Product | null>;
  loading = true;
  error: string | null = null;
  addingToCart = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService
  ) {
    this.product$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (!id) {
          this.router.navigate(['/products']);
          return of(null);
        }
        return this.productService.getProductById(+id);
      }),
      catchError(error => {
        console.error('Error loading product:', error);
        this.error = 'Failed to load product details.';
        this.loading = false;
        return of(null);
      })
    );
  }

  ngOnInit(): void {
    this.product$.subscribe({
      next: (product) => {
        this.loading = false;
        if (!product) {
          this.error = 'Product not found.';
        }
      },
      error: (error) => {
        this.loading = false;
        this.error = 'Failed to load product details.';
      }
    });
  }

  addToCart(product: Product): void {
    this.addingToCart = true;
    this.cartService.addToCart(product);
    
    setTimeout(() => {
      this.addingToCart = false;
    }, 1000);
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }

  onImageError(event: any): void {
    event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0yMDAgMjAwTDIwMCAxNjBMMjQwIDIwMEwyMDAgMjQwTDE2MCAyMDBMMjAwIDE2MFoiIGZpbGw9IiNEREREREQiLz4KPC9zdmc+';
  }

}
