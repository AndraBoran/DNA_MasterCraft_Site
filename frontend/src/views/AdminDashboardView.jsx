import { useState } from 'react';

export default function AdminDashboardView({
  products,
  orders,
  users = [],
  onUpdateRole,
  newProduct,
  setNewProduct,
  onAddProduct,
  onDeleteProduct,
  onStartEditProduct
}) {
  const [activeTab, setActiveTab] = useState('overview');

  const totalRevenue = orders.reduce((sum, ord) => sum + parseFloat(ord.total_price || 0), 0);
  const pendingOrders = orders.filter((o) => o.status === 'Pending').length;

  return (
    <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '800' }}>Panou de Control Administrator</h2>
          <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '14px' }}>MasterCraft DNA — Management Producție & Utilizatori</p>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('overview')}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              background: activeTab === 'overview' ? '#0ea5e9' : '#e2e8f0',
              color: activeTab === 'overview' ? '#fff' : '#475569',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            📊 Statistici
          </button>
          <button
            onClick={() => setActiveTab('products')}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              background: activeTab === 'products' ? '#0ea5e9' : '#e2e8f0',
              color: activeTab === 'products' ? '#fff' : '#475569',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            📦 Produse ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              background: activeTab === 'orders' ? '#0ea5e9' : '#e2e8f0',
              color: activeTab === 'orders' ? '#fff' : '#475569',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            📋 Comenzi ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              background: activeTab === 'users' ? '#0ea5e9' : '#e2e8f0',
              color: activeTab === 'users' ? '#fff' : '#475569',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            👥 Utilizatori ({users.length})
          </button>
        </div>
      </div>

      {/* TAB 1: METRICI RAPIDE */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '24px' }}>
          <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>TOTAL ÎNCASĂRI</div>
            <div style={{ fontSize: '26px', fontWeight: '800', color: '#059669', marginTop: '6px' }}>{totalRevenue.toFixed(2)} RON</div>
          </div>
          <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>COMENZI ÎN AȘTEPTARE</div>
            <div style={{ fontSize: '26px', fontWeight: '800', color: '#d97706', marginTop: '6px' }}>{pendingOrders}</div>
          </div>
          <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>TOTAL UTILIZATORI</div>
            <div style={{ fontSize: '26px', fontWeight: '800', color: '#6366f1', marginTop: '6px' }}>{users.length}</div>
          </div>
          <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>VOLUM TOTAL COMENZI</div>
            <div style={{ fontSize: '26px', fontWeight: '800', color: '#475569', marginTop: '6px' }}>{orders.length}</div>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUSE */}
      {activeTab === 'products' && (
        <>
          <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
            <h4 style={{ margin: '0 0 14px 0' }}>Adaugă Produs Nou în Atelier</h4>
            <form onSubmit={onAddProduct} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
              <input placeholder="Nume" required value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              <input placeholder="Categorie" required value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              <input type="number" step="0.01" placeholder="Preț (RON)" required value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              <input placeholder="Descriere" value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              <input placeholder="Imagine (ex: card_metal.jpg)" value={newProduct.image_url} onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })} style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              <button type="submit" style={{ padding: '8px', borderRadius: '6px', border: 'none', background: '#059669', color: '#fff', fontWeight: '600', cursor: 'pointer' }}>+ Salvează</button>
            </form>
          </div>

          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <tr>
                  <th style={{ padding: '12px 16px' }}>Produs</th>
                  <th style={{ padding: '12px 16px' }}>Categorie</th>
                  <th style={{ padding: '12px 16px' }}>Preț</th>
                  <th style={{ padding: '12px 16px' }}>Stoc</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Acțiuni</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 16px', fontWeight: '600' }}>{p.name}</td>
                    <td style={{ padding: '12px 16px' }}>{p.category}</td>
                    <td style={{ padding: '12px 16px' }}>{p.price} RON</td>
                    <td style={{ padding: '12px 16px' }}>{p.stock ?? 0}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <button onClick={() => onStartEditProduct(p)} style={{ marginRight: '8px', padding: '6px 10px', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}>Edit</button>
                      <button onClick={() => onDeleteProduct(p.id)} style={{ padding: '6px 10px', borderRadius: '4px', border: '1px solid #fee2e2', background: '#fff', color: '#dc2626', cursor: 'pointer' }}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* TAB 3: COMENZI */}
      {activeTab === 'orders' && (
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <tr>
                <th style={{ padding: '12px 16px' }}>ID</th>
                <th style={{ padding: '12px 16px' }}>Client</th>
                <th style={{ padding: '12px 16px' }}>Total</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
                <th style={{ padding: '12px 16px' }}>Adresă</th>
                <th style={{ padding: '12px 16px' }}>Data</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((ord) => (
                <tr key={ord.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 16px', fontWeight: '700' }}>#{ord.id}</td>
                  <td style={{ padding: '12px 16px' }}>{ord.user_name || 'Client'} ({ord.user_email || '-'})</td>
                  <td style={{ padding: '12px 16px', fontWeight: '600' }}>{parseFloat(ord.total_price).toFixed(2)} RON</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      padding: '3px 8px',
                      borderRadius: '10px',
                      background: ord.status === 'Pending' ? '#fef3c7' : '#dcfce7',
                      color: ord.status === 'Pending' ? '#b45309' : '#15803d',
                      fontWeight: '600',
                      fontSize: '12px'
                    }}>
                      {ord.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#64748b', fontSize: '13px' }}>{ord.shipping_address || 'Nespecificată'}</td>
                  <td style={{ padding: '12px 16px', color: '#64748b' }}>{ord.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 4: UTILIZATORI */}
      {activeTab === 'users' && (
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <tr>
                <th style={{ padding: '12px 16px' }}>ID</th>
                <th style={{ padding: '12px 16px' }}>Nume</th>
                <th style={{ padding: '12px 16px' }}>Email</th>
                <th style={{ padding: '12px 16px' }}>Rol Curent</th>
                <th style={{ padding: '12px 16px' }}>Data Înregistrării</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Acțiune Rol</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const nextRole = u.role === 'admin' ? 'client' : 'admin';
                return (
                  <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 16px', fontWeight: '700' }}>#{u.id}</td>
                    <td style={{ padding: '12px 16px', fontWeight: '600' }}>{u.name}</td>
                    <td style={{ padding: '12px 16px', color: '#64748b' }}>{u.email}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '10px',
                        fontWeight: '700',
                        fontSize: '12px',
                        background: u.role === 'admin' ? '#fef3c7' : '#e0f2fe',
                        color: u.role === 'admin' ? '#b45309' : '#0369a1'
                      }}>
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#64748b' }}>{u.created_at}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <button
                        onClick={() => onUpdateRole(u.id, nextRole)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          background: '#fff',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}
                      >
                        Schimbă în {nextRole}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}