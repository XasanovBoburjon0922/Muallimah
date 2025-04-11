import Courses from "../pages/courses/courses";
import Home from "../pages/home/home";
import UserCertificates from "../pages/user/pages/certificates";
import UserCources from "../pages/user/pages/cources";
import UserHome from "../pages/user/pages/home";
import UserPayment from "../pages/user/pages/payments";
import UserSettings from "../pages/user/pages/settings";
import Books from "../pages/books/books";
import Blogs from "../pages/blogs/blogs";
import Shop from "../pages/shop/shop";
import Teachers from "../pages/teachers/teachers";
import About from "../pages/about/about";
import CourseDetails from "../pages/courses/CoursesSinglepage";
import Cart from "../pages/productBasket/cart";
import UserOrders from "../pages/user/pages/orders";
import LessonPage from "../pages/courses/lessons";
import CoursesDetails from "../pages/user/pages/courcesDetail";
import BlogDetail from "../pages/blogs/blog-detail";

export const publicRoutes = [
  {
    index: true,
    element: <Home />,
  },
  {
    path: "/books",
    element: <Books />,
  },
  {
    path: "/blogs",
    element: <Blogs />,
  },
  {
    path: "/blogs/:id",
    element: <BlogDetail />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/courses",
    element: <Courses />,
  },
  {
    path: "/course/:id", // Dinamik yo'l
    element: <CourseDetails />,
  },
  {
    path: "/lessons/:id", // Dinamik yo'l
    element: <LessonPage />,
  },
  {
    path: "/cart",
    element: <Cart />,
  },
  {
    path: "/shop",
    element: <Shop />,
  },
  {
    path: "/teachers",
    element: <Teachers />,
  }
];

export const userRoutes = [
  { index: true, path: "home", element: <UserHome /> },
  { path: "cources", element: <UserCources /> },
  { path: "certificates", element: <UserCertificates /> },
  { path: "orders", element: <UserOrders /> },
  { path: "payments", element: <UserPayment /> },
  { path: "settings", element: <UserSettings /> },
  { path: "my-courses/:courseId", element: <CoursesDetails /> }, // Yangi qo'shilgan yo'l
];