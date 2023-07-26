const express = require('express');
const bodyParser = require('body-parser');
const ProductManager = require('./ProductManager');
const app = express();
app.use(bodyParser.json());

const path = require('path');
const filePath = path.join(__dirname, 'data', 'productos.json');
console.log('Ruta absoluta:', filePath);

const productManager = new ProductManager(filePath);
app.get('/products', (req, res) => {
  const products = productManager.getProducts();
  res.json(products);
});

app.post('/products', (req, res) => {
  try {
    const newProduct = req.body; 
    productManager.addProduct(newProduct);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ error: error.message }); 
  }
});

app.get('/products/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  try {
    const product = productManager.getProductById(productId);
    res.json(product);
  } catch (error) {
    res.status(404).json({ error: 'Product not found' }); 
  }
});

app.put('/products/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const updatedProduct = req.body; 
  try {
    productManager.updateProduct(productId, updatedProduct);
    res.json(updatedProduct);
  } catch (error) {
    res.status(404).json({ error: 'Product not found' }); 
  }
});

app.delete('/products/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  try {
    productManager.deleteProduct(productId);
    res.sendStatus(204); 
  } catch (error) {
    res.status(404).json({ error: 'Product not found' });
  }
});

const port = 8080;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});