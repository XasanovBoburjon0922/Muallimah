import { Button } from "antd";
import React from "react";
import { Link } from "react-router-dom";

const Page404 = () => {
  return (
    <>
      <div className="container">
        <div className="h-screen justify-center items-center flex flex-col gap-10">
          <img
            className="w-full opacity-50 max-w-48 md:max-w-56 mx-auto"
            src="/public/mainBg.svg"
            alt="img"
          />
          <h1 className="text-lg font-secondFamily right-80 font-medium opacity-100">
            Sorry, this page is not valuable
          </h1>

          <Link to={"/"}>
            <Button type="primary">come back</Button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Page404;
