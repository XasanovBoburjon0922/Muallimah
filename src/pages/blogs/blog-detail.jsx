import { useParams, useNavigate } from "react-router-dom"
import { useGetList } from "../../service/query/useGetList"
import { useTranslation } from "react-i18next"
import { ArrowLeft, Calendar, Tag } from "lucide-react"

const BlogDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()

  // Fetch blog post details - using direct API URL
  const { data: post, isLoading } = useGetList(
    id ? `https://beta.themuallimah.uz/v1/post/${id}?language=${i18n.language}` : null
  )

  if (isLoading) {
    return (
      <div className="flex justify-center mx-auto px-4 py-16 container">
        <div className="flex flex-col w-full max-w-3xl animate-pulse">
          <div className="bg-gray-200 mb-6 rounded w-3/4 h-8"></div>
          <div className="bg-gray-200 mb-6 rounded h-64"></div>
          <div className="bg-gray-200 mb-3 rounded h-4"></div>
          <div className="bg-gray-200 mb-3 rounded h-4"></div>
          <div className="bg-gray-200 mb-3 rounded h-4"></div>
          <div className="bg-gray-200 mb-3 rounded h-4"></div>
          <div className="bg-gray-200 mb-3 rounded w-2/3 h-4"></div>
        </div>
      </div>
    )
  }

  const blogPost = post

  if (!blogPost) {
    return (
      <div className="flex justify-center mx-auto px-4 py-16 container">
        <div className="text-center">
          <h2 className="mb-4 font-bold text-2xl">{t("post_not_found")}</h2>
          <button 
            onClick={() => navigate("/blogs")} 
            className="flex justify-center items-center gap-2 text-blue-500 hover:underline"
          >
            <ArrowLeft size={16} />
            {t("back_to_blogs")}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto py-4 container">
      <div className="mx-auto">
        {/* Back button */}
        <button
          onClick={() => navigate("/blogs")}
          className="inline-flex items-center gap-2 mb-6 text-blue-500 hover:text-blue-700 transition-colors"
        >
          <ArrowLeft size={18} />
          <span>{t("back_to_blogs")}</span>
        </button>

        {/* Blog header */}
        <h1 className="mb-6 font-bold text-3xl md:text-4xl lg:text-5xl">{blogPost.title}</h1>

        {/* Meta information */}
        <div className="flex flex-wrap gap-4 mb-8 text-gray-600">
          {blogPost.created_at && (
            <div className="flex items-center gap-1">
              <Calendar size={16} />
              <span>
                {new Date(blogPost.created_at).toLocaleDateString(i18n.language === "uz" ? "uz-UZ" : "en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          )}
          {blogPost.category && (
            <div className="flex items-center gap-1">
              <Tag size={16} />
              <span>{blogPost.category.name}</span>
            </div>
          )}
        </div>

        {/* Featured image */}
        {blogPost.picture_urls && (
          <div className="mb-8 rounded-xl overflow-hidden">
            <img
              src={blogPost.picture_urls || "/placeholder.svg"}
              alt={blogPost.title}
              className="w-full h-auto max-h-[500px] object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="max-w-none prose prose-lg">
          {/* If content is HTML */}
          {blogPost.content_html ? (
            <div dangerouslySetInnerHTML={{ __html: blogPost.content_html }} />
          ) : (
            // If content is plain text
            <div className="whitespace-pre-wrap">{blogPost.content}</div>
          )}
        </div>

        {/* 
        {blogPost.related_posts && blogPost.related_posts.length > 0 && (
          <div className="mt-16">
            <h2 className="mb-6 font-bold text-2xl">{t("related_posts")}</h2>
            <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {blogPost.related_posts.map((relatedPost) => (
                <div
                  key={relatedPost.id}
                  onClick={() => navigate(`/blogs/${relatedPost.id}`)}
                  className="bg-white shadow-md hover:shadow-lg rounded-lg overflow-hidden transition-shadow cursor-pointer"
                >
                  {relatedPost.picture_urls && (
                    <div className="aspect-[16/9]">
                      <img
                        src={relatedPost.picture_urls || "/placeholder.svg"}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="mb-2 font-bold text-lg line-clamp-2">{relatedPost.title}</h3>
                    {relatedPost.content && <p className="text-gray-600 line-clamp-2">{relatedPost.content}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )} */}
      </div>
    </div>
  )
}

export default BlogDetail