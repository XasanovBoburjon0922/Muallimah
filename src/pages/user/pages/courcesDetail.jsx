import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import YouTubeStylePlayer from '../../../components/youtubeplayer/youtubeplayer'; // YouTube videolarini ko'rsatish uchun komponent

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

const CourseDetails = () => {
    const { courseId } = useParams();
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentLesson, setCurrentLesson] = useState(0); // Joriy dars indeksi

    useEffect(() => {
        api.get(`/user-lessons/list?course_id=${courseId}`)
            .then(response => {
                setLessons(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Darslarni yuklashda xatolik:', error);
                setError('Darslarni yuklashda xatolik yuz berdi.');
                setLoading(false);
            });
    }, [courseId]);

    if (loading) {
        return <div className="mt-4 text-center">Yuklanmoqda...</div>;
    }

    if (error) {
        return <div className="mt-4 text-red-500 text-center">{error}</div>;
    }

    const totalLessons = lessons.length;
    const progress = ((currentLesson + 1) / totalLessons) * 100; // Progress foizini hisoblash
    const isLastLesson = currentLesson === totalLessons - 1; // Oxirgi darsni tekshirish

    const handleNextLesson = () => {
        if (currentLesson < totalLessons - 1) {
            setCurrentLesson(currentLesson + 1);
        }
    };

    const handlePrevLesson = () => {
        if (currentLesson > 0) {
            setCurrentLesson(currentLesson - 1);
        }
    };

    const handleFinishLesson = async () => {
        const token = getToken();
        try {
            await api.post(`/lesson/finish`, {
                lesson_id: lessons[currentLesson].id,
                course_id: courseId,
            });
            alert('Dars muvaffaqiyatli yakunlandi!');
        } catch (error) {
            console.error('Darsni yakunlashda xatolik:', error);
            alert('Darsni yakunlashda xatolik yuz berdi.');
        }
    };

    return (
        <div className="p-4 pt-4">
            <h1 className="mb-6 font-bold text-2xl text-center">Kurs Darslari</h1>

            {/* Progress bar */}
            <div className="flex items-center gap-3 mb-6">
                <button
                    className="hover:bg-gray-100 mb-[5px] rounded text-2xl"
                    onClick={handlePrevLesson}
                    disabled={currentLesson === 0}
                >
                    ←
                </button>
                <div className="relative flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div className="bg-green-600 h-full transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
                <button
                    className="hover:bg-gray-100 mb-[5px] rounded text-2xl"
                    onClick={handleNextLesson}
                    disabled={isLastLesson}
                >
                    →
                </button>
            </div>

            {/* Darsni ko'rsatish */}
            {lessons[currentLesson] && (
                <div className="space-y-6 mx-8">
                    {lessons[currentLesson].video_url && (
                        <div className='flex justify-center items-center mt-2'>
                            <div className="w-[500px] h-[300px]">
                                <YouTubeStylePlayer videoUrl={lessons[currentLesson].video_url} />
                            </div>
                        </div>
                    )}
                    <h3 className="font-semibold text-lg">{lessons[currentLesson].lesson_number}. {lessons[currentLesson].title}</h3>
                    <p className="text-gray-600 text-sm">{lessons[currentLesson].description}</p>
                    <p className={`text-sm ${lessons[currentLesson].is_unlocked ? 'text-green-500' : 'text-red-500'}`}>
                        {lessons[currentLesson].is_unlocked ? 'Ochiq' : 'Yopiq'}
                    </p>
                    {/* Tugmalar */}
                    <div className="flex gap-4">
                        {!isLastLesson && (
                            <button
                                className="bg-black hover:bg-gray-900 px-6 py-3 rounded-lg text-white transition-colors"
                                onClick={handleNextLesson}
                            >
                                Keyingi dars
                            </button>
                        )}

                        {isLastLesson && (
                            <button
                                className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg text-white transition-colors"
                                onClick={handleFinishLesson}
                            >
                                Darsni yakunlash
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseDetails;