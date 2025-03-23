import { Button, Drawer, Flex, Form, Input, Modal, message } from "antd";
import React, { useEffect } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCreate } from "../../service/mutation/useCreate";
import { endpoints } from "../../config/endpoints";
import { loadState, saveState } from "../../config/storage";
import { CloseOutlined } from "@ant-design/icons";
import UserAvatar from "../../components/user/user-avatar";
import { menuLinks } from "../../data/data";
import { LuAlignRight } from "react-icons/lu";
import LanguageSelector from "../../components/language-selector/language-selector";
import { useTranslation } from "react-i18next";
import LogoDesktop from "../../assets/icons/logos/logo-desktop";
import LogoMobile from "../../assets/icons/logos/logo-mobile";
import { BiBasket } from "react-icons/bi";
import { useCart } from "../../Context/context";

export const Header = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [open, setOpen] = React.useState(false);
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const { mutate, isPending } = useCreate(endpoints.auth.login, "");
  const { cartCount, fetchCart } = useCart(); // Savatdagi mahsulotlar soni va yangilash funksiyasi

  const user = loadState("muallimah-user");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart(); // Komponent yuklanganda savatdagi ma'lumotlarni yangilash
  }, [fetchCart]);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const showModal = () => {
    user ? navigate("/user-panel/home") : setIsModalVisible(true);
  };

  const [form] = Form.useForm();

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const onFinish = (values) => {
    const fullvalues = { platform: "web", ...values };
    mutate(fullvalues, {
      onSuccess: (res) => {
        saveState("muallimah-user", {
          access_token: res.user.access_token,
          role: res.user.user_role,
          id: res.user.id,
        });

        if (res.user.user_role) {
          navigate("/user-panel/home");
          message.success("Login successful!");
        } else {
          navigate("/");
        }
      },
      onError: (error) => {
        console.error("Login failed:", error.message);
        message.error("Login failed: Check the fields!");
      },
    });
  };

  return (
    <>
      <div className="right-0 left-0 z-30 fixed bg-white">
        {/* Mobile Header */}
        <div className="lg:hidden flex justify-between items-center px-4 container">
          <Link to={"/"}>
            <LogoMobile />
          </Link>

          <Flex gap={12}>
            <LanguageSelector />
            {user && (
              <Button
                className="relative font-primary"
                type="default"
                shape="circle"
                size="middle"
                icon={<BiBasket />}
                onClick={() => navigate("/cart")}
              >
                {cartCount > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: "-8px",
                      right: "-8px",
                      backgroundColor: "red",
                      color: "white",
                      borderRadius: "50%",
                      padding: "2px 6px",
                      fontSize: "12px",
                    }}
                  >
                    {cartCount}
                  </span>
                )}
              </Button>
            )}
            <Button
              onClick={showDrawer}
              className="text-primary"
              type="link"
              icon={<LuAlignRight size={24} />}
            />
          </Flex>
        </div>

        {/* Drawer for Mobile */}
        <Drawer
          open={open}
          onClose={onClose}
          placement="left"
          closable={false}
          styles={{
            header: { background: "#00235a", color: "white" },
            body: { padding: 0, background: "#fafafa" },
          }}
        >
          <div className="z-40 flex flex-col items-center p-4 pt-10 font-primary font-bold text-center">
            <Button
              danger
              icon={<IoCloseOutline size={24} />}
              className="top-3 right-3 absolute"
              onClick={onClose}
            />

            {menuLinks.map(({ label, path }) => (
              <Link
                key={path}
                className="my-2 font-semibold text-primary hover:text-spacial_red text-2xl"
                to={path}
                style={{
                  color: location.pathname === path && "#FF4756",
                }}
              >
                {t(label)}
              </Link>
            ))}

            <Flex
              align="center"
              justify="center"
              gap={24}
              className="mt-10 w-3/4"
            >
              <Button
                block
                onClick={() => {
                  onClose();
                  showModal();
                }}
                type="primary"
                children="Sign In"
              />

              <Button
                block
                onClick={() => navigate("/sign-up")}
                children="Sign Up"
              />
            </Flex>

            {user && (
              <Button
                className="mt-4"
                block
                onClick={() => {
                  onClose();
                  navigate("/cart");
                }}
                type="default"
                icon={<BiBasket />}
              >
                Savat ({cartCount})
              </Button>
            )}
          </div>
        </Drawer>

        <div className="hidden lg:flex justify-between items-center px-4 py-2 container">
          <Link onClick={() => window.scrollTo(0, 0)} to="/">
            <LogoDesktop />
          </Link>
          <Flex justify="space-between" align="center" className="gap-7 w-full">
            <Flex
              justify={user ? "center" : "end"}
              align="center"
              gap={24}
              className="w-full"
            >
              {menuLinks.map(({ label, path }) => (
                <Link
                  onClick={() => window.scrollTo(0, 0)}
                  key={path}
                  className="border-transparent border-b-2 font-medium text-primary hover:text-spacial_red text-base leading-5 transition-all duration-500"
                  to={path}
                  style={{
                    color: location.pathname === path && "#FF4756",
                    borderBottomColor: location.pathname === path && "#FF4756",
                  }}
                >
                  {t(label)}
                </Link>
              ))}
            </Flex>

            <Flex justify="end" align="center" className="gap-4 w-fit">
              <LanguageSelector />

              {!user && (
                <Link to={"/sign-up"}>
                  <Button
                    className="shadow-none font-primary"
                    type="primary"
                    children={t("buttons.sign-up")}
                  />
                </Link>
              )}

              {user && (
                <Button
                  className="relative font-primary"
                  type="default"
                  shape="circle"
                  size="middle"
                  icon={<BiBasket />}
                  onClick={() => navigate("/cart")}
                >
                  {cartCount > 0 && (
                    <span
                      style={{
                        position: "absolute",
                        top: "-8px",
                        right: "-8px",
                        backgroundColor: "red",
                        color: "white",
                        borderRadius: "50%",
                        padding: "2px 6px",
                        fontSize: "12px",
                      }}
                    >
                      {cartCount}
                    </span>
                  )}
                </Button>
              )}
              {user ? (
                <UserAvatar />
              ) : (
                <Button
                  className="font-primary"
                  type="default"
                  onClick={showModal}
                  children={t("buttons.sign-in")}
                />
              )}
            </Flex>
          </Flex>
        </div>

        <Modal
          open={isModalVisible}
          onCancel={handleCancel}
          footer={null}
          maskClosable={false}
          loading={isPending}
          closeIcon={<CloseOutlined className="text-primary" />}
          closable={false}
          width={350}
        >
          <Button
            onClick={handleCancel}
            size="large"
            shape="circle"
            className="-top-4 -right-4 absolute shadow-md border-transparent text-primary"
          >
            <CloseOutlined />
          </Button>
          <Form
            form={form}
            className="pt-10"
            layout="vertical"
            onFinish={onFinish}
          >
            <Form.Item className="pb-2">
              <h1 className="font-fontFamily font-bold text-primary text-2xl text-center">
                Sign In
              </h1>
            </Form.Item>
            <Form.Item
              name="usernamee"
              rules={[
                {
                  required: true,
                },
              ]}
              className="relative"
            >
              <Input
                style={{
                  borderRadius: 0,
                  boxShadow: "none",
                }}
                placeholder="Username"
                className="border-x-0 border-t-0 border-b-2"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input.Password
                style={{
                  borderRadius: 0,
                  boxShadow: "none",
                }}
                className="border-x-0 border-t-0 border-b-2"
                placeholder="Password"
              />
            </Form.Item>

            <Form.Item>
              <Link to="" className="text-primary underline">
                Forgot password?
              </Link>
            </Form.Item>

            <Form.Item className="mb-1">
              <Button
                className="border-primary"
                block
                type="primary"
                htmlType="submit"
                loading={isPending}
              >
                Enter
              </Button>
            </Form.Item>

            <Form.Item>
              <Link to="/sign-up">
                <p className="text-primary hover:text-blue-500 text-center">
                  Don’t have an account? Sign Up
                </p>
              </Link>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  );
};

export default Header;