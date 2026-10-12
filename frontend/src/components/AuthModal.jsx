export default function AuthModal({
  authView,
  onClose,
  authForm,
  setAuthForm,
  authMsg,
  onSubmit,
  onSwitchView
}) {
  if (authView === 'none') return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 90 }}>
      <div style={{ background: '#fff', padding: '24px', borderRadius: '10px', width: '100%', maxWidth: '360px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
        <h3 style={{ marginTop: 0, marginBottom: '16px' }}>
          {authView === 'login' ? 'Conectare în Cont' : 'Creare Cont Nou'}
        </h3>

        {authMsg.text && (
          <div style={{
            padding: '10px',
            marginBottom: '14px',
            fontSize: '13px',
            borderRadius: '6px',
            background: authMsg.type === 'error' ? '#fee2e2' : '#dcfce7',
            color: authMsg.type === 'error' ? '#991b1b' : '#166534'
          }}>
            {authMsg.text}
          </div>
        )}

        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {authView === 'register' && (
            <input
              type="text"
              placeholder="Nume complet"
              required
              value={authForm.name}
              onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
              style={{ padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
            />
          )}

          <input
            type="email"
            placeholder="Adresă email"
            required
            value={authForm.email}
            onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
            style={{ padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
          />

          <input
            type="password"
            placeholder="Parolă"
            required
            value={authForm.password}
            onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
            style={{ padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
          />

          <button
            type="submit"
            style={{
              marginTop: '4px',
              padding: '10px',
              background: '#0ea5e9',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            {authView === 'login' ? 'Autentificare' : 'Înregistrează-te'}
          </button>
        </form>

        <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '13px', color: '#64748b' }}>
          {authView === 'login' ? (
            <span>
              Nu ai cont?{' '}
              <button
                onClick={() => onSwitchView('register')}
                style={{ border: 'none', background: 'transparent', color: '#0ea5e9', fontWeight: '600', cursor: 'pointer', padding: 0 }}
              >
                Creează cont
              </button>
            </span>
          ) : (
            <span>
              Ai deja un cont?{' '}
              <button
                onClick={() => onSwitchView('login')}
                style={{ border: 'none', background: 'transparent', color: '#0ea5e9', fontWeight: '600', cursor: 'pointer', padding: 0 }}
              >
                Autentifică-te
              </button>
            </span>
          )}
        </div>

        <button
          onClick={onClose}
          style={{ width: '100%', marginTop: '14px', padding: '6px', border: 'none', background: 'transparent', color: '#94a3b8', cursor: 'pointer', fontSize: '13px' }}
        >
          Închide
        </button>
      </div>
    </div>
  );
}