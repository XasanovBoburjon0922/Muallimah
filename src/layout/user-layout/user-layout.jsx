import React, { useState } from "react";
import { Layout, Avatar, Badge, Drawer, Button, message, Flex } from "antd";
import { Link, NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { GoHome } from "react-icons/go";
import { CgNotes } from "react-icons/cg";
import { PiMedalFill } from "react-icons/pi";
import { BsCreditCard2Back } from "react-icons/bs";
import { IoMdSettings } from "react-icons/io";
import { IoLogOutOutline, IoNotificationsOutline } from "react-icons/io5";
import { MenuOutlined } from "@ant-design/icons";

const { Header, Sider, Content } = Layout;

const navItems = [
  { to: "/user-panel/home", icon: <GoHome />, label: "Home" },
  { to: "/user-panel/cources", icon: <CgNotes />, label: "Courses" },
  {
    to: "/user-panel/certificates",
    icon: <PiMedalFill />,
    label: "Certificates",
  },
  {
    to: "/user-panel/payments",
    icon: <BsCreditCard2Back />,
    label: "Payments",
  },
  {
    to: "/user-panel/orders",
    icon: <BsCreditCard2Back />,
    label: "Orders",
  },
  { to: "/user-panel/settings", icon: <IoMdSettings />, label: "Settings" },
];

const UserLayout = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const toggleDrawer = () => setDrawerVisible(!drawerVisible);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("muallimah-user");
    message.info("Logout successfuly!");
    navigate("/", { replace: true });
  };

  // Foydalanuvchi qaysi sahifada turganligini aniqlash
  const getPageTitle = () => {
    const currentPage = navItems.find((item) => item.to === location.pathname);
    return currentPage ? `My ${currentPage.label}` : "Dashboard";
  };

  return (
    <Layout className="h-lvh min-h-lvh max-h-lvh overflow-hidden">
      {/* Mobile Sidebar Drawer */}
      <Drawer
        title="Menu"
        placement="left"
        closable={true}
        onClose={toggleDrawer}
        open={drawerVisible}
        className="md:hidden"
      >
        <div className="flex flex-col gap-5">
          {navItems.map(({ to, icon, label }, index) => (
            <NavLink
              onClick={toggleDrawer}
              key={index}
              to={to}
              className={({ isActive }) =>
                `text-primary transition-all font-bold text-2xl duration-300 flex justify-center items-center gap-1 ${
                  isActive
                    ? "text-accent font-bold scale-110 text-2xl border p-1 bg-gray-200 rounded-md"
                    : ""
                }`
              }
            >
              <div className="text-xl">{icon}</div>
              {label && <p className="text-xs">{label}</p>}
            </NavLink>
          ))}
        </div>
      </Drawer>

      {/* Sidebar (Desktop version) */}
      <Sider
        breakpoint="md"
        collapsedWidth="100%"
        width={100}
        theme="dark"
        className="hidden bottom-0 md:left-0 fixed md:relative md:flex flex-col bg-primary md:w-20 md:h-screen text-white"
      >
        <Link to="/" className="hidden md:block my-4">
          <img className="mx-auto h-10" src="/logo.svg" alt="logo" />
        </Link>

        <div className="hidden md:flex md:flex-col items-center gap-7 p-3 px-1 w-full">
          {navItems.map(({ to, icon, label }, index) => (
            <NavLink
              key={index}
              to={to}
              className={({ isActive }) =>
                `text-white transition-all duration-300 flex flex-col items-center gap-1 ${
                  isActive ? "text-accent font-bold scale-110" : "text-white"
                }`
              }
            >
              <div className="text-xl">{icon}</div>
              {label && <p className="text-[10px]">{label}</p>}
            </NavLink>
          ))}
        </div>
        <Flex
          vertical
          align="center"
          justify="center"
          className="bottom-10 absolute w-full text-xs"
        >
          <Button
            onClick={handleLogout}
            type="link"
            className="text-white text-3xl"
            icon={<IoLogOutOutline />}
            children=""
          />
          Logout
        </Flex>
      </Sider>

      <Layout className="h-screen">
        <Header className="top-0 z-10 sticky flex justify-between md:justify-end items-center bg-secondary px-4 py-3 w-full">
          {/* Logo va hamburger menyusi */}
          <div className="flex items-center gap-2">
            <Button
              icon={<MenuOutlined />}
              className="md:hidden"
              onClick={toggleDrawer}
            />
            <Link to="/" className="md:hidden">
              <img className="h-8" src="/logo.svg" alt="logo" />
            </Link>
          </div>

          <div className="flex justify-between gap-4 w-full">
            <span className="pl-[40px] font-bold text-primary text-lg">
              {getPageTitle()}
            </span>
            <Badge count={5} className="mr-2">
              <Avatar icon={<IoNotificationsOutline />} className="bg-primary" />
            </Badge>
          </div>
        </Header>

        <Content className="p-4 pb-20 h-screen overflow-auto">
          <div
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#00235a #e0e0e0",
            }}
          >
            <style>
              {`
                div::-webkit-scrollbar {
                  width: 6px;
                }
                div::-webkit-scrollbar-thumb {
                  background-color: #00235a;
                  border-radius: 10px;
                }
                div::-webkit-scrollbar-track {
                  background-color: #e0e0e0;
                }
              `}
            </style>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default UserLayout;