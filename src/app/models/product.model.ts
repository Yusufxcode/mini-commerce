export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  inStock?: boolean;
  rating?: number;
  tags?: string[];
}
