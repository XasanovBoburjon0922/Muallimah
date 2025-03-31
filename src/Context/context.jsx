import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import axios from "axios";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [activePage, setActivePage] = useState(null);

  const getToken = () => {
    const user = JSON.parse(localStorage.getItem("muallimah-user"));
    return user ? user.access_token : null;
  };

  // Faqat ruxsat berilgan sahifalarda ishlaydigan fetchCart
  const fetchCart = useCallback(async () => {
    const allowedPages = ['/books', '/shop', '/cart', '/'];
    if (!allowedPages.includes(activePage)) return;

    const token = getToken();
    if (!token) {
      console.log("Token mavjud emas. Foydalanuvchi tizimga kirmagan.");
      return;
    }

    try {
      const response = await axios.get("https://beta.themuallimah.uz/v1/basket/list", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCartItems(response.data.items || []);
      setCartCount(response.data.total_count || 0);
    } catch (error) {
      console.error("Savat ma'lumotlarini olishda xatolik:", error);
    }
  }, [activePage]);

  // Savatga mahsulot qo'shish (faqat ruxsat berilgan sahifalarda)
  const addToCart = async (productId) => {
    const allowedPages = ['/books', '/shop', '/cart'];
    if (!allowedPages.includes(activePage)) {
      return "Savat faqat Books va Shop sahifalarida ishlaydi";
    }
    
    const token = getToken();
    if (!token) {
      return "Iltimos, avval tizimga kiring!";
    }
  
    try {
      const response = await axios.post(
        "https://beta.themuallimah.uz/v1/basket/item",
        {
          count: 1,
          product_id: productId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.status >= 200 && response.status < 300) {
        await fetchCart();
        return null;
      } else {
        return "Bu mahsulot savatingizda mavjud!";
      }
    } catch (error) {
      console.error("Savatga mahsulot qo'shishda xatolik:", error);
      return "Savatga mahsulot qo'shishda xatolik yuz berdi!";
    }
  };

  // Joriy sahifani o'rnatish funksiyasi
  const setCurrentPage = (path) => {
    setActivePage(path);
  };

  // Komponent yuklanganda savatni yuklash
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return (
    <CartContext.Provider value={{ 
      cartCount, 
      cartItems, 
      addToCart, 
      fetchCart,
      setCurrentPage // Joriy sahifani o'rnatish funksiyasi
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart hooki CartProvider ichida ishlatilishi kerak!");
  }
  return context;
};