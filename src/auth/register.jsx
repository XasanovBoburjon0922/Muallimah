import React from "react";
import { Form, Input, Select, DatePicker, Button, Flex } from "antd";
import { useCreate } from "../service/mutation/useCreate";
import { endpoints } from "../config/endpoints";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";

const Register = () => {
  const navigate = useNavigate();
  const { mutate, isLoading } = useCreate(endpoints.auth.register, "");

  const onFinish = (values) => {
    const formattedValues = {
      ...values,
      dob: values.dob ? values.dob.format("YYYY-MM-DD") : "",
    };
    mutate(formattedValues, {
      onSuccess: () => {
        console.log("registered");
        console.log(formattedValues);
        navigate("/verify-email", { state: { email: values.email } });
      },
      onError: (error) => {
        console.log(`error register: ${error.message}`);
        console.log(formattedValues);
      },
    });
  };

  return (
    <Flex vertical align="center" justify="center" className="p-4 md:h-screen">
      <Form
        name="create_form"
        layout="vertical"
        onFinish={onFinish}
        className="space-y-4 bg-white p-5 rounded-lg text-center shadow-md w-full md:w-fit md:min-w-[600px] border relative"
      >
        <Button
          onClick={() => navigate("/")}
          icon={<ArrowLeftOutlined />}
          shape="circle"
          className="absolute left-5"
        />

        <Form.Item className="pt-5 pb-10">
          <h1 className="text-primary font-bold text-4xl font-fontFamily">
            Sign Up
          </h1>
        </Form.Item>

        <Flex vertical className="md:grid md:gap-3 md:grid-cols-2">
          <Form.Item
            name="full_name"
            rules={[{ required: true, message: "Please enter your full name" }]}
          >
            <Input
              style={{ boxShadow: "none" }}
              className="border-x-0 border-t-0 border-b-2 rounded-none "
              placeholder="Full Name"
            />
          </Form.Item>

          <Form.Item
            name="username"
            rules={[{ required: true, message: "Please enter your username" }]}
          >
            <Input
              style={{ boxShadow: "none" }}
              className="border-x-0 border-t-0 border-b-2 rounded-none"
              placeholder="User Name"
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email address" },
            ]}
          >
            <Input
              style={{ boxShadow: "none" }}
              className="border-x-0 border-t-0 border-b-2 rounded-none"
              placeholder="Email"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password
              style={{ boxShadow: "none" }}
              className="border-x-0 border-t-0 border-b-2 rounded-none"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item
            name="dob"
            rules={[
              { required: true, message: "Please select your date of birth" },
            ]}
          >
            <DatePicker
              placeholder="Date of Birth"
              format="YYYY-MM-DD"
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item
            name="gender"
            rules={[{ required: true, message: "Please select your gender" }]}
          >
            <Select
              placeholder="Select your gender"
              options={[
                {
                  label: "Male",
                  value: "male",
                },
                {
                  label: "Female",
                  value: "female",
                },
              ]}
            />
          </Form.Item>

          <Form.Item
            name="address"
            rules={[{ required: true, message: "Please enter your address" }]}
          >
            <Input
              style={{ boxShadow: "none" }}
              className="border-x-0 border-t-0 border-b-2 rounded-none"
              placeholder="Address"
            />
          </Form.Item>

          {/* <Form.Item
            label="Avatar ID"
            name="avatar_id"
            rules={[{ required: true, message: "Please enter your avatar ID" }]}
          >
            <Input placeholder="Enter your avatar ID" />
          </Form.Item> */}

          {/* <Form.Item
            label="Photo URL"
            name="photo_url"
            rules={[
              { required: true, message: "Please enter your photo URL" },
              { type: "url", message: "Please enter a valid URL" },
            ]}
          >
            <Input placeholder="Enter your photo URL" />
          </Form.Item> */}
        </Flex>

        <Form.Item>
          <Button block type="primary" htmlType="submit" loading={isLoading}>
            Enter
          </Button>
        </Form.Item>

        <Form.Item>
          <Link className="underline text-primary pt-5" to="/">
            Already have an account? Sign In
          </Link>
        </Form.Item>
      </Form>
    </Flex>
  );
};

export default Register;
