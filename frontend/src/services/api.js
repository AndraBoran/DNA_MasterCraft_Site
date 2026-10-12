const API_BASE = 'http://localhost:8080';

export const api = {
  // PRODUSE
  getProducts: async () => {
    // Am modificat aici numele fișierului în products.php exact cum e pe serverul tău
    const res = await fetch(`${API_BASE}/products.php`);
    return res.json();
  },

  createProduct: async (productData) => {
    const res = await fetch(`${API_BASE}/create_product.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });
    return res.json();
  },

  updateProduct: async (productData) => {
    const res = await fetch(`${API_BASE}/update_product.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });
    return res.json();
  },

  deleteProduct: async (id) => {
    const res = await fetch(`${API_BASE}/delete_product.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    return res.json();
  },

  // AUTENTIFICARE
  login: async (credentials) => {
    const res = await fetch(`${API_BASE}/login.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return res.json();
  },

  register: async (userData) => {
    const res = await fetch(`${API_BASE}/register.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return res.json();
  },

  // COMENZI
  getOrders: async (userId = null) => {
    const url = userId 
      ? `${API_BASE}/get_orders.php?user_id=${userId}` 
      : `${API_BASE}/get_orders.php`;
    const res = await fetch(url);
    return res.json();
  },

  createOrder: async (orderData) => {
    const res = await fetch(`${API_BASE}/create_order.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    return res.json();
  },

  // UTILIZATORI (ADMIN)
  getUsers: async () => {
    const res = await fetch(`${API_BASE}/get_users.php`);
    return res.json();
  },

  updateUserRole: async (id, role) => {
    const res = await fetch(`${API_BASE}/update_user_role.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, role }),
    });
    return res.json();
  }
};