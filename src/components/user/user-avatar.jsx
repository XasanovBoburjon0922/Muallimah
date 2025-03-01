import React from "react";
import { Avatar, Button, Dropdown, Flex, message } from "antd";
import { useNavigate } from "react-router-dom";
import {
  DownOutlined,
  HomeOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";

const UserAvatar = () => {
  const navigate = useNavigate();
  const menuItems = [
    {
      key: "home",
      label: (
        <Button
          block
          size="small"
          type="link"
          className="border-blue-500"
          icon={<HomeOutlined />}
          onClick={() => navigate("/user-panel/home")}
        >
          Home
        </Button>
      ),
    },
    {
      key: "profile",
      label: (
        <Button
          block
          size="small"
          icon={<UserOutlined />}
          type="link"
          className="border-blue-500"
          onClick={() => navigate("/user-panel/settings")}
        >
          Profile
        </Button>
      ),
    },
    {
      key: "logout",
      label: (
        <Button
          block
          type="primary"
          size="small"
          icon={<LogoutOutlined />}
          onClick={() => {
            localStorage.removeItem("muallimah-user");
            navigate("/", { replace: true });
            message.info("Logout successfuly!");
          }}
        >
          Logout
        </Button>
      ),
    },
  ];
  return (
    <Dropdown
      menu={{ items: menuItems }}
      placement="topLeft"
      overlayStyle={{ padding: "0px" }}
      trigger={["click"]}
    >
      <Flex align="center" gap={6} className="cursor-pointer">
        <Avatar icon={<UserOutlined />} />

        <DownOutlined className="text-gray-500" style={{fontSize:"14px"}} />
      </Flex>
    </Dropdown>
  );
};

export default UserAvatar;
