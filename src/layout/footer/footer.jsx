import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaTelegramPlane,
  FaTiktok,
} from "react-icons/fa";
import { menuLinks } from "../../data/data";
import { useTranslation } from "react-i18next";
import LogoFooter from "../../assets/icons/logos/logo-footer";

export const Footer = () => {
  const { t } = useTranslation();
  return (
    <div className="py-3 text-white bg-primary">
      <div className="container px-4 mx-auto">
        <div className="flex flex-wrap items-center justify-between">
          <Link
            onClick={() => window.scrollTo(0, 0)}
            className="mx-auto md:mx-0"
            to="/"
          >
            <LogoFooter />
          </Link>

          <div className="flex flex-wrap items-center justify-center gap-7 mt-10">
            {menuLinks.map(({ label, path }) => (
              <Link
                onClick={() => window.scrollTo(0, 0)}
                key={path}
                className="font-primary text-base leading-5 font-medium hover:text-[#FF4756]"
                to={path}
              >
                {t(label)}
              </Link>
            ))}
          </div>

          <div className="mt-10 mx-auto md:mx-0   text-center md:text-start">
            <h3 className="mb-4 text-base font-medium font-primary">
              {t("footer.follow_us")}
            </h3>
            <div className="flex items-center gap-6 ">
              {[
                { href: "https://t.me/themuallimah", icon: FaTelegramPlane },
                {
                  href: "https://www.instagram.com/themuallimahalumni/",
                  icon: FaInstagram,
                },
                {
                  href: "https://www.facebook.com/themuallimah/",
                  icon: FaFacebookF,
                },
                {
                  href: "https://www.tiktok.com/@themuallimah",
                  icon: FaTiktok,
                },
              ].map(({ href, icon: Icon }, index) => (
                <a
                  key={index}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-9 h-9 text-gray-500 bg-white rounded-full shadow-md hover:text-primary hover:shadow-md hover:shadow-white transition-all"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center mt-5 text-sm text-white opacity-50 gap-5 font-normal text-center font-primary">
          <p className="">{t("footer.copyright")}</p>
          <p className="">{t("footer.privacy_policy")}</p>
          <p className="">{t("footer.accessibility")}</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
