export default function ClientDashboardView({ currentUser, orders, onGoToStore }) {
  return (
    <main style={{ maxWidth: '960px', margin: '0 auto', padding: '36px 24px' }}>
      {/* HEADER CONT */}
      <div style={{
        background: '#fff',
        padding: '24px 28px',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        marginBottom: '28px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h2 style={{ margin: '0 0 6px 0', fontSize: '22px', fontWeight: '800' }}>
            Bun venit, {currentUser?.name}!
          </h2>
          <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>
            Email cont: <strong>{currentUser?.email}</strong> | Rol: <span style={{ textTransform: 'capitalize' }}>{currentUser?.role}</span>
          </p>
        </div>

        <button
          onClick={onGoToStore}
          style={{
            padding: '9px 16px',
            borderRadius: '6px',
            border: 'none',
            background: '#0ea5e9',
            color: '#fff',
            fontWeight: '600',
            fontSize: '13px',
            cursor: 'pointer'
          }}
        >
          🏪 Înapoi la Cumpărături
        </button>
      </div>

      {/* SECȚIUNEA COMENZI */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: '700' }}>
          Istoricul Comenzilor Mele
        </h3>
        <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>
          Urmărește statusul și produsele fiecărei comenzi plasate pe MasterCraft DNA.
        </p>
      </div>

      {orders.length === 0 ? (
        <div style={{
          background: '#fff',
          padding: '48px 24px',
          textAlign: 'center',
          borderRadius: '12px',
          border: '1px dashed #cbd5e1',
          color: '#64748b'
        }}>
          <p style={{ margin: '0 0 12px 0', fontSize: '15px' }}>Nu ai plasat nicio comandă până în acest moment.</p>
          <button
            onClick={onGoToStore}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              background: '#fff',
              color: '#0284c7',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Explorează Catalogul
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {orders.map((ord) => {
            const isPending = ord.status === 'Pending';
            return (
              <div
                key={ord.id}
                style={{
                  background: '#fff',
                  padding: '20px 24px',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontWeight: '800', fontSize: '16px' }}>Comanda #{ord.id}</span>
                    <span style={{
                      fontSize: '11px',
                      padding: '3px 8px',
                      borderRadius: '12px',
                      fontWeight: '700',
                      background: isPending ? '#fef3c7' : '#dcfce7',
                      color: isPending ? '#b45309' : '#15803d'
                    }}>
                      {ord.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                    Data plasării: {ord.created_at}
                  </div>
                  {ord.shipping_address && (
                    <div style={{ fontSize: '12px', color: '#475569', marginTop: '2px' }}>
                      Adresă livrare: {ord.shipping_address}
                    </div>
                  )}
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '18px', fontWeight: '800', color: '#0ea5e9' }}>
                    {parseFloat(ord.total_price).toFixed(2)} RON
                  </div>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>Procesată de atelier</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}