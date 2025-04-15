import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const getToken = () => {
  const user = JSON.parse(localStorage.getItem("muallimah-user"));
  return user ? user.access_token : null;
};

const getUserId = () => {
  const user = JSON.parse(localStorage.getItem("muallimah-user"));
  return user ? user.id : null;
};

const api = axios.create({
  baseURL: 'https://beta.themuallimah.uz/v1',
});

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const UserCourses = () => {
  const [userCourses, setUserCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = getUserId();
    if (!userId) {
      setError('Foydalanuvchi ma\'lumotlari topilmadi');
      setLoading(false);
      return;
    }

    api.get(`/user-course/list?user_id=${userId}`)
      .then(response => {
        setUserCourses(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Kurslarni yuklashda xatolik:', error);
        setError('Kurslarni yuklashda xatolik yuz berdi.');
        setLoading(false);
      });
  }, []);

  const handleCourseClick = (courseId) => {
    navigate(`/user-panel/my-courses/${courseId}`);
  };

  if (loading) {
    return <div className="mt-4 text-center">Yuklanmoqda...</div>;
  }

  if (error) {
    return <div className="mt-4 text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="pt-4">
      <div className="flex justify-center gap-[6px]">
        <p>Purchased courses are not available,</p>
        <a href='/courses' className="font-bold text-pink-500 cursor-pointer">Course purchase</a>
      </div>
      <div className="mt-4">
        {userCourses.length === 0 ? (
          <p className="text-center">Siz hali hech qanday kurs sotib olmadingiz.</p>
        ) : (
          <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {userCourses.map(course => (
              <div
                key={course.id}
                className="shadow-md hover:shadow-lg p-4 border rounded-lg transition-shadow cursor-pointer"
                onClick={() => handleCourseClick(course.course_id)}
              >
                <h2 className="mb-2 font-bold text-xl">{course.course_name}</h2>
                {course.image_url && (
                  <img 
                    src={course.image_url} 
                    alt={course.course_name}
                    className="mb-2 rounded-md w-full h-40 object-cover"
                  />
                )}
                <p className="text-gray-600">{course.description || 'Tavsif mavjud emas'}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCourses;