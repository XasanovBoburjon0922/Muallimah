import React, { useState } from "react";
import { useGetList } from "../../service/query/useGetList";
import { endpoints } from "../../config/endpoints";
import { Carousel, Grid } from "antd";
import { useTranslation } from "react-i18next"; // useTranslation hookini import qilish
import { CardSkeleton } from "../loadings/card-skeleton";
import { BlogCard } from "../cards/blog-card";

const HomeBlogs = () => {
  const { t, i18n } = useTranslation(); // useTranslation hookini ishlatish
  const screens = Grid.useBreakpoint();
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Barcha postlarni olish
  const { data: allPosts, isLoading: isAllPostsLoading } = useGetList(endpoints.post.list, {
    language: i18n.language,
  });

  // Kategoriyalarni olish
  const { data: categoriesData, isLoading: isCategoriesLoading } = useGetList(
    endpoints.postCategory.list,
    {
      page: 1,
      limit: 10,
      language: i18n.language,
    }
  );

  // Tanlangan kategoriya bo'yicha postlarni olish
  const { data: categoryPosts, isLoading: isCategoryPostsLoading } = useGetList(
    selectedCategory ? `${endpoints.post.list}?post_catg_id=${selectedCategory}` : null,
    null
  );

  // Yuklanish holati
  const isLoading = isAllPostsLoading || isCategoriesLoading || isCategoryPostsLoading;

  // Postlarni tanlangan kategoriyaga qarab o'zgartirish
  const posts = selectedCategory ? categoryPosts?.posts : allPosts?.posts;

  return (
    <div id="blog" className="mb-12 container">
      <h2 className="mb-7 font-secondary text-spacial_red text-3xl md:text-7xl">
        {t("header.blog")}
      </h2>

      {isLoading ? (
        <CardSkeleton />
      ) : (
        <>
          {/* Kategoriyalar (faqat desktopda ko'rinadi) */}
          <div className="hidden md:flex gap-2 mb-8 pb-4 overflow-x-auto">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${!selectedCategory ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
            >
              {t("all_posts")} {/* Tilga mos "All posts" */}
            </button>
            {categoriesData?.post_categories?.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${selectedCategory === category.id ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Postlar Carousel */}
          <Carousel
            slidesToShow={screens.md ? 4 : 1} // Mobil uchun 1 ta, desktop uchun 4 ta
            autoplay
            swipeToSlide={true}
            autoplaySpeed={3500}
            draggable
            pauseOnHover={false}
            pauseOnDotsHover={false}
            dots={false}
            centerMode={!screens.md} // Mobil uchun markazlash
            centerPadding="0" // Markazlash uchun padding
            className="flex justify-center text-center"
          >
            {posts?.map((card) => (
              <div key={card?.id} className="flex justify-center">
                <BlogCard card={{ ...card }} />
              </div>
            ))}
          </Carousel>
        </>
      )}
    </div>
  );
};

export default HomeBlogs;