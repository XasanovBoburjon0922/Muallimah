"use client"

import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"
import YouTubeStylePlayer from "../../components/youtubeplayer/youtubeplayer"
import { useTranslation } from "react-i18next"

const Lessons = () => {
  const [lessonContent, setLessonContent] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentLesson, setCurrentLesson] = useState(0)
  const { id } = useParams() // This now represents the lesson ID from the URL
  const { t, i18n } = useTranslation()

  const changeLanguage = (language) => {
    i18n.changeLanguage(language)
    fetchLessonDetails(language)
  }

  useEffect(() => {
    fetchLessonDetails(i18n.language)
  }, [id, i18n.language])

  const fetchLessonDetails = async (language) => {
    const userData = JSON.parse(localStorage.getItem("muallimah-user"))
    const token = userData?.access_token

    try {
      const response = await axios.get(
        `https://beta.themuallimah.uz/v1/user-lessons/${id}?language=${language}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      // Since we're getting a single lesson now, we'll wrap it in an array
      if (response.data) {
        setLessonContent([response.data])
      } else {
        setLessonContent([])
      }
    } catch (error) {
      console.error("Error fetching lesson:", error)
      setError(t("fetch_error"))
    } finally {
      setLoading(false)
    }
  }


  if (loading) {
    return <div className="flex justify-center items-center h-screen text-lg">{t("loading")}...</div>
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-600 text-lg">{error}</div>
  }

  // Since we're showing a single lesson now, we don't need navigation between lessons
  const currentLessonData = lessonContent[0]

  return (
    <div className="mx-auto p-5 max-w-6xl">
      {currentLessonData && (
        <div className="space-y-6">
          {currentLessonData.video_url && (
            <div className="shadow-lg rounded-lg overflow-hidden">
              <YouTubeStylePlayer videoUrl={currentLessonData.video_url} lessonId={currentLessonData.id}/>
            </div>
          )}

          <h1 className="font-semibold text-2xl">{currentLessonData.title}</h1>
          {/* <p>
            <strong>{t("course_name")}:</strong> {currentLessonData.course_name}
          </p>
          <p>
            <strong>{t("tasks")}:</strong> {currentLessonData.tasks}
          </p> */}

          <ReactQuill
            value={currentLessonData.description}
            readOnly={true}
            theme={"snow"}
            modules={{ toolbar: false }}
          />

        </div>
      )}
    </div>
  )
}

export default Lessons