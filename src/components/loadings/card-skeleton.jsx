import { Grid, Skeleton, Flex } from "antd";

export const CardSkeleton = () => {
  const screens = Grid.useBreakpoint();

  return (
    <Flex gap={12} className="w-full justify-center md:justify-between">
      {[...Array(screens.xl ? 4 : screens.md ? 3 : screens.sm ? 2 : 1)].map(
        (_, index) => (
          <Flex key={index} vertical gap={12} className="w-72 rounded-md">
            <Skeleton.Image active style={{ width: "100%", height: "156px" }} />
            <Skeleton paragraph={{rows:5}} active />
          </Flex>
        )
      )}
    </Flex>
  );
};
