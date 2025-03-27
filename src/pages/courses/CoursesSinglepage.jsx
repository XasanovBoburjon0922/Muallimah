"use client"

import { useEffect, useState } from "react";
import { Image } from "antd";
import { Lock, Play } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [courseDetails, setCourseDetails] = useState([]);
  const [userLessons, setUserLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t, i18n } = useTranslation();
  const [error, setError] = useState(null);

  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
    fetchCourseDetails(language);
    fetchUserLessons();
  };

  useEffect(() => {
    fetchCourseDetails(i18n.language);
    fetchUserLessons();
  }, [id, i18n.language]);

  const fetchCourseDetails = async (language) => {
    try {
      const userData = JSON.parse(localStorage.getItem("muallimah-user"));
      const token = userData?.access_token;
      if (!token) {
        throw new Error("Foydalanuvchi tokeni topilmadi!");
      }

      const response = await fetch(
        `https://beta.themuallimah.uz/v1/course/details/${id}?language=${language}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Serverdan noto'g'ri javob keldi");
      }

      const data = await response.json();
      setCourseDetails(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const fetchUserLessons = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("muallimah-user"));
      const token = userData?.access_token;
      if (!token) {
        throw new Error("Foydalanuvchi tokeni topilmadi!");
      }

      const response = await fetch(
        `https://beta.themuallimah.uz/v1/user-lessons/list?course_id=${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Darslarni yuklashda xatolik yuz berdi");
      }

      const data = await response.json();
      setUserLessons(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>{t("loading")}...</div>;
  if (error) return <div>{t("error")}: {error}</div>;

  const courseInfo = courseDetails || {};
  const courseName = courseInfo.name || t("course_name");
  const courseImage = courseInfo.image_url || "https://picsum.photos/300/200?random=1";
  const coursePrice = courseInfo.price || 0;
  const teacherName = courseInfo.teacher_name || t("teacher_name");
  const teacherImage = courseInfo.teacher_img_url || "https://picsum.photos/300/200?random=4";
  const teacherExperience = courseInfo.experience || t("teacher_experience");

  // Group lessons by module/description if needed
  const modules = [
    {
      title: courseInfo.description || t("course_description"),
      lessons: userLessons.map(lesson => ({
        id: lesson.id,
        icon: lesson.is_unlocked ? <Play size={20} /> : <Lock size={20} />,
        title: lesson.title,
        progress: `${lesson.watched_progress || 0}%`,
        locked: !lesson.is_unlocked,
        video_url: lesson.video_url,
        lesson_number: lesson.lesson_number
      }))
    },
  ];

  const instructors = [
    {
      id: 1,
      name: teacherName,
      description: teacherExperience,
      image: teacherImage,
    },
  ];

  const handleLessonClick = (id) => {
    navigate(`/lessons/${id}`);
  };

  return (
    <div className="bg-[#F8F9FB]">
      <div className="flex lg:flex-row flex-col justify-between">
        <div className="bg-[#0F172A] p-4 lg:p-8 w-full lg:w-[37%] text-white">
          <div className="flex flex-col items-center gap-4 lg:gap-8">
            <Image
              src={courseImage}
              alt={t("course_thumbnail")}
              preview={false}
              width={320}
              className="rounded-lg"
            />
            <div className="lg:text-left text-center">
              <h1 className="mb-2 font-bold text-2xl lg:text-4xl">{courseName}</h1>
              <p className="mb-4 text-gray-400">{t("mentor")}: {teacherName}</p>
              <div>
                <p className="mb-1 text-gray-400 text-sm">{t("course_price")}:</p>
                <div className="flex justify-center lg:justify-start items-center gap-2">
                  <span className="font-bold text-xl lg:text-2xl">{coursePrice} {t("sum")}</span>
                  <span className="text-gray-400 text-sm line-through">{coursePrice * 2} {t("sum")}</span>
                </div>
              </div>
              <div className="flex flex-wrap justify-center lg:justify-start gap-2 mt-4">
                <button className="bg-white px-6 py-2 rounded-lg font-medium text-[#0F172A]">{t("buy")}</button>
                <button className="px-4 py-2 border border-white/20 rounded-lg">U</button>
                <button className="px-4 py-2 border border-white/20 rounded-lg">HUMO</button>
                <button className="px-4 py-2 border border-white/20 rounded-lg">Payme</button>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto px-4 py-8 w-full lg:w-[60%] container">
          <div className="space-y-6">
            {modules.map((module, idx) => (
              <div key={idx} className="bg-white shadow-sm p-4 lg:p-6 rounded-xl">
                <h2 className="mb-4 font-semibold text-lg lg:text-xl">
                  {module.title}
                </h2>
                <div className="space-y-3">
                  {module.lessons.map((lesson, lessonIdx) => (
                    <div
                      key={lessonIdx}
                      className={`flex justify-between items-center hover:bg-gray-50 py-3 ${lesson.locked ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
                      onClick={() => !lesson.locked && handleLessonClick(lesson.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`flex justify-center items-center rounded-lg w-8 lg:w-10 h-8 lg:h-10 ${lesson.locked ? 'bg-gray-400' : 'bg-[#0F172A] text-white'}`}>
                          {lesson.icon}
                        </div>
                        <div>
                          <span className="font-medium text-sm lg:text-base">{lesson.title}</span>
                          {lesson.lesson_number && (
                            <p className="text-gray-500 text-xs">Dars {lesson.lesson_number}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="bg-gray-100 rounded-full w-24 lg:w-32 h-2">
                          <div className="bg-[#0F172A] rounded-full h-full" style={{ width: lesson.progress }} />
                        </div>
                        <span className="min-w-[40px] text-gray-500 text-sm">{lesson.progress}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-8 lg:mt-16 px-4 lg:px-[20px]">
        <h2 className="mb-4 lg:mb-8 font-bold text-xl lg:text-2xl">{t("course_instructors")}</h2>
        <div className="gap-4 lg:gap-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {instructors.map((instructor) => (
            <div key={instructor.id} className="flex flex-col items-center bg-white p-4 lg:p-6 rounded-lg text-center">
              <div className="mb-4 w-24 lg:w-32 h-24 lg:h-32">
                <Image
                  src={instructor.image || "/placeholder.svg"}
                  alt={instructor.name}
                  preview={false}
                  className="rounded-full object-cover"
                  width={128}
                  height={128}
                />
              </div>
              <h3 className="font-semibold text-base lg:text-lg">{instructor.name}</h3>
              <p className="mt-2 text-gray-400 text-sm leading-relaxed">{instructor.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}