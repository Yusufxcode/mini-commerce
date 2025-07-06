import { Component } from '@angular/core';
import { Observable, BehaviorSubject, combineLatest, startWith, map } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { AsyncPipe, NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { ProductCardComponent } from "../product-card/product-card.component";

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [NgIf, NgFor, AsyncPipe, ProductCardComponent, TitleCasePipe, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {
  products$: Observable<Product[]>;
  filteredProducts$: Observable<Product[]>;
  searchTerm$ = new BehaviorSubject<string>('');
  selectedCategory$ = new BehaviorSubject<string>('all');
  loading$ = new BehaviorSubject<boolean>(true);
  error$ = new BehaviorSubject<string | null>(null);
  
  categories: string[] = ['all', 'electronics', 'clothing', 'books', 'home', 'sports'];
  searchTerm = '';
  selectedCategory = 'all';

  constructor(private productService: ProductService) {
    this.products$ = this.productService.getProducts();
    
    // Combine products with search and category filters
    this.filteredProducts$ = combineLatest([
      this.products$,
      this.searchTerm$.pipe(startWith('')),
      this.selectedCategory$.pipe(startWith('all'))
    ]).pipe(
      map(([products, search, category]) => {
        return products.filter(product => {
          const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) ||
                               product.description.toLowerCase().includes(search.toLowerCase());
          const matchesCategory = category === 'all' || product.category === category;
          return matchesSearch && matchesCategory;
        });
      })
    );
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

  onSearchChange(term: string): void {
    this.searchTerm$.next(term);
  }

  onCategoryChange(category: string): void {
    this.selectedCategory$.next(category);
  }

  trackByProductId(index: number, product: Product): number {
    return product.id;
  }

}
