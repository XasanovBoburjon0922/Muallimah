import React from "react";
import { Header } from "../header/header";
import { Footer } from "../footer/footer";
import { Outlet } from "react-router-dom";
import { Layout } from "antd";

export const MainLayout = () => {
  return (
    <Layout>
      <Layout.Header className="bg-white mb-9">
        <Header />
      </Layout.Header>
      <Layout.Content className="min-h-screen">
        <Outlet />
      </Layout.Content>
      <Layout.Footer className="bg-primary mt-20">
        <Footer />
      </Layout.Footer>
    </Layout>
  );
};

export default MainLayout;
