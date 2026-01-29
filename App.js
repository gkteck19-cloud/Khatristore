import React, { useState, useEffect } from 'react';
// ... बाकी इंपोर्ट्स वही रहेंगे ...

function App() {
  // ... बाकी States वही रहेंगी ...
  const [selectedProduct, setSelectedProduct] = useState(null); // डिस्क्रिप्शन देखने के लिए

  // ... (Firebase और Auth वाले फंक्शन वही रहेंगे) ...

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      {/* ... Navbar और Categories वही रहेंगे ... */}

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto p-4 grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
        {filteredProducts.map(item => (
          <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col hover:shadow-xl transition-all duration-300 cursor-pointer">
            {/* इमेज पर क्लिक करने से डिस्क्रिप्शन खुलेगा */}
            <div onClick={() => setSelectedProduct(item)} className="h-40 flex items-center justify-center mb-3">
              <img src={item.image} className="max-h-full object-contain" alt="" />
            </div>
            
            <h3 onClick={() => setSelectedProduct(item)} className="font-bold text-gray-800 text-sm mb-1 line-clamp-2 h-10 hover:text-orange-500">
              {item.name}
            </h3>
            
            <p className="text-slate-900 font-black text-xl mb-3">₹{item.price}</p>
            
            <button onClick={() => addToCart(item)} className="w-full bg-slate-900 text-white py-2.5 rounded-lg text-xs font-bold hover:bg-slate-800 transition uppercase">
              Add To Cart
            </button>
          </div>
        ))}
      </div>

      {/* --- Product Description Modal --- */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/70 z-[110] flex items-center justify-center p-4 backdrop-blur-md">
          <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden relative animate-in fade-in zoom-in duration-300">
            <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute right-4 top-4 bg-gray-100 p-2 rounded-full z-10"
            >
              <X size={20} />
            </button>

            <div className="overflow-y-auto max-h-[90vh]">
              <div className="bg-gray-50 p-8 flex items-center justify-center">
                <img src={selectedProduct.image} className="max-h-64 object-contain shadow-lg rounded-lg" alt="" />
              </div>

              <div className="p-6">
                <h2 className="text-2xl font-black text-slate-900 mb-2">{selectedProduct.name}</h2>
                <p className="text-orange-600 font-bold text-3xl mb-4">₹{selectedProduct.price}</p>
                
                <div className="border-t border-b py-4 mb-6">
                  <h4 className="font-bold text-slate-800 mb-2 underline decoration-orange-400">प्रोडक्ट विवरण (Description):</h4>
                  <p className="text-gray-600 leading-relaxed">
                    {selectedProduct.description || "इस प्रोडक्ट के लिए कोई विवरण उपलब्ध नहीं है। अधिक जानकारी के लिए हमसे संपर्क करें।"}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-blue-50 p-3 rounded-xl">
                      <p className="text-[10px] text-blue-600 font-bold uppercase">Category</p>
                      <p className="font-bold text-slate-700">{selectedProduct.category}</p>
                   </div>
                   <div className="bg-green-50 p-3 rounded-xl">
                      <p className="text-[10px] text-green-600 font-bold uppercase">Stock Status</p>
                      <p className="font-bold text-slate-700">{selectedProduct.stock > 0 ? 'In Stock' : 'Out of Stock'}</p>
                   </div>
                </div>

                <button 
                  onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}
                  className="w-full bg-orange-500 text-white py-4 rounded-2xl font-bold text-lg mt-6 shadow-lg shadow-orange-200 hover:bg-orange-600 transition"
                >
                  झोली में डालें (Add to Cart)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ... लॉगिन और कार्ट वाले कोड वही रहेंगे ... */}
    </div>
  );
}
