import { useState, useEffect } from 'react';
import { api } from './services/api';
import { useCart } from './hooks/useCart';
import { useAuth } from './hooks/useAuth';

// Components
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import AuthModal from './components/AuthModal';
import EditProductModal from './components/EditProductModal';

// Views
import GuestHomeView from './views/GuestHomeView';
import ClientDashboardView from './views/ClientDashboardView';
import AdminDashboardView from './views/AdminDashboardView';

export default function App() {
  const [currentView, setCurrentView] = useState('store');
  const [products, setProducts] = useState([]);
  const [clientOrders, setClientOrders] = useState([]);
  const [adminOrders, setAdminOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    image_url: ''
  });

  const cart = useCart();
  const auth = useAuth();

  // Sincronizare date din backend
  const loadData = async () => {
    // 1. Încărcăm produsele necondiționat
    try {
      const prodRes = await api.getProducts();
      if (prodRes) {
        // Prindem toate variantele de format: array direct sau proprietate într-un obiect
        const listaProduse = prodRes.products || prodRes.data || (Array.isArray(prodRes) ? prodRes : []);
        setProducts(listaProduse);
      }
    } catch (err) {
      console.error('Eroare produse:', err);
    }

    // 2. Încărcăm datele de cont dacă utilizatorul este autentificat
    if (auth.currentUser) {
      try {
        const clientOrdRes = await api.getOrders(auth.currentUser.id);
        if (clientOrdRes) {
          const listaComenziClient = clientOrdRes.orders || clientOrdRes.data || (Array.isArray(clientOrdRes) ? clientOrdRes : []);
          setClientOrders(listaComenziClient);
        }
      } catch (err) {
        console.error('Eroare comenzi client:', err);
      }

      // 3. Date specifice administratorului
      if (auth.currentUser.role === 'admin') {
        try {
          // Preia comenzile pentru tot magazinul
          const adminOrdRes = await api.getOrders();
          if (adminOrdRes) {
            const listaComenziAdmin = adminOrdRes.orders || adminOrdRes.data || (Array.isArray(adminOrdRes) ? adminOrdRes : []);
            setAdminOrders(listaComenziAdmin);
          }
          
          // Preia lista de utilizatori pentru tabelul de management
          const usersRes = await api.getUsers();
          if (usersRes) {
            const listaUtilizatori = usersRes.users || usersRes.data || (Array.isArray(usersRes) ? usersRes : []);
            setUsers(listaUtilizatori);
          }
        } catch (err) {
          console.error('Eroare admin (comenzi/utilizatori):', err);
        }
      }
    }
  };

  useEffect(() => {
    loadData();
  }, [auth.currentUser]);

  // Plasare comandă (Checkout)
  const handleCheckout = async () => {
    if (!auth.currentUser) {
      cart.setIsCartOpen(false);
      auth.openAuth('login', 'Trebuie să fii conectat(ă) pentru a plasa comanda!');
      return;
    }

    try {
      const res = await api.createOrder({
        user_id: auth.currentUser.id,
        total_price: cart.totalPrice,
        shipping_address: 'Timișoara, România',
        items: cart.cart
      });

      // Verificăm dacă răspunsul este de succes (poate diferi în funcție de PHP)
      if (res && (res.status === 'success' || res.order_id)) {
        alert(`Felicitări! Comanda #${res.order_id || ''} a fost înregistrată cu succes.`);
        cart.clearCart();
        cart.setIsCartOpen(false);
        loadData();
      } else {
        alert('A apărut o problemă la plasarea comenzii. Verifică consola.');
      }
    } catch (err) {
      console.error('Eroare checkout:', err);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b', fontFamily: 'system-ui, sans-serif' }}>
      {/* Bara de Navigare */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        cartCount={cart.totalCount}
        setIsCartOpen={cart.setIsCartOpen}
        currentUser={auth.currentUser}
        onLogout={() => {
          auth.logout();
          setCurrentView('store');
        }}
        onOpenAuth={(view) => auth.openAuth(view)}
      />

      {/* Magazin / Catalog */}
      {currentView === 'store' && (
        <GuestHomeView
          products={products}
          onAddToCart={cart.addToCart}
        />
      )}

      {/* Panou Client */}
      {currentView === 'client_dashboard' && auth.currentUser && (
        <ClientDashboardView
          currentUser={auth.currentUser}
          orders={clientOrders}
          onGoToStore={() => setCurrentView('store')}
        />
      )}

      {/* Panou Administrator */}
      {currentView === 'admin_dashboard' && auth.currentUser?.role === 'admin' && (
        <AdminDashboardView
          products={products}
          orders={adminOrders}
          users={users}
          onUpdateRole={async (id, role) => {
            await api.updateUserRole(id, role);
            loadData();
          }}
          newProduct={newProduct}
          setNewProduct={setNewProduct}
          onAddProduct={async (e) => {
            e.preventDefault();
            await api.createProduct(newProduct);
            setNewProduct({ name: '', category: '', price: '', description: '', image_url: '' });
            loadData();
          }}
          onDeleteProduct={async (id) => {
            if (window.confirm('Sigur dorești să ștergi acest produs?')) {
              await api.deleteProduct(id);
              loadData();
            }
          }}
          onStartEditProduct={setEditingProduct}
        />
      )}

      {/* Coș Cumpărături */}
      <CartDrawer
        isOpen={cart.isCartOpen}
        onClose={() => cart.setIsCartOpen(false)}
        cart={cart.cart}
        onUpdateQuantity={cart.updateQuantity}
        onRemoveItem={cart.removeFromCart}
        totalPrice={cart.totalPrice}
        totalCount={cart.totalCount}
        onProceedToCheckout={handleCheckout}
      />

      {/* Fereastră Autentificare */}
      <AuthModal
        authView={auth.authView}
        onClose={auth.closeAuth}
        authForm={auth.authForm}
        setAuthForm={auth.setAuthForm}
        authMsg={auth.authMsg}
        onSubmit={auth.handleAuthSubmit}
        onSwitchView={auth.setAuthView}
      />

      {/* Fereastră Editare Produs */}
      <EditProductModal
        product={editingProduct}
        setProduct={setEditingProduct}
        onSave={async (e) => {
          e.preventDefault();
          await api.updateProduct(editingProduct);
          setEditingProduct(null);
          loadData();
        }}
        onCancel={() => setEditingProduct(null)}
      />
    </div>
  );
}