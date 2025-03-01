import { useGetList } from "../../service/query/useGetList";
import { endpoints } from "../../config/endpoints";
import { ProductSkeleton } from "../loadings/product-skeleton";
import { ProductCard } from "../cards/product-card";
import { Carousel, Grid } from "antd";
import { useTranslation } from "react-i18next";


const HomeBooks = () => {
  const { t, i18n } = useTranslation();
  const { data, isloading } = useGetList(endpoints.product.list, {
    type: "book",
    language: i18n.language,
  });
  const screens = Grid.useBreakpoint();

  console.log(data);

  return (
    <div id="shop" className="mb-12 container">
      <h2 className="mb-7 font-secondary text-spacial_red text-3xl md:text-7xl">
        The Muallimah Books
      </h2>

      {isloading || data?.products == undefined || null ? (
        <ProductSkeleton />
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
          {data?.products?.map((card) => (
            <ProductCard key={card?.id} card={{ ...card }} />
          ))}
        </Carousel>
      )}
    </div>
  );
};

export default HomeBooks;