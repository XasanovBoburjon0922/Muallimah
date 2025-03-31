"use client"
import { useState, useEffect } from 'react';
import { Button, InputNumber, message, Modal } from 'antd';
import { DeleteOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { useCart } from '../../Context/context';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom'; // React Router'dan useLocation import qilamiz

const getToken = () => {
  const user = JSON.parse(localStorage.getItem("muallimah-user"));
  return user ? user.access_token : null;
};

const getFormattedDate = () => {
  const date = new Date();
  const day = date.getDate();
  const months = [
    "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
    "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"
  ];
  const monthName = months[date.getMonth()];
  return `${day}-${monthName}`;
};

function Cart() {
  const location = useLocation(); // React Router'dan joriy location ni olish
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const { t, i18n } = useTranslation();
  const deliveryDate = getFormattedDate();
  const { fetchCart, setCurrentPage } = useCart();

  // Komponent yuklanganda joriy sahifani o'rnatish
  useEffect(() => {
    setCurrentPage(location.pathname);
  }, [location.pathname, setCurrentPage])

  // API so'rovlarini faqat allowed sahifalarda ishlatish
  const allowedPaths = ['/books', '/shop', '/cart'];
  const isAllowedPath = allowedPaths.includes(location.pathname);

  const fetchCartData = async () => {
    if (!isAllowedPath) return; // Ruxsat berilmagan sahifalarda API so'rov yubormaymiz

    try {
      const token = getToken();
      if (!token) {
        throw new Error('Token topilmadi. Iltimos, avval tizimga kiring.');
      }

      const response = await fetch('https://beta.themuallimah.uz/v1/basket/list', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        setCartData({ items: [], total_count: 0, total_price: 0 });
        return;
      }

      const data = await response.json();
      setCartData(data);
    } catch (error) {
      setError(error.message);
      message.error('Xatolik yuz berdi: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartData();
  }, [location.pathname]); // Path o'zgarganda yangilash
  // Modalni ochish
  const showDeleteModal = (basketId) => {
    setSelectedItemId(basketId); // Tanlangan mahsulot IDsi
    setIsModalOpen(true); // Modalni ochish
  };

  // Modalni yopish
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // Mahsulotni o'chirish
  const handleDeleteItem = async () => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('Token topilmadi. Iltimos, avval tizimga kiring.');
      }

      const response = await fetch(`https://beta.themuallimah.uz/v1/basket/item?basket_id=${selectedItemId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Mahsulotni o\'chirishda xatolik yuz berdi');
      }

      // Savatchani yangilash
      await fetchCartData();
      await fetchCart(); // Headerdagi savat sonini yangilash
      message.success('Mahsulot savatchadan muvaffaqiyatli o\'chirildi');
    } catch (error) {
      message.error(error.message);
    } finally {
      setIsModalOpen(false); // Modalni yopish
    }
  };

  // Mahsulot miqdorini yangilash
  const handleUpdateCount = async (basketId, count, action) => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('Token topilmadi. Iltimos, avval tizimga kiring.');
      }

      const response = await fetch('https://beta.themuallimah.uz/v1/basket/item', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: action, // "+" yoki "-"
          basket_id: basketId,
        }),
      });

      if (!response.ok) {
        throw new Error('Mahsulot miqdori yangilanmadi');
      }

      // Savatchani yangilash
      await fetchCartData();
      await fetchCart(); // Headerdagi savat sonini yangilash
      message.success('Mahsulot miqdori muvaffaqiyatli yangilandi');
    } catch (error) {
      message.error(error.message);
    }
  };

  // Mahsulot sarlavhasini olish
  const getProductTitle = (title) => {
    try {
      // Agar JSON string bo'lsa, uni parse qilamiz
      const parsedTitle = JSON.parse(title);
      return parsedTitle[i18n.language] || title; // Tilga mos sarlavhani qaytaramiz
    } catch (error) {
      // Agar JSON emas bo'lsa, oddiy string sifatida qaytaramiz
      return title;
    }
  };

  // Buyurtma berish
  const handlePlaceOrder = async () => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('Token topilmadi. Iltimos, avval tizimga kiring.');
      }

      const response = await fetch('https://beta.themuallimah.uz/v1/order/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Buyurtma berishda xatolik yuz berdi');
      }

      // Buyurtma muvaffaqiyatli berilganligini bildirish
      setIsOrderPlaced(true);
      message.success('Buyurtma muvaffaqiyatli berildi');

      // Foydalanuvchini /orders sahifasiga yo'naltirish
      window.location.href = "/user-panel/orders"; // Navigate qilish
    } catch (error) {
      message.error(error.message);
    }
  };


  if (loading && isAllowedPath) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  if (!cartData || cartData.items.length === 0) {
    return (
      <div className="mx-auto p-4 md:p-6 max-w-7xl">
        <div className="bg-white p-6 rounded-lg text-center">
          <h2 className="mb-4 font-medium text-2xl">Savatingiz boʻsh</h2>
          <p className="mb-6 text-gray-600">
            Savatingizda hozircha mahsulot yoʻq. Mahsulot qoʻshish uchun{" "}
            <a href="/products" className="text-purple-600 hover:underline">
              mahsulotlar sahifasiga
            </a>{" "}
            o'ting.
          </p>
          <Button
            type="primary"
            size="large"
            className="bg-purple-600 hover:bg-purple-700"
            href="/"
          >
            Mahsulotlar sahifasiga o'tish
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto p-4 md:p-6 max-w-7xl">
      <div className="gap-6 grid grid-cols-1 lg:grid-cols-3">
        {/* Left Column */}
        <div className="lg:col-span-2">
          <div className="bg-white mb-4 p-4 rounded-lg">
            <div className="mb-4 text-gray-500 text-sm">{t("delivery_info")}</div>

            <h2 className="mb-6 font-medium text-xl">
              {deliveryDate} {t("delivery_date")}
            </h2>

            {/* Product Cards */}
            {cartData.items.map((item, index) => (
              <div key={item.id} className="flex gap-4 pt-4 border-t">
                <div className="bg-gray-100 rounded-lg w-24 h-24 overflow-hidden">
                  <img
                    src={item.pictures[0]}
                    alt="Product"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex justify-between mb-2">
                    <h3 className="text-gray-800">
                      {getProductTitle(item.product.title)} {/* Sarlavhani olish */}
                    </h3>
                    <DeleteOutlined
                      className="text-gray-400 hover:text-gray-600 cursor-pointer"
                      onClick={() => showDeleteModal(item.id)} // Modalni ochish
                    />
                  </div>

                  <div className="mb-4 text-gray-500 text-sm">{t("seller")}</div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Button
                        type="text"
                        size="small"
                        onClick={() => {
                          if (item.count > 1) {
                            handleUpdateCount(item.id, item.count - 1, "-");
                          }
                        }}
                        disabled={item.count <= 1} // Agar miqdor 1 bo'lsa, tugmani disable qilish
                      >
                        -
                      </Button>
                      <span className="font-medium text-lg">{item.count}</span> {/* Miqdorni ko'rsatish */}
                      <Button
                        type="text"
                        size="small"
                        onClick={() => handleUpdateCount(item.id, item.count + 1, "+")}
                      >
                        +
                      </Button>
                    </div>
                    <div>
                      <div className="font-medium text-lg">{item.price} so'm</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:col-span-1">
          <div className="top-4 sticky bg-white p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-6">
              <EnvironmentOutlined className="text-purple-600" />
              <h3 className="font-medium">
                {t("delivery_point")} 6 900 so'm
              </h3>
              <div className="ml-auto text-gray-400 text-lg">ⓘ</div>
            </div>

            <div className="mb-6 text-gray-600 text-sm">
              {t("free_delivery", { amount: "9 010" })}
            </div>

            <div className="pt-4 border-t">
              <h3 className="mb-4 font-medium">{t("your_order")}</h3>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {t("productss", { count: cartData.total_count })}
                  </span>
                  <span>{cartData.total_price} so'm</span>
                </div>
                <div className="text-purple-600 text-sm">
                  {t("delivery_date")} {deliveryDate}
                </div>
              </div>

              <div className="flex justify-between mb-2 font-medium">
                <span>{t("total")}</span>
                <span>{cartData.total_price} so'm</span>
              </div>

              <div className="mb-6 text-green-500 text-sm">
                {t("savings", { amount: "0" })}
              </div>

              <Button
                type="primary"
                size="large"
                className="bg-purple-600 hover:bg-purple-700 w-full"
                onClick={handlePlaceOrder}
                disabled={isOrderPlaced} // Agar buyurtma berilgan bo'lsa, buttonni disable qilish
              >
                {isOrderPlaced ? t("order_placed") : t("proceed_to_checkout")}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tasdiqlash modali */}
      <Modal
        title={t("delete_product_title")}
        open={isModalOpen}
        onOk={handleDeleteItem}
        onCancel={handleCancel}
        okText={t("yes")}
        cancelText={t("no")}
      >
        <p>{t("delete_product_confirmation")}</p>
      </Modal>
    </div>
  );
}

export default Cart;