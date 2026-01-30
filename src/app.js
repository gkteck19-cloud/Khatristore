import React, { useState, useEffect } from 'react';
import { db, auth } from './firebase';
import { collection, getDocs, addDoc, setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged, RecaptchaVerifier, signInWithPhoneNumber, signOut } from 'firebase/auth';
import { ShoppingCart, Search, User, X, Smartphone, ShieldCheck, Zap, Settings, Cpu, Package, CheckCircle } from 'lucide-react';

function App() {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

  const categories = [
    { name: 'All', icon: <Package size={18}/> },
    { name: 'Induction', icon: <Zap size={18}/> },
    { name: 'Repair Parts', icon: <Settings size={18}/> },
    { name: 'Electronics', icon: <Cpu size={18}/> }
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
    const fetchProducts = async () => {
      try {
        const data = await getDocs(collection(db, "products"));
        setProducts(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));
      } catch (err) { console.error("Error fetching products:", err); }
    };
    fetchProducts();
    return () => unsubscribe();
  }, []);

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', { 'size': 'invisible' });
    }
  };

  const sendOtp = async (e) => {
    e.preventDefault();
    setupRecaptcha();
    try {
      const confirmation = await signInWithPhoneNumber(auth, "+91" + phone, window.recaptchaVerifier);
      setConfirmationResult(confirmation);
    } catch (error) { alert("Error: " + error.message); }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    try {
      const result = await confirmationResult.confirm(otp);
      await setDoc(doc(db, "users", result.user.uid), {
        phoneNumber: result.user.phoneNumber,
        lastLogin: serverTimestamp()
      }, { merge: true });
      setShowLogin(false);
      setConfirmationResult(null);
    } catch (error) { alert("Invalid OTP"); }
  };

  const addToCart = (product) => {
    if (!user) return setShowLogin(true);
    setCart([...cart, product]);
  };

  const totalPrice = cart.reduce((sum, item) => sum + Number(item.price), 0);

  const placeOrder = async () => {
    try {
      await addDoc(collection(db, "orders"), {
        userId: user.uid,
        userPhone: user.phoneNumber,
        items: cart,
        totalAmount: totalPrice,
        status: "Pending",
        createdAt: serverTimestamp()
      });
      setCart([]);
      setIsCartOpen(false);
      setOrderSuccess(true);
      setTimeout(() => setOrderSuccess(false), 5000);
    } catch (error) { alert("Order failed: " + error.message); }
  };

  const filteredProducts = products.filter(p => 
    (activeCategory === 'All' || p.category === activeCategory) &&
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      <div id="recaptcha-container"></div>

      {orderSuccess && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-full shadow-2xl z-[150] flex items-center gap-2 animate-bounce">
          <CheckCircle size={20} /> आपका ऑर्डर दर्ज हो गया है!
        </div>
      )}

      {/* Navbar */}
      <nav className="bg-slate-900 text-white p-3 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-black tracking-tighter text-orange-400">KHATRI STORE</h1>
          <div className="hidden md:flex flex-1 mx-6">
             <input type="text" placeholder="सर्च करें..." className="w-full p-2 rounded text-black outline-none" onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <div className="flex gap-4 items-center">
            {user ? (
              <button onClick={() => signOut(auth)} className="text-[10px] border border-white/20 px-2 py-1 rounded">Logout</button>
            ) : (
              <button onClick={() => setShowLogin(true)} className="flex items-center gap-1 text-sm"><User size={18}/> Login</button>
            )}
            <div onClick={() => setIsCartOpen(true)} className="relative cursor-pointer">
              <ShoppingCart size={24}/>
              <span className="absolute -top-2 -right-2 bg-orange-500 rounded-full w-5 h-5 text-xs flex items-center justify-center">{cart.length}</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Categories */}
      <div className="bg-white border-b flex gap-2 p-3 overflow-x-auto no-scrollbar">
        {categories.map(cat => (
          <button key={cat.name} onClick={() => setActiveCategory(cat.name)} className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${activeCategory === cat.name ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
            {cat.icon}{cat.name}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto p-3 grid grid-cols-2 md:grid-cols-4 gap-3">
        {filteredProducts.map(item => (
          <div key={item.id} className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex flex-col">
            <img onClick={() => setSelectedProduct(item)} src={item.image} className="h-32 object-contain mb-2 cursor-pointer" alt="" />
            <h3 onClick={() => setSelectedProduct(item)} className="font-bold text-xs mb-1 line-clamp-2 h-8 cursor-pointer">{item.name}</h3>
            <p className="text-slate-900 font-black text-lg mb-2">₹{item.price}</p>
            <button onClick={() => addToCart(item)} className="w-full bg-slate-900 text-white py-2 rounded-lg text-[10px] font-bold uppercase">Add to Cart</button>
          </div>
        ))}
      </div>

      {/* Description Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/80 z-[120] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-3xl overflow-hidden relative">
            <X className="absolute right-4 top-4 cursor-pointer bg-gray-100 p-1 rounded-full" onClick={() => setSelectedProduct(null)} />
            <div className="p-6">
              <img src={selectedProduct.image} className="h-40 mx-auto object-contain mb-4" alt="" />
              <h2 className="text-xl font-bold mb-2">{selectedProduct.name}</h2>
              <p className="text-orange-600 font-black text-2xl mb-4">₹{selectedProduct.price}</p>
              <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-600 mb-6">
                <strong>विवरण:</strong><br/>
                {selectedProduct.description || "कोई विवरण उपलब्ध नहीं है।"}
              </div>
              <button onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }} className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold">Add to Cart</button>
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/60 z-[200] flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl w-full max-w-xs relative text-center">
            <X className="absolute right-4 top-4 cursor-pointer" onClick={() => setShowLogin(false)} />
            <h2 className="text-xl font-bold mb-6">मोबाइल लॉगिन</h2>
            {!confirmationResult ? (
              <form onSubmit={sendOtp} className="space-y-4">
                <input type="tel" placeholder="Mobile Number" className="w-full border p-3 rounded-xl" onChange={e => setPhone(e.target.value)} required />
                <button className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold">OTP भेजें</button>
              </form>
            ) : (
              <form onSubmit={verifyOtp} className="space-y-4">
                <input type="text" placeholder="Enter OTP" className="w-full border p-3 rounded-xl text-center" onChange={e => setOtp(e.target.value)} required />
                <button className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold">Verify & Login</button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/50 z-[150] flex justify-end">
          <div className="w-full max-w-xs bg-white h-full p-4 flex flex-col">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h2 className="text-lg font-bold">आपका कार्ट</h2>
              <X onClick={() => setIsCartOpen(false)} />
            </div>
            <div className="flex-1 overflow-y-auto">
              {cart.map((item, i) => (
                <div key={i} className="flex justify-between items-center mb-3 text-sm border-b pb-2">
                  <span className="line-clamp-1">{item.name}</span>
                  <span className="font-bold">₹{item.price}</span>
                </div>
              ))}
            </div>
            {cart.length > 0 && (
              <div className="pt-4 border-t">
                <div className="flex justify-between text-xl font-bold mb-4"><span>Total:</span><span>₹{totalPrice}</span></div>
                <button onClick={placeOrder} className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold">PLACE ORDER</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
    
