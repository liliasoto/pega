'use client'

import React, { useState, useEffect } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
}

const buttonStyle: React.CSSProperties = {
  padding: '10px 15px',
  margin: '5px',
  backgroundColor: '#0070f3',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

const inputStyle: React.CSSProperties = {
  margin: '5px',
  padding: '10px',
  width: '100%',
  borderRadius: '5px',
  border: '1px solid #ccc',
};

const formStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  maxWidth: '300px',
  margin: '20px 0',
};

const productCardStyle: React.CSSProperties = {
  border: '1px solid #ccc',
  borderRadius: '5px',
  padding: '15px',
  margin: '10px 0',
};

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({ name: '', price: 0, description: '' });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const API_URL = 'https://mi-backend-productos.onrender.com/api/products'; // Cambia esto a tu URL de producción cuando despliegues

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingProduct ? 'PUT' : 'POST';
      const url = editingProduct ? `${API_URL}/${editingProduct.id}` : API_URL;
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      setNewProduct({ name: '', price: 0, description: '' });
      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
      console.error('Error submitting product:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setNewProduct({ name: product.name, price: product.price, description: product.description });
  };

  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '20px 0' }}>Lista de Productos</h1>
      <form onSubmit={handleSubmit} style={formStyle}>
        <input
          type="text"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          placeholder="Nombre del producto"
          style={inputStyle}
          required
        />
        <input
          type="number"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
          placeholder="Precio"
          style={inputStyle}
          required
        />
        <textarea
          value={newProduct.description}
          onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
          placeholder="Descripción"
          style={inputStyle}
          required
        />
        <button type="submit" style={buttonStyle}>
          {editingProduct ? 'Actualizar' : 'Agregar'} Producto
        </button>
      </form>
      <div>
        {products.map((product) => (
          <div key={product.id} style={productCardStyle}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>{product.name}</h3>
            <p>Precio: ${product.price}</p>
            <p>{product.description}</p>
            <button onClick={() => handleEdit(product)} style={buttonStyle}>
              Editar
            </button>
            <button onClick={() => handleDelete(product.id)} style={{...buttonStyle, backgroundColor: '#ff4040'}}>
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}