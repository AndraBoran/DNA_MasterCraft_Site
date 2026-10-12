export default function EditProductModal({
  product,
  setProduct,
  onSave,
  onCancel
}) {
  if (!product) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 85 }}>
      <div style={{ background: '#fff', padding: '24px', borderRadius: '10px', width: '100%', maxWidth: '440px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
        <h3 style={{ marginTop: 0, marginBottom: '16px' }}>Editează Produsul</h3>

        <form onSubmit={onSave} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input
            value={product.name}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
            placeholder="Nume produs"
            required
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
          />

          <input
            value={product.category}
            onChange={(e) => setProduct({ ...product, category: e.target.value })}
            placeholder="Categorie"
            required
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
          />

          <input
            type="number"
            step="0.01"
            value={product.price}
            onChange={(e) => setProduct({ ...product, price: e.target.value })}
            placeholder="Preț de bază (RON)"
            required
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
          />

          <textarea
            value={product.description || ''}
            onChange={(e) => setProduct({ ...product, description: e.target.value })}
            placeholder="Descriere detaliată"
            rows="3"
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', resize: 'vertical' }}
          />

          <input
            value={product.image_url || ''}
            onChange={(e) => setProduct({ ...product, image_url: e.target.value })}
            placeholder="Nume fișier imagine (ex: card_portofel.jpg)"
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
          />

          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button
              type="submit"
              style={{ flex: 1, padding: '9px', background: '#0ea5e9', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}
            >
              Salvează Modificările
            </button>
            <button
              type="button"
              onClick={onCancel}
              style={{ padding: '9px 14px', border: '1px solid #cbd5e1', background: '#fff', borderRadius: '6px', cursor: 'pointer' }}
            >
              Anulează
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}