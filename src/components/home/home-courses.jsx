import { useGetList } from "../../service/query/useGetList";
import { endpoints } from "../../config/endpoints";
import { useTranslation } from "react-i18next";
import { CardSkeleton } from "../loadings/card-skeleton";
import { CoursesCard } from "../cards/courses-card";
import { Carousel, Grid } from "antd";


const HomeCourses = () => {
  const { t, i18n } = useTranslation();
  const screens = Grid.useBreakpoint();
  const { data: coursesData, isLoading } = useGetList(endpoints.course.list, {
    page: 1,
    limit: 10,
    language: i18n.language,
  });
  console.log(coursesData);

  return (
    <div id="cources" className="mb-12 container">
      <h2 className="mb-7 font-secondary text-spacial_red text-3xl md:text-7xl">
        {t("header.courses")}
      </h2>
      {isLoading || coursesData.courses == undefined || null ? (
        <CardSkeleton />
      ) : (
        <Carousel
          slidesToShow={screens.md ? 4 : 1}
          autoplay
          swipeToSlide={true}
          autoplaySpeed={3500}
          draggable
          pauseOnHover={false}
          pauseOnDotsHover={false}
          dots={false}
          className="flex justify-center text-center"
        >
          {coursesData?.courses?.map((card) => (
            <CoursesCard key={card?.id} card={{ ...card }} />
          ))}
        </Carousel>
      )}
    </div>
  );
};

export default HomeCourses;
