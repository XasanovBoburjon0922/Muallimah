import React from "react";
import { Link } from "react-router-dom";
import { Carousel } from "antd";
import { nanoid } from "nanoid";
import "./home.css"


const bannerData = [
  {
    id: 1,
    title: "250+ Free online courses",
    text: "This course is for self-disciplined, hard-working and ambitious students. Learn English with the Muallimah any time, anywhere and become fluent in English.",
    img: "bannerImg.png",
  },
  {
    id: 2,
    title: "100+ Language Programs",
    text: "Join our diverse language programs to improve your skills. Learn from the best instructors globally.",
    img: "bannerImg.png",
  },
  {
    id: 3,
    title: "50+ Free eBooks",
    text: "Explore our collection of free eBooks to enhance your learning experience.",
    img: "bannerImg.png",
  },
];

const HomeBanner = () => {
  return (
    <Carousel
      className="relative bg-primary pb-14 min-h-[630px] md:min-h-[559px]  flex items-center justify-center"
      autoplay
      swipeToSlide={true}
      autoplaySpeed={3500}
      draggable
      pauseOnHover={false}
      pauseOnDotsHover={false}
      dots={{ className: "custom-dots-1" }}
    >
      {bannerData.map((item) => (
        <div
          key={nanoid()}
          className="relative w-full h-auto px-4  overflow-hidden  md:px-8 lg:px-0"
        >
          <p className="w-full text-4xl pb-5 text-center font-secondary text-white pt-[20px] md:pt-[30px] lg:pt-[35px]">
            Free Online Language Courses
          </p>
          <div className="max-w-[1242px] mx-auto h-auto rounded-[10px] bg-gray-50 flex flex-col-reverse md:flex-row items-center justify-between min-h-[427px] md:min-h-[335px]">
            <div className="p-[20px] md:px-[44px] md:py-[30px]">
              <h1 className="text-2xl md:text-3xl font-secondary text-start  font-normal lg:text-5xl text-spacial_red">
                {item.title}
              </h1>
              <p className="w-full md:w-[450px] lg:w-[499px] text-sm md:text-base mt-[15px] md:mt-[26px] mb-[18px] md:mb-[56px] text-primary font-primary text-start">
                {item.text}
              </p>
              <div className="flex justify-center md:justify-start items-center w-full md:w-[182px] relative gap-2.5 px-6 py-2 rounded-md bg-primary mx-auto md:mx-0 hover:bg-secondary hover:border-primary border text-accent hover:text-primary transition-all duration-500">
                <Link
                  to="/books"
                  className="block mx-auto text-sm font-medium md:text-base font-primary"
                >
                  Learn free
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center  md:mb-0">
              <img
                src={item.img}
                alt="banner"
                className="object-contain w-full max-w-[332px] md:max-w-[502px] h-full min-h-[221px] md:min-h-[335px]"
              />
            </div>
          </div>
        </div>
      ))}
    </Carousel>
  );
};

export default HomeBanner;
