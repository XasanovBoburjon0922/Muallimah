import React from "react";
import CountUp from "react-countup";
import StudentsBg from "../../assets/icons/amounts/students-bg";
import CoursesBg from "../../assets/icons/amounts/courses-bg";
import ExperianceBg from "../../assets/icons/amounts/experiance-bg";
import StudentsWorldBg from "../../assets/icons/amounts/students-world-bg";
import ViewsBg from "../../assets/icons/amounts/views-bg";
import { useTranslation } from "react-i18next"; // useTranslation hookini import qilish

const data = [
  { end: 15, suffix: "+", text: "years_of_experience", icon: <ExperianceBg /> },
  { end: 300, suffix: "+", text: "students", icon: <StudentsBg /> },
  { end: 1, suffix: "M+", text: "views", icon: <ViewsBg /> },
  {
    end: 100,
    suffix: "K+",
    text: "students_worldwide",
    icon: <StudentsWorldBg />,
  },
  { end: 10, suffix: "+", text: "courses", icon: <CoursesBg /> },
];

export const HomeAmounts = () => {
  const { t } = useTranslation(); // useTranslation hookini ishlatish

  return (
    <div className="my-10 mt-20 container">
      <div className="flex flex-wrap justify-evenly items-center gap-3">
        {data.map((item, index) => (
          <div
            key={index}
            className="relative flex flex-col justify-between bg-no-repeat pt-14 w-[135px] h-[160px] text-center"
          >
            <div className="top-0 absolute w-full">{item.icon}</div>
            <CountUp
              end={item.end}
              suffix={item.suffix}
              className="z-10 sticky font-secondary font-normal text-white text-2xl"
            />
            <p className="mt-10 font-primary font-semibold text-primary text-sm text-center">
              {t(item.text)} {/* Tilga mos matnni olish */}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeAmounts;