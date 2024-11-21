'use client'

import React, { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  phoneNumber: string;
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

const userCardStyle: React.CSSProperties = {
  border: '1px solid #ccc',
  borderRadius: '5px',
  padding: '15px',
  margin: '10px 0',
};

export default function UserForm() {
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState<Omit<User, 'id'>>({ name: '', phoneNumber: '' });
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const API_URL = 'https://mi-backend-productos.onrender.com/api/users';

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingUser ? 'PUT' : 'POST';
      const url = editingUser ? `${API_URL}/${editingUser.id}` : API_URL;
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setNewUser({ name: '', phoneNumber: '' });
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      console.error('Error submitting user:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setNewUser({ name: user.name, phoneNumber: user.phoneNumber });
  };

  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '20px 0' }}>Gestión de Usuarios</h1>
      <form onSubmit={handleSubmit} style={formStyle}>
        <input
          type="text"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          placeholder="Nombre del usuario"
          style={inputStyle}
          required
        />
        <input
          type="tel"
          value={newUser.phoneNumber}
          onChange={(e) => setNewUser({ ...newUser, phoneNumber: e.target.value })}
          placeholder="Número de teléfono"
          style={inputStyle}
          required
        />
        <button type="submit" style={buttonStyle}>
          {editingUser ? 'Actualizar' : 'Agregar'} Usuario
        </button>
      </form>
      <div>
        {users.map((user) => (
          <div key={user.id} style={userCardStyle}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>{user.name}</h3>
            <p>Teléfono: {user.phoneNumber}</p>
            <button onClick={() => handleEdit(user)} style={buttonStyle}>
              Editar
            </button>
            <button onClick={() => handleDelete(user.id)} style={{...buttonStyle, backgroundColor: '#ff4040'}}>
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}