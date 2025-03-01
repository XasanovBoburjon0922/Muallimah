import React from "react";
import { Link } from "react-router-dom";

const HomeAbout = () => {
  return (
    <div id="about" className="container mt-[173px]">
      <p className="text-4xl md:text-6xl text-left font-secondary text-spacial_red  mb-20">
        About The Muallimah
      </p>
      <div className="items-center gap-24 md:flex">
        <img className="w-[282px]" src="Teacher1.png" alt="" />
        <div className="pb-10">
          <p className="max-w-[600px] mb-10 text-base text-left text-primary">
            Find out more about the most popular and experienced uzbek ESL
            tutor/teacher of EuroAsia, who has more than 15 years of teaching
            experience in Uzbekistan and in EuroAsia.
          </p>
          <Link
            to="/about"
            className="sm:px-10 lg:mt-[54px] border text-base font-medium text-white px-[30px] py-2 rounded-md bg-primary hover:bg-secondary hover:text-primary hover:border-primary hover:border transition-all duration-500"
          >
            Learn more
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomeAbout;
