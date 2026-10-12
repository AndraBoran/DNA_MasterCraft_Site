import { useState } from 'react';

export default function GuestHomeView({ products, onAddToCart }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('default');

  const categories = ['All', ...new Set(products.map((p) => p.category).filter(Boolean))];

  const displayedProducts = products
    .filter((p) => {
      const matchCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const matchSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchCategory && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return parseFloat(a.price) - parseFloat(b.price);
      if (sortBy === 'price-desc') return parseFloat(b.price) - parseFloat(a.price);
      return 0;
    });

  return (
    <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
      {/* BANNER PREZENTARE */}
      <div style={{
        background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
        color: '#fff',
        padding: '36px 32px',
        borderRadius: '16px',
        marginBottom: '32px',
        boxShadow: '0 4px 20px rgba(2, 132, 199, 0.15)'
      }}>
        <h2 style={{ margin: '0 0 10px 0', fontSize: '28px', fontWeight: '800' }}>
          Personalizări Laser de Înaltă Precizie
        </h2>
        <p style={{ margin: 0, fontSize: '15px', color: '#e0f2fe', maxWidth: '600px', lineHeight: '1.5' }}>
          Gravură profesională pe piele naturală, ardezie, piatră și metale. Transformă fiecare produs într-o amintire unică.
        </p>
      </div>

      {/* BARA DE FILTRE, CĂUTARE ȘI SORTARE */}
      <div style={{
        background: '#fff',
        padding: '16px 20px',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        marginBottom: '28px',
        display: 'flex',
        gap: '16px',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap'
      }}>
        <input
          type="text"
          placeholder="Caută produse..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '9px 14px',
            borderRadius: '6px',
            border: '1px solid #cbd5e1',
            minWidth: '220px',
            fontSize: '14px'
          }}
        />

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              style={{
                padding: '6px 14px',
                borderRadius: '16px',
                border: selectedCategory === c ? '1px solid #0ea5e9' : '1px solid #e2e8f0',
                background: selectedCategory === c ? '#e0f2fe' : '#fff',
                color: selectedCategory === c ? '#0369a1' : '#475569',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: selectedCategory === c ? '600' : '500'
              }}
            >
              {c}
            </button>
          ))}
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{ padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' }}
        >
          <option value="default">Sortare: Standard</option>
          <option value="price-asc">Preț: Mic → Mare</option>
          <option value="price-desc">Preț: Mare → Mic</option>
        </select>
      </div>

      {/* GRILA DE PRODUSE */}
      {displayedProducts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
          Nu a fost găsit niciun produs conform filtrelor selectate.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {displayedProducts.map((p) => (
            <div
              key={p.id}
              style={{
                background: '#fff',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease'
              }}
            >
              <div style={{ height: '210px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {p.image_url ? (
                  <img
                    src={`/${p.image_url}`}
                    alt={p.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <span style={{ color: '#94a3b8', fontSize: '13px' }}>Fără imagine</span>
                )}
              </div>

              <div style={{ padding: '18px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#0ea5e9', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {p.category}
                </span>
                <h4 style={{ margin: '6px 0 8px 0', fontSize: '17px', fontWeight: '700' }}>{p.name}</h4>
                <p style={{ fontSize: '13px', color: '#64748b', flexGrow: 1, margin: '0 0 16px 0', lineHeight: '1.4' }}>
                  {p.description}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                  <div>
                    <div style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>{p.price} RON</div>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>Stoc: {p.stock ?? 0} buc.</span>
                  </div>
                  <button
                    onClick={() => onAddToCart(p)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '6px',
                      border: 'none',
                      background: '#0ea5e9',
                      color: '#fff',
                      fontWeight: '600',
                      fontSize: '13px',
                      cursor: 'pointer'
                    }}
                  >
                    + În Coș
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}