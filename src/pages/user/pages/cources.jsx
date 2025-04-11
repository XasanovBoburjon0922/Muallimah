import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const getToken = () => {
  const user = JSON.parse(localStorage.getItem("muallimah-user"));
  return user ? user.access_token : null;
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
    api.get('/user-course/list')
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
        <p className="font-bold text-pink-500">Course purchase</p>
      </div>
      <div className="mt-4">
        {userCourses.length === 0 ? (
          <p className="text-center">Siz hali hech qanday kurs sotib olmadingiz.</p>
        ) : (
          userCourses.map(course => (
            <div
              key={course.id}
              className="shadow-md mb-6 p-4 border rounded-lg w-[200px] cursor-pointer"
              onClick={() => handleCourseClick(course.course_id)}
            >
              <h2 className="font-bold text-xl">{course.course_name}</h2>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserCourses;