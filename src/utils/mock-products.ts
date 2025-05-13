export interface Product {
    id: number;
    name: string;
    category: 'Phones' | 'Laptops' | 'Accessories';
    price: number;
    stock: number;
  }
  
  export const mockProducts: Product[] = [
    { id: 1, name: 'iPhone 15',  category: 'Phones',      price: 1099, stock: 42 },
    { id: 2, name: 'Galaxy S24', category: 'Phones',      price: 999,  stock: 35 },
    { id: 3, name: 'MacBook Pro',category: 'Laptops',     price: 2199, stock: 12 },
    { id: 4, name: 'Dell XPS 13',category: 'Laptops',     price: 1499, stock: 20 },
    { id: 5, name: 'AirPods',    category: 'Accessories', price: 199,  stock: 80 },
  ];
  