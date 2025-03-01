"use client"

import { useState, useEffect } from "react"
import { endpoints } from "../../config/endpoints"
import { Card, Select, Slider, Button } from "antd"
import { useGetList } from "../../service/query/useGetList"
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useTranslation } from "react-i18next"

export default function Courses() {
  const [priceRange, setPriceRange] = useState(1000)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("muallimah-user"));
    const token = userData?.access_token;
  }, [])

  const { data: allCourses, isLoading: isAllCoursesLoading } = useGetList(endpoints.course.list, {
    page: currentPage,
    limit: 10,
    categoryId: selectedCategory === "all" ? undefined : selectedCategory,
    language: i18n.language,
  })

  const { data: allCategory } = useGetList(endpoints.category.list, {
    page: 1,
    limit: 10,
    language: i18n.language,
  })

  const categories = allCategory?.Categorys?.map(cat => ({ id: cat.id, name: cat.name })) || []
  const { Option } = Select

  const filteredCourses = allCourses?.courses
    ?.filter((course) => course.price <= priceRange) || []
  const totalPages = allCourses?.total_count ? Math.ceil(allCourses.total_count / 10) : 1

  if (isAllCoursesLoading) {
    return <div>Loading...</div>
  }

  // Kursning batafsil sahifasiga o'tish funksiyasi
  const handleViewDetails = async (courseId) => {
    const userData = JSON.parse(localStorage.getItem("muallimah-user"));
    const token = userData?.access_token;

    if (!token) {
      toast.warn("Iltimos, avval tizimga kiring!");
      return;
    }

    try {
      // Kursning batafsil ma'lumotlarini olish uchun API so'rov
      const response = await fetch(
        `https://beta.themuallimah.uz/v1/course/details/{id}?id=${courseId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Kurs topilmadi yoki serverda xatolik yuz berdi!");
      }

      const data = await response.json();

      // Agar ma'lumotlar null yoki bo'sh bo'lsa
      if (!data || data.length === 0) {
        throw new Error("Kurs ma'lumotlari topilmadi!");
      }

      // Agar ma'lumotlar mavjud bo'lsa, single pagega o'tish
      window.location.href = `/courses/${courseId}`;
    } catch (error) {
      toast.error(error.message); // Xatolik xabarini ko'rsatish
    }
  };

  return (
    <div className="mx-auto px-4 py-8 container">
      <ToastContainer />
      <div className="flex lg:flex-row flex-col justify-between gap-[40px]">
        <div className="space-y-6 mb-8">
          <div className="flex flex-wrap gap-2">
            <Select
              placeholder={t("all_categories")} // Tilga mos "All Categories" so'zi
              style={{ width: 180 }}
              value={selectedCategory}
              onChange={(value) => setSelectedCategory(value)}
            >
              <Option value="all">{t("all_categories")}</Option> {/* Tilga mos "All Categories" so'zi */}
              {categories.map((category) => (
                <Select.Option key={category.id} value={category.id}>
                  {category.name}
                </Select.Option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <div className="font-medium text-sm">Price</div>
            <div className="flex items-center gap-4">
              <span className="text-gray-500 text-sm">$0</span>
              <Slider value={priceRange} onChange={(value) => setPriceRange(value)} max={1000} style={{ width: 200 }} />
              <span className="text-gray-500 text-sm">${priceRange}</span>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex flex-wrap justify-between gap-2 mb-4">
            {categories.map((category) => (
              <Button
                key={category.id}
                type={selectedCategory === category.id ? "primary" : "default"}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </Button>
            ))}
          </div>
          <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course) => (
              <Card
                key={course.id}
                cover={
                  <img alt={course.title} src={course.image_url || "/placeholder.svg"} className="h-48 object-cover" />
                }
                hoverable
              >
                <Card.Meta
                  title={course.title}
                  description={
                    <div className="flex flex-col justify-between space-y-2 h-[120px]">
                      <p className="text-gray-600 text-sm line-clamp-3">{course.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="font-bold">${course.price}</span>
                        <Button
                          type="primary"
                          onClick={() => handleViewDetails(course.id)} // Kursning batafsil sahifasiga o'tish
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  }
                />
              </Card>
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <div className="mt-8 text-gray-500 text-center">No courses found matching your criteria.</div>
          )}

          {filteredCourses.length > 0 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="bg-gray-200 hover:bg-gray-300 disabled:opacity-50 p-2 rounded-full text-gray-800 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-full ${page === currentPage ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-800"} transition-colors`}
                >
                  {page}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                className="bg-gray-200 hover:bg-gray-300 disabled:opacity-50 p-2 rounded-full text-gray-800 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}