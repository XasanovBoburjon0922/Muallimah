import { useGetList } from "../../service/query/useGetList";
import { endpoints } from "../../config/endpoints";
import { useTranslation } from "react-i18next";
import { ProductSkeleton } from "../loadings/product-skeleton";
import { ProductCard } from "../cards/product-card";
import { Carousel, Grid } from "antd";

const HomeShops = () => {
  const { t, i18n } = useTranslation();
  const screens = Grid.useBreakpoint();

  const { data, isLoading } = useGetList(endpoints.product.list, {
    type: "product",
    language: i18n.language,
  });

  return (
    <div className="mb-12 container">
      <h2 className="mb-7 font-secondary text-spacial_red text-3xl md:text-7xl">
        {t("header.shop")}
      </h2>

      {isLoading || data?.products == undefined || null ? (
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

export default HomeShops;
