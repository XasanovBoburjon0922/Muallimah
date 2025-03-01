"use client"

import { useEffect, useState, useCallback } from "react"
import { Table, Input, DatePicker, Dropdown, Tag, Space, Button, message, Modal, List, Card, Image } from "antd"
import { SearchOutlined, MoreOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons"
import dayjs from "dayjs"

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  })
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedOrderProducts, setSelectedOrderProducts] = useState([])

  // Tokenni olish uchun funksiya
  const getToken = () => {
    const user = JSON.parse(localStorage.getItem("muallimah-user"))
    return user ? user.access_token : null
  }

  const fetchOrders = useCallback(
    async (page = 1) => {
      try {
        const token = getToken()
        if (!token) {
          throw new Error("Token topilmadi. Iltimos, avval tizimga kiring.")
        }

        const response = await fetch(`https://beta.themuallimah.uz/v1/order/list?page=${page}&limit=10`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const data = await response.json()

        // Add dummy customer data since API doesn't provide it
        const ordersWithCustomer = data.orders.map((order) => ({
          ...order,
          customer_name: "Customer Name",
          location: "London",
        }))

        setOrders(ordersWithCustomer)
        setPagination({
          ...pagination,
          total: data.total_count,
          current: data.pagination.page,
        })
      } catch (error) {
        message.error("Failed to fetch orders")
      } finally {
        setLoading(false)
      }
    },
    [pagination],
  )

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const token = getToken()
      if (!token) {
        throw new Error("Token topilmadi. Iltimos, avval tizimga kiring.")
      }

      await fetch("https://beta.themuallimah.uz/v1/order/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: orderId,
          status: newStatus,
        }),
      })
      message.success("Order status updated successfully")
      fetchOrders(pagination.current)
    } catch (error) {
      message.error("Failed to update order status")
    }
  }

  const getStatusTag = (status) => {
    const statusConfig = {
      pending: { color: "#FFB946", text: "PENDING" },
      finished: { color: "#2ED47A", text: "FINISHED" },
      cancelled: { color: "#F7685B", text: "CANCELED" },
      in_progres: { color: "#FFB946", text: "PENDING" },
    }

    const config = statusConfig[status.toLowerCase()] || statusConfig.pending

    return (
      <Tag color={config.color} style={{ borderRadius: "4px", padding: "2px 8px" }}>
        {config.text}
      </Tag>
    )
  }

  const fetchOrderProducts = async (orderId) => {
    try {
      const token = getToken()
      if (!token) {
        throw new Error("Token topilmadi. Iltimos, avval tizimga kiring.")
      }

      const response = await fetch(`https://beta.themuallimah.uz/v1/order/products?order_id=${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()
      setSelectedOrderProducts(data)
      setIsModalVisible(true)
    } catch (error) {
      message.error("Failed to fetch order products")
    }
  }

  const columns = [
    {
      title: "Order ID",
      dataIndex: "id",
      render: (id) => <span className="text-gray-700">#{id.slice(0, 7)}</span>,
      sorter: true,
    },
    {
      title: "Date",
      dataIndex: "CreatedAt",
      render: (date) => dayjs(date).format("DD MMMM YYYY, HH:mm A"),
    },
    {
      title: "Amount",
      dataIndex: "total_price",
      render: (price) => `$${Number.parseFloat(price).toFixed(2)}`,
    },
    {
      title: "Status Order",
      dataIndex: "status",
      render: (status) => getStatusTag(status),
    },
    {
      title: "",
      key: "actions",
      render: (_, record) => (
        <Dropdown
          menu={{
            items: [
              {
                key: "1",
                icon: <CheckCircleOutlined />,
                label: "Accept Order",
                onClick: () => handleStatusUpdate(record.id, "finished"),
              },
              {
                key: "2",
                icon: <CloseCircleOutlined />,
                label: "Reject Order",
                onClick: () => handleStatusUpdate(record.id, "cancelled"),
              },
            ],
          }}
          trigger={["click"]}
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ]

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  return (
    <div className="p-4 md:p-6">
      <div className="flex md:flex-row flex-col justify-between items-center gap-4 mb-6">
        <Input
          prefix={<SearchOutlined className="text-gray-400" />}
          placeholder="Search here"
          className="w-full md:max-w-[400px]"
        />
        <Space className="mt-4 md:mt-0 w-full md:w-auto">
          <DatePicker className="w-full md:w-[200px]" format="DD MMM YYYY" placeholder="Today" />
          <Button type="primary" className="bg-[#F52B70] hover:bg-[#F52B70]/90 w-full md:w-auto">
            Today
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={orders}
        loading={loading}
        pagination={{
          ...pagination,
          onChange: (page) => fetchOrders(page),
          showSizeChanger: false,
        }}
        rowKey="id"
        className="bg-white shadow rounded-lg"
        onRow={(record) => ({
          onClick: () => fetchOrderProducts(record.id),
        })}
        scroll={{ x: true }}
      />

      <Modal
        title="Order Products"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width="90%"
      >
        <List
          dataSource={selectedOrderProducts}
          renderItem={(product) => (
            <Card className="mb-4">
              <div className="flex md:flex-row flex-col items-center">
                <Image
                  src={product.picture_urls[0]}
                  alt={product.title}
                  width={100}
                  height={100}
                  className="rounded-lg"
                />
                <div className="mt-4 md:mt-0 ml-0 md:ml-4">
                  <h3 className="font-semibold text-lg">{product.title}</h3>
                  <p className="text-gray-600">{product.description}</p>
                  <p className="font-bold text-gray-800">{product.price} so'm</p>
                  <p className="text-gray-600">Quantity: {product.count}</p>
                </div>
              </div>
            </Card>
          )}
        />
      </Modal>
    </div>
  )
}