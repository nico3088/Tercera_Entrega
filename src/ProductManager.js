const fs = require('fs');

class ProductManager {
  constructor(path) {
    this.path = path;
    this.products = [];
    this.nextProductId = 1;
    this.loadProductsFromFile();
  }

  addProduct(product) {
    if (!this.isProductValid(product)) {
      throw new Error('Error: Todos los campos del producto son obligatorios');
    }

    if (this.isCodeRepeated(product.code)) {
      throw new Error('Error: El código del producto ya está en uso');
    }

    const newProduct = { ...product, id: this.nextProductId++ };
    this.products.push(newProduct);
    this.saveProductsToFile();
    console.log('Producto agregado:', newProduct);
  }

  getProducts() {
    return this.products;
  }

  getProductById(id) {
    const product = this.products.find(product => product.id === id);
    if (product) {
      return product;
    } else {
      throw new Error('Not found');
    }
  }

  updateProduct(id, updatedFields) {
    const productIndex = this.products.findIndex(product => product.id === id);
    if (productIndex !== -1) {
      const updatedProduct = { ...this.products[productIndex], ...updatedFields };
      this.products[productIndex] = updatedProduct;
      this.saveProductsToFile();
      console.log('Producto actualizado:', updatedProduct);
    } else {
      throw new Error('Not found');
    }
  }

  deleteProduct(id) {
    const productIndex = this.products.findIndex(product => product.id === id);
    if (productIndex !== -1) {
      const deletedProduct = this.products.splice(productIndex, 1)[0];
      this.saveProductsToFile();
      console.log('Producto eliminado:', deletedProduct);
    } else {
      throw new Error('Not found');
    }
  }

  isProductValid(product) {
    return (
      product.title &&
      product.description &&
      product.price &&
      product.thumbnail &&
      product.code &&
      product.stock
    );
  }

  isCodeRepeated(code) {
    return this.products.some(product => product.code === code);
  }
  loadProductsFromFile() {
    try {
      const data = fs.readFileSync(this.path, 'utf8');
      if (data) {
        this.products = JSON.parse(data);
        if (this.products.length > 0) {
          this.nextProductId = Math.max(...this.products.map(product => product.id)) + 1;
        }
      } else {
        this.products = [];
      }
    } catch (error) {
      console.log('Error:', error.message);
      this.products = [];
    }
  }
  saveProductsToFile() {
    try {
      fs.writeFileSync(this.path, JSON.stringify(this.products), 'utf8');
    } catch (error) {
      console.log('Error:', error.message);
    }
  }
}

module.exports = ProductManager;