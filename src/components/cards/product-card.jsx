import { Card, Carousel } from "antd";
import React from "react";
import { nanoid } from "nanoid";

export const ProductCard = ({ card }) => {
  return (
    <Card
      key={nanoid()}
      hoverable
      className="mx-2 my-4 w-[280px] h-[380px] overflow-hidden"
      cover={
        <div className="h-40 overflow-hidden">
          <Carousel
            draggable
            arrows
            dots={{ className: "custom-dots" }}
            className="w-full min-w-72 max-w-72"
          >
            {card.picture_urls?.map((img, index) => (
              <img
                className="rounded-lg w-full md:w-[288px] h-[130px] md:h-[162px] object-cover"
                src={img}
                alt="img"
              />
            ))}
          </Carousel>
        </div>
      }
    >
      <div className="p-4">
        <div className="flex flex-col justify-between h-[130px]">
          <div>
            <h3 className="mb-2 font-semibold text-blue-900 text-lg line-clamp-2">{card.title}</h3>
            <p className="mb-4 text-gray-600 text-sm line-clamp-3">{card.description}</p>
          </div>
          <div className="flex justify-between items-center pt-4 border-gray-200 border-t">
            <p className="text-sm">
              <span className="text-red-600">{card.price} so'm</span>
            </p>
            <a href="#" className="font-medium text-blue-600 hover:text-blue-800 text-sm">
              Add to cat →
            </a>
          </div>
        </div>
      </div>
    </Card>
  );
};