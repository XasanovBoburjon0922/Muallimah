"use client"

import { useEffect, useState } from "react";
import { Image } from "antd";
import { Lock, Play } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import { useTranslation } from "react-i18next";

export default function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate(); // Initialize useNavigate
  const [courseDetails, setCourseDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t, i18n } = useTranslation();
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        // Get token from localStorage
        const userData = JSON.parse(localStorage.getItem("muallimah-user"));
        const token = userData?.access_token;
        if (!token) {
          throw new Error("Foydalanuvchi tokeni topilmadi!");
        }

        const response = await fetch(
          `https://beta.themuallimah.uz/v1/course/details/{id}?id=${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Serverdan noto‘g‘ri javob keldi");
        }

        const data = await response.json();
        setCourseDetails(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Extract course information from the first item in the array
  const courseInfo = courseDetails[0] || {};
  const courseName = JSON.parse(courseInfo.course_name || "{}").uz || "Kurs nomi";
  const courseImage = courseInfo.course_img_url || "https://picsum.photos/300/200?random=1";
  const coursePrice = courseInfo.course_price || 0;
  const teacherName = courseInfo.teacher_name || "O'qituvchi nomi";
  const teacherImage = courseInfo.teacher_img_url || "https://picsum.photos/300/200?random=4";
  const teacherExperience = courseInfo.teacher_experience || "O'qituvchi tajribasi";

  // Extract modules from courseDetails
  const modules = courseDetails.map((course, idx) => ({
    title: course.course_theme,
    lessons: [
      {
        id: course.course_lesson_id, // Add lesson ID
        icon: <Play size={20} />,
        title: course.course_lesson_name,
        progress: "0%",
        locked: false,
      },
    ],
  }));

  const instructors = [
    {
      id: 1,
      name: teacherName,
      description: teacherExperience,
      image: teacherImage,
    },
  ];

  // Function to handle lesson click
  const handleLessonClick = (courseId) => {
    navigate(`/lessons/${courseId}`); 
  };

  return (
    <div className="bg-[#F8F9FB]">
      <div className="flex lg:flex-row flex-col justify-between">
        <div className="bg-[#0F172A] p-4 lg:p-8 w-full lg:w-[37%] text-white">
          <div className="flex flex-col items-center gap-4 lg:gap-8">
            <Image
              src={courseImage}
              alt="Course thumbnail"
              preview={false}
              width={320}
              className="rounded-lg"
            />
            <div className="lg:text-left text-center">
              <h1 className="mb-2 font-bold text-2xl lg:text-4xl">{courseName}</h1>
              <p className="mb-4 text-gray-400">Mentor: {teacherName}</p>
              <div>
                <p className="mb-1 text-gray-400 text-sm">Kurs narxi:</p>
                <div className="flex justify-center lg:justify-start items-center gap-2">
                  <span className="font-bold text-xl lg:text-2xl">{coursePrice} so'm</span>
                  <span className="text-gray-400 text-sm line-through">{coursePrice * 2} so'm</span>
                </div>
              </div>
              <div className="flex flex-wrap justify-center lg:justify-start gap-2 mt-4">
                <button className="bg-white px-6 py-2 rounded-lg font-medium text-[#0F172A]">Xarid qilish</button>
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
                  {idx + 1}. {module.title}
                </h2>
                <div className="space-y-3">
                  {module.lessons.map((lesson, lessonIdx) => (
                    <div
                      key={lessonIdx}
                      className="flex justify-between items-center hover:bg-gray-50 py-3 cursor-pointer"
                      onClick={() => handleLessonClick(id, lesson.id)} // Add click handler
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex justify-center items-center bg-[#0F172A] rounded-lg w-8 lg:w-10 h-8 lg:h-10 text-white">
                          {lesson.icon}
                        </div>
                        <span className="font-medium text-sm lg:text-base">{lesson.title}</span>
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
        <h2 className="mb-4 lg:mb-8 font-bold text-xl lg:text-2xl">Kurs o'qituvchilari</h2>
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