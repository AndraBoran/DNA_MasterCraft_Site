export default function Navbar({
  currentView,
  setCurrentView,
  cartCount,
  setIsCartOpen,
  currentUser,
  onLogout,
  onOpenAuth
}) {
  return (
    <header style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 20 }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ cursor: 'pointer' }} onClick={() => setCurrentView('store')}>
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '800' }}>
            MasterCraft <span style={{ color: '#0ea5e9' }}>DNA</span>
          </h1>
          <span style={{ fontSize: '11px', color: '#64748b' }}>Custom Laser Engraving</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => setCurrentView('store')}
            style={{
              padding: '8px 14px',
              border: 'none',
              borderRadius: '6px',
              background: currentView === 'store' ? '#e0f2fe' : 'transparent',
              color: currentView === 'store' ? '#0369a1' : '#475569',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            🏪 Magazin
          </button>

          <button
            onClick={() => setIsCartOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              background: '#fff',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            🛒 Coș ({cartCount})
          </button>

          {currentUser ? (
            <>
              <button
                onClick={() => setCurrentView('client_dashboard')}
                style={{
                  padding: '8px 14px',
                  borderRadius: '6px',
                  border: 'none',
                  background: currentView === 'client_dashboard' ? '#e0f2fe' : '#f1f5f9',
                  color: '#0369a1',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                👤 Contul Meu
              </button>

              {currentUser.role === 'admin' && (
                <button
                  onClick={() => setCurrentView('admin_dashboard')}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '6px',
                    border: 'none',
                    background: currentView === 'admin_dashboard' ? '#fef3c7' : '#fffbeb',
                    color: '#b45309',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  ⚙️ Panou Admin
                </button>
              )}

              <button
                onClick={onLogout}
                style={{
                  padding: '8px 14px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  background: '#fff',
                  cursor: 'pointer'
                }}
              >
                Deconectare
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onOpenAuth('login')}
                style={{ padding: '8px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}
              >
                Sign In
              </button>
              <button
                onClick={() => onOpenAuth('register')}
                style={{ padding: '8px 14px', borderRadius: '6px', border: 'none', background: '#0ea5e9', color: '#fff', cursor: 'pointer', fontWeight: '600' }}
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}