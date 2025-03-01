import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaFacebook, FaInstagram, FaLinkedin, FaTelegram } from "react-icons/fa";

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const { t, i18n } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await fetch(
          `https://beta.themuallimah.uz/v1/teacher/list?page=1&limit=10&language=${i18n.language}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (data.users && Array.isArray(data.users)) {
          setTeachers(data.users);
        } else if (Array.isArray(data)) {
          setTeachers(data);
        } else {
          throw new Error("Invalid data format");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, [i18n.language]); // Til o'zgarganida qayta yuklash

  const showModal = (teacher) => {
    setSelectedTeacher(teacher);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-12">
        <div className="border-4 border-gray-900 border-b-transparent rounded-full w-12 h-12 animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return <div className="mt-12 text-center">Error: {error}</div>;
  }

  return (
    <div className="p-5">
      <h1 className="mb-6 font-bold text-primary text-2xl text-center">
        {t("teachers_list")} {/* Tilga mos "O'qituvchilar Ro'yxati" */}
      </h1>
      <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {teachers.map((teacher) => (
          <div
            key={teacher.id}
            className="hover:shadow-lg transition-shadow duration-300 cursor-pointer"
            onClick={() => showModal(teacher)}
          >
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <img
                alt={teacher.full_name}
                src={teacher.photo_url}
                className="w-full h-48 sm:h-56 md:h-64 object-cover"
              />
              <div className="p-4">
                <h2 className="font-semibold text-xl">{teacher.full_name}</h2>
                <p className="text-gray-600">
                  {teacher.about
                    ? teacher.about.slice(0, 50) + "..."
                    : t("no_info")} {/* Tilga mos "Ma'lumot yo'q" */}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalVisible && selectedTeacher && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 p-4">
          <div className="bg-white mx-4 p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="mb-4 font-bold text-2xl">{selectedTeacher.full_name}</h2>
            <div className="flex md:flex-row flex-col justify-between gap-4">
              <img
                alt={selectedTeacher.full_name}
                src={
                  selectedTeacher.photo_url || "https://via.placeholder.com/400"
                }
                className="w-full md:w-[200px] h-48 object-cover"
              />
              <div className="space-y-2 w-full md:w-[60%]">
                <p>
                  <strong>{t("email")}:</strong> {selectedTeacher.email || t("no_info")}
                </p>
                <p>
                  <strong>{t("description")}:</strong> {selectedTeacher.about || t("no_info")}
                </p>
                <p>
                  <strong>{t("experience")}:</strong>{" "}
                  {selectedTeacher.experience || t("no_info")}
                </p>
                <p>
                  <strong>{t("dob")}:</strong> {selectedTeacher.dob || t("no_info")}
                </p>
                <p>
                  <strong>{t("ielts_score")}:</strong>{" "}
                  {selectedTeacher.ielts_score || t("no_info")}
                </p>
                <div>
                  <strong>{t("social_networks")}:</strong>
                  <div className="flex space-x-4 mt-2">
                    {selectedTeacher.facebook_url && (
                      <a
                        href={selectedTeacher.facebook_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <FaFacebook size={24} />
                      </a>
                    )}
                    {selectedTeacher.instagram_url && (
                      <a
                        href={selectedTeacher.instagram_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pink-500 hover:text-pink-700"
                      >
                        <FaInstagram size={24} />
                      </a>
                    )}
                    {selectedTeacher.linkedin_url && (
                      <a
                        href={selectedTeacher.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-700 hover:text-blue-900"
                      >
                        <FaLinkedin size={24} />
                      </a>
                    )}
                    {selectedTeacher.telegram_url && (
                      <a
                        href={selectedTeacher.telegram_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-600"
                      >
                        <FaTelegram size={24} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={handleCancel}
              className="bg-red-500 hover:bg-red-700 mt-4 px-4 py-2 rounded text-white"
            >
              {t("close")} {/* Tilga mos "Yopish" */}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Teachers;