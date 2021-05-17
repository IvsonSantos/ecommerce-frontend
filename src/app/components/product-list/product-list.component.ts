import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/commom/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[];
  currentCategoryId: number;
  previousCategoryId: number = 1;
  currentCategoryName: string;
  searchMode: boolean;

  // new properties for pagination
  pageNumber: number = 1;
  pageSize: number = 5;
  totalElements: number = 0;

  previousKeyword: string = null;
  

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
    this.listProducts();
  }

  listProducts() {

    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if (this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }
  }

  handleSearchProducts() {
    const parameterKeyword: string = this.route.snapshot.paramMap.get('keyword');  

    // if we have a different keyword as previous, set page to 1
    if (this.previousKeyword != parameterKeyword) {
      this.pageNumber = 1;
    }

    this.previousKeyword = parameterKeyword;

    console.log(`keyword=${parameterKeyword}, pageNumber=${this.pageNumber}`);

    this.productService.searchProductsPaginate(this.pageNumber - 1, this.pageSize, parameterKeyword)
                       .subscribe(this.processResult());

  }

  handleListProducts() {
    // check if ID param is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      // is returnet as STRING so we use + to convert to a number
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id');

      // get the "name" param string
      this.currentCategoryName = this.route.snapshot.paramMap.get('name');
    } else {
      this.currentCategoryId = 1;
      this.currentCategoryName = 'Books';
    }

    // check if we have a diferent category ID than the previous

    // if we have a diferent category, need to set the pagenumber back to 1
    if (this.previousCategoryId != this.currentCategoryId) {
      this.pageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;

    console.log(`currentCategoryId=${this.currentCategoryId}, pageNumber=${this.pageNumber}`);

    // get the products for the category
    this.productService.getProductListPaginate(this.pageNumber - 1, 
                                               this.pageSize,
                                               this.currentCategoryId)
                                               .subscribe(this.processResult());
  }

  processResult() {
    return data => {
      this.products = data._embedded.products;
      this.pageNumber = data.page.number + 1;
      this.pageSize = data.page.size;
      this.totalElements = data.page.totalElements;
    }
  }

  updatePageSize(pageSize: number) {
    this.pageSize = pageSize;
    this.pageNumber = 1;
    this.listProducts();
  }

  addToCart(product: Product) {
    console.log(`Adding to cart: ${product.name}, ${product.unitPrice}`);
  }

}
