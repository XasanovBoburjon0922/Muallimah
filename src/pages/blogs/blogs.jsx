import { useState } from "react"
import { useGetList } from "../../service/query/useGetList"
import { endpoints } from "../../config/endpoints"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

const Blogs = () => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()

  const [selectedCategory, setSelectedCategory] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)

  // Get all posts
  const { data: allPosts, isLoading: isAllPostsLoading } = useGetList(
    `${endpoints.post.list}?page=${currentPage}&limit=10&language=${i18n.language}`,
  )

  // Get categories
  const { data: categoriesData, isLoading: isCategoriesLoading } = useGetList(
    `${endpoints.postCategory.list}?page=${currentPage}&limit=10&language=${i18n.language}`,
  )

  // Get posts by selected category
  const { data: categoryPosts, isLoading: isCategoryPostsLoading } = useGetList(
    selectedCategory
      ? `${endpoints.post.list}?post_catg_id=${selectedCategory}&page=${currentPage}&limit=10&language=${i18n.language}`
      : null,
  )

  const posts = selectedCategory ? categoryPosts : allPosts
  const totalPages = posts?.total_pages || 1

  const handleCategoryChange = (event) => {
    const categoryId = event.target.value === "all" ? null : event.target.value
    setSelectedCategory(categoryId)
    setCurrentPage(1)
  }

  const navigateToBlogDetail = (postId) => {
    navigate(`/blogs/${postId}`)
  }

  return (
    <div className="mx-auto px-4 py-8 container">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-4 font-bold text-2xl sm:text-4xl sm:text-left text-center">Blog Posts</h1>
        <div className="flex gap-2 pb-2 overflow-x-auto">
          {/* Desktop view for categories */}
          <div className="hidden sm:flex gap-2">
            <button
              onClick={() => {
                setSelectedCategory(null)
                setCurrentPage(1)
              }}
              className={`px-4 py-2 rounded-full whitespace-nowrap ${selectedCategory === null ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                } transition-colors`}
            >
              {t("all")}
            </button>
            {!isCategoriesLoading &&
              categoriesData?.post_categories?.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(category.id)
                    setCurrentPage(1)
                  }}
                  className={`px-4 py-2 rounded-full whitespace-nowrap ${selectedCategory === category.id
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                    } transition-colors`}
                >
                  {category.name}
                </button>
              ))}
          </div>

          {/* Mobile view for categories - you can add a dropdown here if needed */}
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {!isAllPostsLoading &&
          posts?.posts?.map((post) => (
            <div
              key={post.id}
              className="bg-white shadow-md hover:shadow-lg rounded-lg overflow-hidden transition-shadow cursor-pointer"
              onClick={() => navigateToBlogDetail(post.id)}
            >
              <div className="relative aspect-[16/9]">
                <img
                  src={post.picture_urls || "/placeholder.svg"}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex flex-col justify-between h-[160px]">
                  <div>
                    <h2 className="mb-2 font-bold text-xl">{post.title}</h2>
                    <p className="text-gray-600 line-clamp-2">{post.content}</p>
                  </div>
                  <div className="flex justify-end items-end mt-4 w-full">
                    <p className="bg-slate-200 hover:bg-slate-400 p-2 text-blue-500 hover:underline">More</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-8">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="bg-gray-200 hover:bg-gray-300 disabled:opacity-50 p-2 rounded-full text-gray-800 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-4 py-2 rounded-full ${page === currentPage ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-800"
              } transition-colors`}
          >
            {page}
          </button>
        ))}
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          className="bg-gray-200 hover:bg-gray-300 disabled:opacity-50 p-2 rounded-full text-gray-800 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default Blogs