export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  totalPrice,
  totalCount,
  onProceedToCheckout
}) {
  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'flex-end', zIndex: 70 }}>
      <div style={{ width: '100%', maxWidth: '400px', background: '#fff', height: '100%', display: 'flex', flexDirection: 'column', boxShadow: '-4px 0 20px rgba(0,0,0,0.1)' }}>
        <div style={{ padding: '18px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '18px' }}>Coșul Tău ({totalCount})</h3>
          <button onClick={onClose} style={{ border: 'none', background: 'transparent', fontSize: '20px', cursor: 'pointer' }}>✕</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {cart.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#64748b', marginTop: '40px' }}>Coșul este gol.</p>
          ) : (
            cart.map((item) => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '14px' }}>{item.name}</div>
                  <div style={{ fontSize: '13px', color: '#0ea5e9', fontWeight: '600' }}>{item.price} RON</div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button onClick={() => onUpdateQuantity(item.id, -1)} style={{ width: '26px', height: '26px', border: '1px solid #cbd5e1', background: '#fff', borderRadius: '4px', cursor: 'pointer' }}>-</button>
                  <span style={{ fontSize: '14px', fontWeight: '600' }}>{item.quantity}</span>
                  <button onClick={() => onUpdateQuantity(item.id, 1)} style={{ width: '26px', height: '26px', border: '1px solid #cbd5e1', background: '#fff', borderRadius: '4px', cursor: 'pointer' }}>+</button>
                  <button onClick={() => onRemoveItem(item.id)} style={{ border: 'none', color: '#ef4444', background: 'transparent', cursor: 'pointer', marginLeft: '6px' }}>✕</button>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div style={{ padding: '20px', borderTop: '1px solid #e2e8f0', background: '#f8fafc' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px', fontSize: '16px', fontWeight: '700' }}>
              <span>Total:</span>
              <span>{totalPrice.toFixed(2)} RON</span>
            </div>
            <button
              onClick={onProceedToCheckout}
              style={{ width: '100%', padding: '12px', background: '#059669', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '700', fontSize: '15px', cursor: 'pointer' }}
            >
              Finalizează Comanda
            </button>
          </div>
        )}
      </div>
    </div>
  );
}