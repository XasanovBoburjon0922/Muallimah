import { Flex, Grid, Skeleton } from "antd";

export const ProductSkeleton = () => {
  const screens = Grid.useBreakpoint();
  return (
    <Flex gap={12} className="w-full justify-center md:justify-between">
      {[...Array(screens.xl ? 3 : screens.md ? 2 : screens.sm ? 1 : 1)].map(
        (_, index) => (
          <Flex key={index} vertical gap={12} className="w-[394px] rounded-md">
            <Skeleton.Image active style={{ width: "100%", height: "357px" }} />
            <Skeleton paragraph={{ rows: 1 }} active />
          </Flex>
        )
      )}
    </Flex>
  );
};
