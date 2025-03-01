import React from "react";
import { Carousel } from "antd";
import { nanoid } from "nanoid";

const feedbackData = [
  {
    id: 1,
    img1: "google_icon.png",
    title: "Axmadjon Axmadjanov",
    text: "Oldingi My grammar notes#1 da o'qiganimda darslarda Uyga vazifa ko'p berilardi va bularni bajarish uchun vaqt kam berilardi. Asosan biz o'zimiz qattiq harakat qilishimiz kerak bo'lardi. Darslar tez o'tilardi. Speaking ga unchalik ko'p etibor bermasdik. Ko'proq urg'u grammar ga qaratilardi. Hozirgi Men o'qiyotgan My grammar notes#3 oldingisidan tubdan farq qiladi. Darslar sifatli va tushunarli. Londa va o'rtacha tezlikda o'tiladi. Vazifalar ham ko'p emas va ularni bajarish uchun vaqt yetarli. Hozirgi kursimizda faqat grammarga etibor qaratmasdan speaking ga juda ham katta urg'u berilmoqda. Writing reading ayniqsa pronunciation ga ham e'tibor kuchli. Xulosa qilib aytganda hozirgi My grammar notes#3 kursimiz asosan grammar ga tashkil qilingan bo'lsada unda talabalar grammar bilimlarini mustahkamlab balki speaking writing ko'nikmalarini ham oshirishlari mumkin.",
    img: "feedback.png",
  },
  {
    id: 2,
    img1: "google_icon.png",
    title: "Jumadullayev Sunnat",
    text: "Oldingi My grammar notes#1 da o'qiganimda darslarda Uyga vazifa ko'p berilardi va bularni bajarish uchun vaqt kam berilardi. Asosan biz o'zimiz qattiq harakat qilishimiz kerak bo'lardi. Darslar tez o'tilardi. Speaking ga unchalik ko'p etibor bermasdik. Ko'proq urg'u grammar ga qaratilardi.Hozirgi Men o'qiyotgan My grammar notes#3 oldingisidan tubdan farq qiladi. Darslar sifatli va tushunarli. Londa va o'rtacha tezlikda o'tiladi. Vazifalar ham ko'p emas va ularni bajarish uchun vaqt yetarli. Hozirgi kursimizda faqat grammarga etibor qaratmasdan speaking ga juda ham katta urg'u berilmoqda. Writing reading ayniqsa pronunciation ga ham e'tibor kuchli. Xulosa qilib aytganda hozirgi My grammar notes#3 kursimiz asosan grammar ga tashkil qilingan bo'lsada unda talabalar grammar bilimlarini mustahkamlab balki speaking writing ko'nikmalarini ham oshirishlari mumkin.",
    img: "feedback.png",
  },
  {
    id: 3,
    img1: "google_icon.png",
    title: "Hamidov Laziz",
    text: "Oldingi My grammar notes#1 da o'qiganimda darslarda Uyga vazifa ko'p berilardi va bularni bajarish uchun vaqt kam berilardi. Asosan biz o'zimiz qattiq harakat qilishimiz kerak bo'lardi. Darslar tez o'tilardi. Speaking ga unchalik ko'p etibor bermasdik. Ko'proq urg'u grammar ga qaratilardi.Hozirgi Men o'qiyotgan My grammar notes#3 oldingisidan tubdan farq qiladi. Darslar sifatli va tushunarli. Londa va o'rtacha tezlikda o'tiladi. Vazifalar ham ko'p emas va ularni bajarish uchun vaqt yetarli. Hozirgi kursimizda faqat grammarga etibor qaratmasdan speaking ga juda ham katta urg'u berilmoqda. Writing reading ayniqsa pronunciation ga ham e'tibor kuchli. Xulosa qilib aytganda hozirgi My grammar notes#3 kursimiz asosan grammar ga tashkil qilingan bo'lsada unda talabalar grammar bilimlarini mustahkamlab balki speaking writing ko'nikmalarini ham oshirishlari mumkin.",
    img: "feedback.png",
  },
];

const HomeFeedbacks = () => {
  return (
    <Carousel
      draggable
      autoplay
      swipeToSlide={true}
      autoplaySpeed={5000}
      pauseOnHover={false}
      pauseOnDotsHover={false}
      className="relative bg-[#00235a] pb-14 flex items-center justify-center"
    >
      {feedbackData.map((item) => (
        <div
          key={nanoid()}
          className="relative w-full h-auto px-4 overflow-hidden  md:px-8 lg:px-0"
        >
          <p className="absolut top-0 left-0 w-full text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center font-secondary text-white pt-[20px] md:pt-[30px] lg:pt-[35px]">
            Feedback
          </p>
          <div className="max-w-[1242px] max-h-[448px] mx-auto h-auto rounded-[10px] mt-10 bg-gray-50 flex flex-col-reverse md:flex-row flex-wrap items-start justify-between text-left p-6">
            <div className="p-[20px] md:px-[44px] md:py-[30px]">
              <div className="flex gap-5 items-center">
                <img
                  src={item.img1}
                  alt="Google icon"
                  className="w-16 h-auto hidden md:block"
                />

                <h1 className="text-2xl font-bold text-left text-[#ff4756]">
                  {item.title}
                </h1>
              </div>
              <p className="w-full  line-clamp-[10] lg:max-w-[585px] text-sm md:text-base mt-[15px] md:mt-[26px] mb-[18px] md:mb-[56px] text-[#00235a]">
                {item.text}
              </p>
            </div>

            <div
              className="mt-32 justify-center mb-4 md:mt-25 p-10 w-72 h-[261px] rounded-lg bg-white"
              style={{ boxShadow: "0px 20px 40px -5px rgba(0,0,0,0.04)" }}
            >
              <img
                src={item.img}
                alt="feedback"
                className="w-[200px] md:w-[300px] lg:w-[600px] h-auto"
              />
              <p className="w-[238px] text-xl font-semibold pt-4 pl-4 text-left text-[#00235a]">
                My Grammar Notes
              </p>
              <div className="flex items-center w-24 h-5 gap-1 mt-2 ml-4">
                <p className="left-[983px] top-[4812px] text-sm font-semibold text-left text-[#00235a]">
                  4,5
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </Carousel>
  );
};

export default HomeFeedbacks;
