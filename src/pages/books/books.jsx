import React, { useState, useEffect } from "react";
import { Layout, Menu, Input, Checkbox, Slider, Card, Button, Pagination, message, Row, Col, Drawer } from "antd";
import { FiShoppingBag, FiFilter } from "react-icons/fi";
import { useCart } from "../../Context/context";
import { useTranslation } from "react-i18next";

const { Sider, Content } = Layout;
const { Search } = Input;

const Books = () => {
  const [priceRange, setPriceRange] = useState([0, 200000]);
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const { t, i18n } = useTranslation();
  const { addToCart } = useCart(); // Savatga qo'shish funksiyasini olish

  // Kitoblarni API dan olish
  const fetchBooks = async (page = 1, categoryIds = [], search = "") => {
    try {
      let url = `https://beta.themuallimah.uz/v1/product/list?type=book&page=${page}&limit=10&language=${i18n.language}`;
      if (categoryIds.length > 0) {
        url += `&category_id=${categoryIds.join(",")}`;
      }
      if (search) {
        url += `&title=${search}`;
      }
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setBooks(data.products || []);
      setTotalCount(data.total_count || 0);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Kategoriyalarni API dan olish
  const fetchCategories = async () => {
    try {
      const response = await fetch(
        `https://beta.themuallimah.uz/v1/category/list?&language=${i18n.language}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setCategories(data.Categorys || []);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    console.log("Current language:", i18n.language);
    fetchBooks(currentPage, selectedCategories, searchQuery);
    fetchCategories();
  }, [currentPage, selectedCategories, searchQuery, i18n.language]);

  // Sahifalash uchun funksiya
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Kategoriya tanlanganida ishlaydi
  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Qidiruv funksiyasi
  const handleSearch = (value) => {
    setSearchQuery(value);
    setCurrentPage(1); // Qidiruv natijasini birinchi sahifadan boshlash
  };

  // Filtrlangan kitoblar
  const filteredBooks = books
    ? books.filter(
      (book) =>
        book.price >= priceRange[0] &&
        book.price <= priceRange[1] &&
        (selectedCategories.length === 0 || selectedCategories.includes(book.category_id))
     ) : [];

  // Responsive uchun oynani kuzatish
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Layout>
      {!isMobile ? (
        <Sider width={250} theme="light">
          <div style={{ padding: "24px" }}>
            <Search
              placeholder={t("search_placeholder")} // Tilga mos "Qidirish..."
              style={{ marginBottom: "24px" }}
              onSearch={handleSearch}
              enterButton
            />
            <Menu mode="vertical" style={{ borderRight: 0 }}>
              {categories.map((category) => (
                <Menu.Item key={category.id}>
                  <Checkbox
                    checked={selectedCategories.includes(category.id)}
                    onChange={() => handleCategoryChange(category.id)}
                  >
                    {category.name}
                  </Checkbox>
                </Menu.Item>
              ))}
            </Menu>
            <div style={{ marginTop: "24px" }}>
              <h4>{t("price_range")}</h4> {/* Tilga mos "Narx oralig'i" */}
              <Slider
                range
                min={0}
                max={200000}
                step={1000}
                value={priceRange}
                onChange={(value) => setPriceRange(value)}
              />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>{priceRange[0].toLocaleString()} UZS</span>
                <span>{priceRange[1].toLocaleString()} UZS</span>
              </div>
            </div>
          </div>
        </Sider>
      ) : (
        <Button
          type="primary"
          icon={<FiFilter />}
          onClick={() => setDrawerVisible(true)}
          style={{ margin: "16px" }}
        >
          Filtrlash
        </Button>
      )}

      <Content style={{ padding: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "24px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>{t("books")}</h1>
        </div>
        <div className="flex flex-col justify-between h-full">
          <Row gutter={[24, 24]}>
            {filteredBooks.map((book) => (
              <Col xs={24} sm={12} md={8} lg={6} key={book.id}>
                <Card
                  cover={
                    <img
                      alt={book.title}
                      src={book.picture_urls[0] || "https://via.placeholder.com/300"}
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                  }
                >
                  <Card.Meta
                    title={book.title}
                    description={
                      <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                          <div style={{ fontWeight: "bold", marginTop: "8px" }}>
                            {book.price.toLocaleString()} UZS
                          </div>
                          <div style={{ marginTop: "8px" }}>{book.description}</div>
                        </div>
                        <FiShoppingBag
                          style={{
                            fontSize: "24px",
                            color: "#1890ff",
                            cursor: "pointer",
                            transition: "color 0.3s",
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.color = "#40a9ff"}
                          onMouseLeave={(e) => e.currentTarget.style.color = "#1890ff"}
                          onClick={async () => {
                            const result = await addToCart(book.id); // Savatga qo'shish
                            if (result) {
                              message.warning(result); // Toast xabarini ko'rsatish
                            } else {
                              console.log("Mahsulot savatga qo'shildi!"); // Debug uchun
                            }
                          }}
                        />
                      </div>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
          <div className="flex justify-center" style={{ marginTop: "24px", textAlign: "center" }}>
            <Pagination
              current={currentPage}
              total={totalCount}
              pageSize={10}
              onChange={handlePageChange}
            />
          </div>
        </div>
      </Content>

      {/* Mobile uchun Drawer */}
      <Drawer
        title="Filtrlar"
        placement="left"
        onClose={() => setDrawerVisible(false)}
        visible={drawerVisible}
        width={250}
      >
        <Search
          placeholder={t("search_placeholder")} // Tilga mos "Qidirish..."
          style={{ marginBottom: "24px" }}
          onSearch={handleSearch}
          enterButton
        />
        <Menu mode="vertical" style={{ borderRight: 0 }}>
          {categories.map((category) => (
            <Menu.Item key={category.id}>
              <Checkbox
                checked={selectedCategories.includes(category.id)}
                onChange={() => handleCategoryChange(category.id)}
              >
                {category.name}
              </Checkbox>
            </Menu.Item>
          ))}
        </Menu>
        <div style={{ marginTop: "24px" }}>
          <h4>{t("price_range")}</h4> {/* Tilga mos "Narx oralig'i" */}
          <Slider
            range
            min={0}
            max={200000}
            step={1000}
            value={priceRange}
            onChange={(value) => setPriceRange(value)}
          />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>{priceRange[0].toLocaleString()} UZS</span>
            <span>{priceRange[1].toLocaleString()} UZS</span>
          </div>
        </div>
      </Drawer>
    </Layout>
  );
};

export default Books;