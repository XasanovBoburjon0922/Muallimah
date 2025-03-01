import HomeBanner from "../../components/home/home-banner";
import HomeAmounts from "../../components/home/home-amouts";
import HomeCourses from "../../components/home/home-courses";
import HomeAbout from "../../components/home/home-about";
import HomeBlogs from "../../components/home/home-blogs";
import HomeBooks from "../../components/home/home-books";
import HomeShops from "../../components/home/home-shops";
import HomeFeedbacks from "../../components/home/homefeedbacks";

const Home = () => {
  return (
    <>
      <HomeBanner />
      <HomeAmounts />
      <HomeCourses />
      <HomeAbout />
      <HomeBlogs />
      <HomeBooks />
      <HomeShops />
      <HomeFeedbacks />
    </>
  );
};

export default Home;
