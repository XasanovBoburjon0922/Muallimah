import React from "react";
import { Route, Routes } from "react-router-dom";
import { publicRoutes, userRoutes } from "./routes/routes";
import MainLayout from "./layout/main-layout/main-layout";
import UserLayout from "./layout/user-layout/user-layout";
import Page404 from "./components/page404";
import VerifyEmail from "./auth/verify-email";
import Register from "./auth/register";
import { ProtectedRoute } from "./auth/protected";
import { nanoid } from "nanoid";
import { CartProvider } from "./Context/context";
import { ConfigProvider } from "antd";

function App() {
  return (
    <ConfigProvider theme={{ token: { colorPrimary: "#1890ff" } }}>
      <CartProvider>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            {publicRoutes.map(({ path, element, index }) => {
              return (
                <Route key={nanoid()} path={path} index={index} element={element} />
              );
            })}
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["user", "admin"]} />}>
            <Route path="/user-panel" element={<UserLayout />}>
              {userRoutes.map(({ path, element, index }) => {
                return (
                  <Route
                    key={nanoid()}
                    path={path}
                    index={index}
                    element={element}
                  />
                );
              })}
            </Route>
          </Route>

          <Route path="/sign-up" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="*" element={<Page404 />} />
        </Routes>
      </CartProvider>
    </ConfigProvider>
  );
}

export default App;