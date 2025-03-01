import React from "react"
import { Card } from "antd"

export const CoursesCard = ({ card }) => {
  return (
    <Card
      hoverable
      className="mx-2 my-4 w-[280px] overflow-hidden"
      cover={
        <div className="h-40 overflow-hidden">
          <img
            alt={card.name}
            src={card.image_url || "/placeholder.svg"}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 ease-in-out transform"
          />
        </div>
      }
    >
      <div className="p-4">
        <h3 className="mb-2 font-semibold text-blue-900 text-lg line-clamp-2">{card.name}</h3>
        <p className="mb-4 text-gray-600 text-sm line-clamp-3">{card.description}</p>
        <div className="flex justify-between items-center pt-4 border-gray-200 border-t">
          <p className="text-sm">
            <span className="text-red-600">{card.category_name}</span>
          </p>
          <a href="#" className="font-medium text-blue-600 hover:text-blue-800 text-sm">
            →
          </a>
        </div>
      </div>
    </Card>
  )
}