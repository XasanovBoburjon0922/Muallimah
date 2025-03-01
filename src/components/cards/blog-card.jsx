import React from "react";
import "./cards.css";
import { Card, Carousel } from "antd";
import { formatDate } from "../../utils/format-date";
import { nanoid } from "nanoid";

export const BlogCard = ({ card }) => {
  return (
    <Card
      key={nanoid()}
      hoverable
      className="mx-2 my-4 w-[280px] h-[380px] overflow-hidden"
      cover={
        <div className="h-40 overflow-hidden">
          <Carousel
            draggable
            arrows={false} // Mobil uchun o'qlarni olib tashlash
            dots={{ className: "custom-dots" }}
            className="w-full min-w-72 max-w-72"
          >
            {card.picture_urls?.map((img, index) => (
              <img
                className="rounded-lg w-full md:w-[288px] h-[130px] md:h-[162px] object-cover"
                src={img}
                alt="img"
                key={index}
              />
            ))}
          </Carousel>
        </div>
      }
    >
      <div className="flex flex-col gap-[30px]">
        <div className="p-[15px] md:p-[25px] text-start">
          <h3 className="mb-2 font-semibold text-blue-900 text-xl md:text-2xl line-clamp-2 leading-5 xl:leading-7">
            {card.title}
          </h3>
          <p className="text-gray-500 text-xs md:text-sm line-clamp-4">
            {card.content}
          </p>
        </div>
      </div>
      <div className="bottom-4 absolute px-[15px] md:px-[25px] h-fit text-[#BDBDBD]">
        <p className="font-primary font-semibold text-xs">
          {formatDate(card.created_at)}
        </p>
      </div>
    </Card>
  );
};