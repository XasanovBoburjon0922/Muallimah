import React from "react";
import { Form, Input, Button, Flex } from "antd";
import { useCreate } from "../service/mutation/useCreate";
import { endpoints } from "../config/endpoints";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../layout/header/header";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {};
  const { mutate, isLoading } = useCreate(
    endpoints.auth.verifyEmail,
    "",
    false
  );

  const onFinish = (values) => {
    // Platform maydoniga avtomatik qiymat qo'shish
    const formattedValues = {
      ...values,
      platform: "user", // Doimiy qiymat
    };
    mutate(formattedValues, {
      onSuccess: () => {
        console.log("verified");
        console.log(formattedValues);
        navigate("/login");
      },
      onError: (error) => {
        console.log(`error verify: ${error.message}`);
        console.log(formattedValues);
      },
    });
  };

  return (
    <Flex vertical align="center" className="p-4">
      <Form
        name="verify_email_form"
        layout="vertical"
        onFinish={onFinish}
        className="mt-20 md:mt-40 w-full max-w-md mx-auto p-5 bg-white rounded-lg shadow-md"
        initialValues={{ email: email }}
      >
        <Form.Item
          // label="Email"
          name="email"
          rules={[
            { required: true, message: "Please enter your email" },
            { type: "email", message: "Please enter a valid email address" },
          ]}
        >
          <Input placeholder="Enter your email" />
        </Form.Item>

        <Form.Item
          // label="OTP"
          name="otp"
          rules={[{ required: true, message: "Please enter the OTP" }]}
        >
          <Input placeholder="Enter the OTP" />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoading}
            style={{ width: "100%" }}
          >
            Verify Email
          </Button>
        </Form.Item>
      </Form>
    </Flex>
  );
};

export default VerifyEmail;
