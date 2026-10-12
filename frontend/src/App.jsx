import { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:8080';

export default function App() {
  // Products & Filter States
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('default');

  // Authentication State
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('user_session');
    return saved ? JSON.parse(saved) : null;
  });
  const [authView, setAuthView] = useState('none'); // 'none' | 'login' | 'register'
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });
  const [authMsg, setAuthMsg] = useState({ type: '', text: '' });

  // Shopping Cart State (saved in localStorage for guests and users alike)
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('mastercraft_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Sync cart to localStorage
  useEffect(() => {
    localStorage.setItem('mastercraft_cart', JSON.stringify(cart));
  }, [cart]);

  // Admin New Product Form State
  const [newProduct, setNewProduct] = useState({
    name: '', category: '', price: '', description: '',
    text_engraving_price: '', image_engraving_price: '', stock: '', image_url: ''
  });

  // Admin Edit Product Modal State
  const [editingProduct, setEditingProduct] = useState(null);

  // Fetch Products from MySQL API
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE}/products.php`);
      const result = await res.json();
      if (result.status === 'success') {
        setProducts(result.data);
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Cart operations
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prevCart,
        {
          id: product.id,
          name: product.name,
          price: parseFloat(product.price),
          image_url: product.image_url,
          quantity: 1,
          customization: 'Standard (Fără gravură specificată)'
        }
      ];
    });
    setIsCartOpen(true);
  };

  const updateCartQuantity = (productId, delta) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const totalCartPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Checkout Handler: trimite comanda in baza de date
  const handleProceedToCheckout = async () => {
    if (!currentUser) {
      setIsCartOpen(false);
      setAuthView('login');
      setAuthMsg({
        type: 'error',
        text: 'Trebuie să fii conectat(ă) în cont pentru a putea plasa comanda!'
      });
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/create_order.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: currentUser.id,
          total_price: totalCartPrice,
          shipping_address: 'Timișoara, România',
          items: cart
        })
      });

      const data = await res.json();
      if (data.status === 'success') {
        alert(`Felicitări, ${currentUser.name}! Comanda #${data.order_id} a fost plasată cu succes!`);
        setCart([]); // Golim cosul
        setIsCartOpen(false);
      } else {
        alert(`Eroare la plasare: ${data.message}`);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Eroare la conectarea cu serverul pentru plasarea comenzii.');
    }
  };
  
  // Auth Handlers
  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthMsg({ type: '', text: '' });
    try {
      const res = await fetch(`${API_BASE}/login.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authForm.email, password: authForm.password })
      });
      const data = await res.json();
      if (data.status === 'success') {
        setCurrentUser(data.user);
        localStorage.setItem('user_session', JSON.stringify(data.user));
        setAuthView('none');
        setAuthForm({ name: '', email: '', password: '' });
      } else {
        setAuthMsg({ type: 'error', text: data.message });
      }
    } catch {
      setAuthMsg({ type: 'error', text: 'Eroare de conexiune la server.' });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setAuthMsg({ type: '', text: '' });
    try {
      const res = await fetch(`${API_BASE}/register.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authForm)
      });
      const data = await res.json();
      if (data.status === 'success') {
        setAuthMsg({ type: 'success', text: 'Cont creat cu succes! Te poți autentifica.' });
        setTimeout(() => setAuthView('login'), 1500);
      } else {
        setAuthMsg({ type: 'error', text: data.message });
      }
    } catch {
      setAuthMsg({ type: 'error', text: 'Eroare de conexiune la server.' });
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('user_session');
  };

  // Admin Handlers
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/create_product.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newProduct,
          price: parseFloat(newProduct.price) || 0,
          text_engraving_price: parseFloat(newProduct.text_engraving_price) || 0,
          image_engraving_price: parseFloat(newProduct.image_engraving_price) || 0,
          stock: parseInt(newProduct.stock) || 0
        })
      });
      const result = await res.json();
      if (result.status === 'success') {
        setNewProduct({
          name: '', category: '', price: '', description: '',
          text_engraving_price: '', image_engraving_price: '', stock: '', image_url: ''
        });
        fetchProducts();
      }
    } catch (err) {
      console.error('Failed to create product:', err);
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/update_product.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editingProduct,
          price: parseFloat(editingProduct.price) || 0,
          text_engraving_price: parseFloat(editingProduct.text_engraving_price) || 0,
          image_engraving_price: parseFloat(editingProduct.image_engraving_price) || 0,
          stock: parseInt(editingProduct.stock) || 0
        })
      });
      const result = await res.json();
      if (result.status === 'success') {
        setEditingProduct(null);
        fetchProducts();
      } else {
        alert(result.message || 'Update failed');
      }
    } catch (err) {
      console.error('Failed to update product:', err);
    }
  };

  const handleDeleteProduct = async (product) => {
    const confirmed = window.confirm(`Ești sigur(ă) că vrei să ștergi produsul "${product.name}"?`);
    if (!confirmed) return;

    try {
      const res = await fetch(`${API_BASE}/delete_product.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: product.id })
      });
      const result = await res.json();
      if (result.status === 'success') {
        fetchProducts();
      }
    } catch (err) {
      console.error('Failed to delete product:', err);
    }
  };

  // Categories & Filtering
  const categories = ['All', ...new Set(products.map((p) => p.category).filter(Boolean))];

  const displayedProducts = products
    .filter((p) => {
      const matchCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.description?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCategory && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return parseFloat(a.price) - parseFloat(b.price);
      if (sortBy === 'price-desc') return parseFloat(b.price) - parseFloat(a.price);
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      return 0;
    });

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* NAVBAR */}
      <header style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '700', letterSpacing: '-0.5px' }}>
              MasterCraft <span style={{ color: '#0ea5e9' }}>DNA</span>
            </h1>
            <span style={{ fontSize: '12px', color: '#64748b' }}>Custom Laser Engraving</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {/* CART BUTTON */}
            <button
              onClick={() => setIsCartOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 14px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: '#fff',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '14px'
              }}
            >
              <span>🛒 Coș</span>
              <span style={{ background: '#0ea5e9', color: '#fff', borderRadius: '12px', padding: '2px 8px', fontSize: '12px' }}>
                {totalCartCount}
              </span>
            </button>

            {/* AUTH SECTION */}
            {currentUser ? (
              <>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '14px', fontWeight: '600' }}>{currentUser.name}</div>
                  <span style={{ fontSize: '11px', textTransform: 'uppercase', padding: '2px 8px', borderRadius: '12px', background: currentUser.role === 'admin' ? '#fef3c7' : '#e0f2fe', color: currentUser.role === 'admin' ? '#92400e' : '#0369a1', fontWeight: '700' }}>
                    {currentUser.role}
                  </span>
                </div>
                <button onClick={handleLogout} style={{ padding: '8px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer', fontSize: '13px' }}>
                  Log Out
                </button>
              </>
            ) : (
              <>
                <button onClick={() => { setAuthView('login'); setAuthMsg({ type: '', text: '' }); }} style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}>
                  Sign In
                </button>
                <button onClick={() => { setAuthView('register'); setAuthMsg({ type: '', text: '' }); }} style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: '#0ea5e9', color: '#fff', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}>
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* SHOPPING CART DRAWER / MODAL */}
      {isCartOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'flex-end', zIndex: 70 }}>
          <div style={{ width: '100%', maxWidth: '420px', background: '#fff', height: '100%', display: 'flex', flexDirection: 'column', boxShadow: '-5px 0 25px rgba(0,0,0,0.15)' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '18px' }}>Coșul tău ({totalCartCount})</h3>
              <button onClick={() => setIsCartOpen(false)} style={{ background: 'transparent', border: 'none', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {cart.length === 0 ? (
                <p style={{ color: '#64748b', textAlign: 'center', marginTop: '40px' }}>Coșul tău este gol.</p>
              ) : (
                cart.map((item) => (
                  <div key={item.id} style={{ display: 'flex', gap: '12px', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9', alignItems: 'center' }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '6px', background: '#f8fafc', overflow: 'hidden', flexShrink: 0 }}>
                      {item.image_url && <img src={`/${item.image_url}`} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '600', fontSize: '14px' }}>{item.name}</div>
                      <div style={{ fontSize: '13px', color: '#0ea5e9', fontWeight: '600' }}>{item.price} RON</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                        <button onClick={() => updateCartQuantity(item.id, -1)} style={{ width: '24px', height: '24px', border: '1px solid #cbd5e1', background: '#fff', borderRadius: '4px', cursor: 'pointer' }}>-</button>
                        <span style={{ fontSize: '13px', fontWeight: '600' }}>{item.quantity}</span>
                        <button onClick={() => updateCartQuantity(item.id, 1)} style={{ width: '24px', height: '24px', border: '1px solid #cbd5e1', background: '#fff', borderRadius: '4px', cursor: 'pointer' }}>+</button>
                        <button onClick={() => removeFromCart(item.id)} style={{ marginLeft: 'auto', background: 'transparent', border: 'none', color: '#ef4444', fontSize: '12px', cursor: 'pointer' }}>Șterge</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div style={{ padding: '20px', borderTop: '1px solid #e2e8f0', background: '#f8fafc' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '16px', fontWeight: '700' }}>
                  <span>Total estimat:</span>
                  <span>{totalCartPrice.toFixed(2)} RON</span>
                </div>
                <button
                  onClick={handleProceedToCheckout}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', background: '#059669', color: '#fff', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}
                >
                  Finalizează Comanda (Checkout)
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* AUTH MODAL */}
      {authView !== 'none' && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 80 }}>
          <div style={{ background: '#fff', padding: '32px', borderRadius: '12px', width: '100%', maxWidth: '380px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '20px' }}>
              {authView === 'login' ? 'Autentificare' : 'Creare Cont'}
            </h3>

            {authMsg.text && (
              <div style={{ padding: '10px', borderRadius: '6px', marginBottom: '14px', fontSize: '13px', background: authMsg.type === 'error' ? '#fee2e2' : '#dcfce7', color: authMsg.type === 'error' ? '#991b1b' : '#166534' }}>
                {authMsg.text}
              </div>
            )}

            <form onSubmit={authView === 'login' ? handleLogin : handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {authView === 'register' && (
                <input
                  type="text"
                  placeholder="Nume Complet"
                  required
                  value={authForm.name}
                  onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                  style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              )}
              <input
                type="email"
                placeholder="Adresă Email"
                required
                value={authForm.email}
                onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
              />
              <input
                type="password"
                placeholder="Parolă"
                required
                value={authForm.password}
                onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
              />

              <button type="submit" style={{ padding: '10px', borderRadius: '6px', border: 'none', background: '#0ea5e9', color: '#fff', fontWeight: '600', cursor: 'pointer', marginTop: '6px' }}>
                {authView === 'login' ? 'Conectare' : 'Înregistrare'}
              </button>

              <button type="button" onClick={() => setAuthView('none')} style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '13px' }}>
                Renunță
              </button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editingProduct && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60 }}>
          <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '20px' }}>Editare Produs</h3>
            <form onSubmit={handleUpdateProduct} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input type="text" required value={editingProduct.name} onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })} style={{ padding: '9px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              <input type="text" required value={editingProduct.category} onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })} style={{ padding: '9px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              <input type="number" step="0.01" required value={editingProduct.price} onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })} style={{ padding: '9px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              <textarea rows="3" value={editingProduct.description || ''} onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })} style={{ padding: '9px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              <input placeholder="Fișier imagine (ex: card_metal.jpg)" value={editingProduct.image_url || ''} onChange={(e) => setEditingProduct({ ...editingProduct, image_url: e.target.value })} style={{ padding: '9px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" style={{ flex: 1, padding: '10px', borderRadius: '6px', border: 'none', background: '#0ea5e9', color: '#fff', fontWeight: '600', cursor: 'pointer' }}>Salvează</button>
                <button type="button" onClick={() => setEditingProduct(null)} style={{ padding: '10px 16px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}>Anulează</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MAIN VIEW */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        {/* ADD PRODUCT INLINE FORM (ADMIN) */}
        {currentUser?.role === 'admin' && (
          <div style={{ background: '#fff', border: '1px solid #fde68a', borderRadius: '12px', padding: '24px', marginBottom: '32px' }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#92400e', fontSize: '18px' }}>Panou Administrator: Adaugă Produs Nou</h3>
            <form onSubmit={handleAddProduct} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              <input placeholder="Nume" required value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              <input placeholder="Categorie" required value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              <input type="number" step="0.01" placeholder="Preț Bază (RON)" required value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              <input type="text" placeholder="Descriere" value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              <input placeholder="Fișier imagine (ex: card_metal.jpg)" value={newProduct.image_url} onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })} style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              <button type="submit" style={{ padding: '10px', borderRadius: '6px', border: 'none', background: '#059669', color: '#fff', fontWeight: '600', cursor: 'pointer' }}>
                + Salvează Produs
              </button>
            </form>
          </div>
        )}

        {/* SEARCH & FILTERS */}
        <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '28px', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
          <input
            type="text"
            placeholder="Caută produse..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', minWidth: '240px', fontSize: '14px' }}
          />

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '20px',
                  border: selectedCategory === cat ? '1px solid #0ea5e9' : '1px solid #e2e8f0',
                  background: selectedCategory === cat ? '#e0f2fe' : '#fff',
                  color: selectedCategory === cat ? '#0369a1' : '#475569',
                  fontWeight: selectedCategory === cat ? '600' : '400',
                  cursor: 'pointer',
                  fontSize: '13px'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', background: '#fff', cursor: 'pointer' }}
          >
            <option value="default">Sortare: Implicită</option>
            <option value="price-asc">Preț: Crescător</option>
            <option value="price-desc">Preț: Descrescător</option>
            <option value="name-asc">Nume: A-Z</option>
          </select>
        </div>

        {/* PRODUCTS GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {displayedProducts.length === 0 ? (
            <p style={{ color: '#64748b' }}>Nu a fost găsit niciun produs.</p>
          ) : (
            displayedProducts.map((p) => (
              <div key={p.id} style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <div style={{ height: '200px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderBottom: '1px solid #f1f5f9' }}>
                  {p.image_url ? (
                    <img src={`/${p.image_url}`} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; }} />
                  ) : (
                    <span style={{ color: '#94a3b8', fontSize: '13px' }}>Fără imagine</span>
                  )}
                </div>

                <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: '#0ea5e9' }}>{p.category}</span>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Stoc: {p.stock} buc.</span>
                  </div>

                  <h4 style={{ margin: '0 0 8px 0', fontSize: '17px', fontWeight: '600' }}>{p.name}</h4>
                  <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: '#64748b', flexGrow: 1 }}>{p.description}</p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                    <div style={{ fontSize: '18px', fontWeight: '700' }}>{p.price} RON</div>

                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        onClick={() => addToCart(p)}
                        style={{ padding: '8px 12px', borderRadius: '6px', border: 'none', background: '#0ea5e9', color: '#fff', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
                      >
                        + În Coș
                      </button>

                      {currentUser?.role === 'admin' && (
                        <>
                          <button
                            onClick={() => setEditingProduct(p)}
                            style={{ padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f1f5f9', cursor: 'pointer' }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p)}
                            style={{ padding: '8px 10px', borderRadius: '6px', border: '1px solid #fee2e2', background: '#fff', color: '#dc2626', cursor: 'pointer' }}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}