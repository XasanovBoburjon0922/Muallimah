export const endpoints = {
  auth: {
    login: "/v1/auth/login",
    logout: "/auth/logout",
    register: "/v1/auth/register",
    verifyEmail: "/v1/auth/verify-email",
  },

  basket: {
    list: "/v1/basket",
    delete: "/v1/basket",
    create: "/v1/basket/item",
  },

  category: {
    create: "/v1/category",
    list: "/v1/category/list",
    getId: "/v1/category/",
    update: "/v1/category/",
    delete: "/v1/category/",
  },

  course: {
    create: "/v1/course",
    list: "/v1/course/list",
    getId: "/v1/course/",
    update: "/v1/course/",
    delete: "/v1/course/",
  },

  order: {
    update: "/v1/order",
    create: "/v1/order",
    list: "/v1/order/list",
    getId: "/v1/order/",
    delete: "/v1/order/",
  },

  post: {
    update: "/v1/post",
    create: "/v1/post",
    list: "/v1/post/list",
    create_img: "/v1/post/picture",
    delete_img: "/v1/post/picture",
    delete: "/v1/post/",
  },
  postCategory: {
    update: "/v1/post-category/",
    create: "/v1/post-category/create",
    list: "/v1/post-category/list",
    getId: "/v1/post-category/",
    delete: "/v1/post-category/",
  },

  product: {
    update: "/v1/product",
    create: "/v1/product",
    list: "/v1/product/list",
    create_img: "/v1/product/picture",
    delete_img: "/v1/product/picture",
    getId: "/v1/product/",
    delete: "/v1/product/",
  },

  session: {
    update: "/v1/session",
    list: "/v1/session/list",
    getId: "/v1/session/",
    delete: "/v1/session/",
  },

  teacher: {
    update: "/v1/teacher",
    create: "/v1/teacher",
    list: "/v1/teacher/list",
    getId: "/v1/teacher/",
  },

  user: {
    update: "/v1/user",
    create: "/v1/user",
    list: "/v1/user/list",
    getId: "/v1/user/",
    delete: "/v1/user/",
  },
};
