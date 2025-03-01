"use client"

import { useState } from "react"
import { Flex, Input, Modal, Avatar, Button } from "antd"
import { EditOutlined, InfoCircleOutlined } from "@ant-design/icons"
import { endpoints } from "../../../config/endpoints"
import { loadState } from "../../../config/storage"
import { useGetById } from "../../../service/query/useGetById"

export const UserSettings = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const user = loadState("muallimah-user")
  const { data, isLoading } = useGetById(endpoints.user.getId, user.id, false)

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  const formFields = [
    { label: "Username", value:"Username" },
    { label: "Phone", value: "Phone"},
    { label: "Age", value: "Age" },
    { label: "Occupation", value:"Occupation" },
    { label: "Address", value:"Address" },
    { label: "Password", value: "Password" },
  ]

  return (
    <div className="bg-white p-6 rounded-lg min-h-screen">
      <Flex vertical gap={24}>
        <Flex align="center" gap={16}>
          <div className="relative">
            <Avatar size={80} src={data?.photo_url || "/placeholder.svg?height=80&width=80"} className="bg-gray-200" />
            <div className="right-0 bottom-0 absolute bg-[#1a2b6d] p-1 rounded-full cursor-pointer">
              <EditOutlined className="text-white text-xs" />
            </div>
          </div>
          <Flex vertical>
            <h2 className="font-medium text-xl">{data?.full_name}</h2>
            <span className="text-gray-500 text-sm">
              date of registration {new Date(data?.created_at).toLocaleDateString()}
            </span>
          </Flex>
        </Flex>

        <div className="gap-4 grid md:grid-cols-2 lg:grid-cols-3">
          {formFields.map((field, index) => (
            <div key={index} className="relative">
              <Input value={field.value} placeholder={field.label} className="pr-8" readOnly />
              <EditOutlined className="top-1/2 right-3 absolute text-gray-400 -translate-y-1/2 cursor-pointer" />
            </div>
          ))}
        </div>

        <Flex gap={12} justify="flex-end">
          <Button onClick={() => setIsModalOpen(true)}>Cancel</Button>
          <Button type="primary" className="bg-[#1a2b6d]">
            Save
          </Button>
        </Flex>
      </Flex>

      <Modal
        title="Confirmation"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>,
          <Button key="leave" type="primary" className="bg-[#1a2b6d]" onClick={() => setIsModalOpen(false)}>
            Yes
          </Button>,
        ]}
      >
        <p>Do you really want to leave from your account?</p>
      </Modal>
    </div>
  )
}

export default UserSettings

