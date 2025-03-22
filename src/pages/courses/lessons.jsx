"use client"

import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"
import YouTubeStylePlayer from "../../components/youtubeplayer/youtubeplayer"
import { useTranslation } from "react-i18next" // Tarjima uchun hook

const Lessons = () => {
  const [lessonContent, setLessonContent] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentLesson, setCurrentLesson] = useState(0)
  const { id } = useParams()
  const { t, i18n } = useTranslation() // Tarjima uchun

  // Tilni o'zgartirish funksiyasi
  const changeLanguage = (language) => {
    i18n.changeLanguage(language)
    fetchLessons(language) // Til o'zgarganida darslarni qayta yuklash
  }

  useEffect(() => {
    fetchLessons(i18n.language) // Komponent yuklanganda darslarni yuklash
  }, [id, i18n.language])

  const fetchLessons = async (language) => {
    const userData = JSON.parse(localStorage.getItem("muallimah-user"))
    const token = userData?.access_token

    try {
      const response = await axios.get(
        `https://beta.themuallimah.uz/v1/lesson/list?course_id=${id}&language=${language}`, // Til parametri qo'shildi
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      console.log(response.data)

      if (Array.isArray(response.data.lessons)) {
        setLessonContent(response.data.lessons)
      } else {
        setLessonContent([])
      }
    } catch (error) {
      console.error("Error fetching lessons:", error)
      setError(t("fetch_error")) // Tarjima qo'llandi
    } finally {
      setLoading(false)
    }
  }

  const handleFinishLesson = async () => {
    const userData = JSON.parse(localStorage.getItem("muallimah-user"))
    const token = userData?.access_token

    try {
      await axios.post(
        `https://beta.themuallimah.uz/v1/lesson/finish`,
        {
          lesson_id: lessonContent[currentLesson].id,
          course_id: id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      alert(t("lesson_finished")) // Tarjima qo'llandi
    } catch (error) {
      console.error("Error finishing lesson:", error)
      alert(t("finish_error")) // Tarjima qo'llandi
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-lg">{t("loading")}...</div> // Tarjima qo'llandi
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-600 text-lg">{error}</div>
  }

  const totalLessons = lessonContent.length
  const progress = ((currentLesson + 1) / totalLessons) * 100
  const isLastLesson = currentLesson === totalLessons - 1

  return (
    <div className="mx-auto p-5 max-w-6xl">
      <div className="flex items-center gap-3 mb-6">
        <button
          className="hover:bg-gray-100 mb-[5px] rounded text-2xl"
          onClick={() => setCurrentLesson((prev) => Math.max(0, prev - 1))}
          disabled={currentLesson === 0}
        >
          ←
        </button>
        <div className="relative flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
          <div className="bg-green-600 h-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
        <button
          className="hover:bg-gray-100 mb-[5px] rounded text-2xl"
          onClick={() => setCurrentLesson((prev) => Math.min(totalLessons - 1, prev + 1))}
          disabled={isLastLesson}
        >
          →
        </button>
      </div>

      {lessonContent[currentLesson] && (
        <div className="space-y-6">
          {lessonContent[currentLesson].video_url && (
            <div className="shadow-lg rounded-lg overflow-hidden">
              <YouTubeStylePlayer videoUrl={lessonContent[currentLesson].video_url} />
            </div>
          )}

          <h1 className="font-semibold text-2xl">{lessonContent[currentLesson].title}</h1>
          <p>
            <strong>{t("course_name")}:</strong> {lessonContent[currentLesson].course_name}
          </p>
          <p>
            <strong>{t("tasks")}:</strong> {lessonContent[currentLesson].tasks}
          </p>

          <ReactQuill
            value={lessonContent[currentLesson].description}
            readOnly={true}
            theme={"snow"}
            modules={{ toolbar: false }}
          />

          <div className="flex gap-4">
            {!isLastLesson && (
              <button
                className="bg-black hover:bg-gray-900 px-6 py-3 rounded-lg text-white transition-colors"
                onClick={() => setCurrentLesson((prev) => Math.min(totalLessons - 1, prev + 1))}
              >
                {t("continue")}
              </button>
            )}

            {isLastLesson && (
              <button
                className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg text-white transition-colors"
                onClick={handleFinishLesson}
              >
                {t("finish_lesson")}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Lessons