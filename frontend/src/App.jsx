import { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:8080';

export default function App() {
  // Stări Produse & Filtrare
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Toate');
  const [sortBy, setSortBy] = useState('default');

  // Stare Autentificare
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('user_session');
    return saved ? JSON.parse(saved) : null;
  });
  const [authView, setAuthView] = useState('none'); // 'none' | 'login' | 'register'
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });
  const [authMsg, setAuthMsg] = useState({ type: '', text: '' });

  // Stare Formular Admin (Adăugare Produs)
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    text_engraving_price: '',
    image_engraving_price: '',
    stock: '',
    image_url: ''
  });

  // Citire Produse din MySQL
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE}/products.php`);
      const result = await res.json();
      if (result.status === 'success') {
        setProducts(result.data);
      }
    } catch (err) {
      console.error('Eroare la preluarea produselor:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Autentificare (Login)
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

  // Înregistrare (Register)
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
        setAuthMsg({ type: 'success', text: 'Cont creat! Te poți autentifica acum.' });
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

  // Adăugare Produs (Admin)
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/create_product.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newProduct,
          price: parseFloat(newProduct.price) || 0
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
      console.error('Eroare la adăugare:', err);
    }
  };

  // Ștergere Produs (Admin)
  const handleDeleteProduct = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/delete_product.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const result = await res.json();
      if (result.status === 'success') {
        fetchProducts();
      }
    } catch (err) {
      console.error('Eroare la ștergere:', err);
    }
  };

  // Categorii unice pentru filtrare
  const categories = ['Toate', ...new Set(products.map((p) => p.category).filter(Boolean))];

  // Aplicare Filtrare și Sortare
  const displayedProducts = products
    .filter((p) => {
      const matchCategory = selectedCategory === 'Toate' || p.category === selectedCategory;
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {currentUser ? (
              <>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '14px', fontWeight: '600' }}>{currentUser.name}</div>
                  <span style={{ fontSize: '11px', textTransform: 'uppercase', padding: '2px 8px', borderRadius: '12px', background: currentUser.role === 'admin' ? '#fef3c7' : '#e0f2fe', color: currentUser.role === 'admin' ? '#92400e' : '#0369a1', fontWeight: '700' }}>
                    {currentUser.role}
                  </span>
                </div>
                <button onClick={handleLogout} style={{ padding: '8px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer', fontSize: '13px' }}>
                  Deconectare
                </button>
              </>
            ) : (
              <>
                <button onClick={() => { setAuthView('login'); setAuthMsg({ type: '', text: '' }); }} style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}>
                  Autentificare
                </button>
                <button onClick={() => { setAuthView('register'); setAuthMsg({ type: '', text: '' }); }} style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: '#0ea5e9', color: '#fff', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}>
                  Cont Nou
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* MODAL AUTENTIFICARE / ÎNREGISTRARE */}
      {authView !== 'none' && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
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
                  placeholder="Nume complet"
                  required
                  value={authForm.name}
                  onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                  style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              )}
              <input
                type="email"
                placeholder="Email"
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
                {authView === 'login' ? 'Conectează-te' : 'Înregistrează-te'}
              </button>

              <button type="button" onClick={() => setAuthView('none')} style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '13px' }}>
                Anulează
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CONȚINUT PRINCIPAL */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        {/* ZONA DE ADMIN (Vizibilă exclusiv pentru rolul 'admin') */}
        {currentUser?.role === 'admin' && (
          <div style={{ background: '#fff', border: '1px solid #fde68a', borderRadius: '12px', padding: '24px', marginBottom: '32px' }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#92400e', fontSize: '18px' }}>Panou Administrator: Adaugă Produs</h3>
            <form onSubmit={handleAddProduct} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              <input placeholder="Nume" required value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              <input placeholder="Categorie" required value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              <input type="number" step="0.01" placeholder="Preț Bază (RON)" required value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              <input type="text" placeholder="Descriere" value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              <input placeholder="Nume fișier imagine (ex: semn_lemn.jpg)" value={newProduct.image_url} onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })} style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              <button type="submit" style={{ padding: '10px', borderRadius: '6px', border: 'none', background: '#059669', color: '#fff', fontWeight: '600', cursor: 'pointer' }}>
                + Salvează Produs
              </button>
            </form>
          </div>
        )}

        {/* BARA DE FILTRARE, CĂUTARE ȘI SORTARE */}
        <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '28px', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Căutare */}
          <input
            type="text"
            placeholder="Caută produse..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', minWidth: '240px', fontSize: '14px' }}
          />

          {/* Categorii */}
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

          {/* Sortare */}
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

        {/* GRID PRODUSE E-COMMERCE */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {displayedProducts.length === 0 ? (
            <p style={{ color: '#64748b' }}>Niciun produs găsit conform filtrelor selectate.</p>
          ) : (
            displayedProducts.map((p) => (
              <div
                key={p.id}
                style={{
                  background: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                }}
              >
                {/* Zona Vizuală Produs cu Poză Reală */}
                <div style={{ height: '200px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderBottom: '1px solid #f1f5f9' }}>
                  {p.image_url ? (
                    <img 
                      src={`/${p.image_url}`} 
                      alt={p.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        if (e.target.parentNode) {
                          e.target.parentNode.innerHTML = '<span style="color: #94a3b8; font-size: 13px;">Poză indisponibilă</span>';
                        }
                      }}
                    />
                  ) : (
                    <span style={{ color: '#94a3b8', fontSize: '13px' }}>Fără imagine</span>
                  )}
                </div>

                {/* Conținut Card */}
                <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: '#0ea5e9', letterSpacing: '0.5px' }}>
                      {p.category}
                    </span>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Stoc: {p.stock} buc.</span>
                  </div>

                  <h4 style={{ margin: '0 0 8px 0', fontSize: '17px', fontWeight: '600', color: '#0f172a' }}>{p.name}</h4>
                  <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: '#64748b', lineHeight: '1.4', flexGrow: 1 }}>
                    {p.description}
                  </p>

                  <div style={{ background: '#f8fafc', padding: '8px 10px', borderRadius: '6px', fontSize: '12px', color: '#475569', marginBottom: '16px' }}>
                    <div>Gravură text: <b>+{p.text_engraving_price} RON</b></div>
                    <div>Gravură imagine: <b>+{p.image_engraving_price} RON</b></div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                    <div style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>
                      {p.price} <span style={{ fontSize: '12px', fontWeight: '500' }}>RON</span>
                    </div>

                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button style={{ padding: '8px 14px', borderRadius: '6px', border: 'none', background: '#0ea5e9', color: '#fff', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
                        Personalizează
                      </button>

                      {currentUser?.role === 'admin' && (
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          style={{ padding: '8px 10px', borderRadius: '6px', border: '1px solid #fee2e2', background: '#fff', color: '#dc2626', fontSize: '13px', cursor: 'pointer' }}
                        >
                          ✕
                        </button>
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