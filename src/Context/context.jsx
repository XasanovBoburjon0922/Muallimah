import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import axios from "axios";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);

  const getToken = () => {
    const user = JSON.parse(localStorage.getItem("muallimah-user"));
    return user ? user.access_token : null;
  };

  // Savatdagi mahsulotlarni yangilash
  const fetchCart = useCallback(async () => {
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
      console.log("API Response:", response.data); // Debug uchun
      setCartItems(response.data.items || []);
      setCartCount(response.data.total_count || 0); // Savatdagi mahsulotlar sonini yangilash
    } catch (error) {
      console.error("Savat ma'lumotlarini olishda xatolik:", error);
    }
  }, []);

  // Savatga mahsulot qo'shish
  const addToCart = async (productId) => {
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
  
      console.log("Add to Cart Response:", response.data); // Debug uchun
  
      // Agar status kodi 200-299 oraliqda bo'lsa, muvaffaqiyatli deb hisoblaymiz
      if (response.status >= 200 && response.status < 300) {
        await fetchCart(); // Savatni yangilash
        return null; // Xatolik yo'q
      } else {
        return "Bu mahsulot savatingizda mavjud!";
      }
    } catch (error) {
      console.error("Savatga mahsulot qo'shishda xatolik:", error);
      return "Savatga mahsulot qo'shishda xatolik yuz berdi!";
    }
  };

  // Komponent yuklanganda savatni yuklash
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return (
    <CartContext.Provider value={{ cartCount, cartItems, addToCart, fetchCart }}>
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