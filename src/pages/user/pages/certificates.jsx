"use client"

import { Empty } from "antd"
import { InfoCircleOutlined } from "@ant-design/icons"

const mockCertificates = [
  {
    id: 1,
    title: "Najot Ta'lim sertifikati",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eu cursus tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    image: "https://picsum.photos/160/120?random=1",
    date: "15.05.2023 12:45",
  },
  {
    id: 2,
    title: "Oxford International Education Group certificate",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eu cursus tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    image: "https://picsum.photos/160/120?random=2",
    date: "25.01.2023 03:45",
  },
]

export const UserCertificates = () => {
  const certificates = mockCertificates // Replace with actual data

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg">
      {certificates.length === 0 ? (
        <Empty description="You do not have a certificate at this time" className="py-16" />
      ) : (
        <div className="space-y-4 md:space-y-6">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="flex md:flex-row flex-col gap-4 md:gap-6 hover:shadow-md p-4 border rounded-lg transition-shadow"
            >
              <img
                src={cert.image || "/placeholder.svg"}
                alt={cert.title}
                className="rounded-lg w-full md:w-40 h-30 object-cover"
              />
              <div className="flex-1">
                <h3 className="mb-2 font-medium text-lg">{cert.title}</h3>
                <p className="mb-2 text-gray-600 text-sm">{cert.description}</p>
                <span className="text-gray-400 text-xs">{cert.date}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default UserCertificates