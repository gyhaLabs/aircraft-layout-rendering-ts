import React from "react";
import { Layer, Rect, Text } from "react-konva";
import { Region } from "../types/region";

export type ExtendedRegion = Region & {
  xStart: number;
  yStart: number;
  width: number;
  height: number;
};

const RegionLayer = ({ regions }: { regions: ExtendedRegion[] }) => {
  return (
    <React.Fragment>
      {regions?.map((region: ExtendedRegion, i: number) => {
        const { xStart, yStart, width, height, compartment } = region;
        return (
          <Layer key={`regionLayer-${i}`}>
            <Rect
              x={xStart}
              y={yStart}
              width={width}
              height={height}
              scaleX={1}
              scaleY={1}
              stroke="#AAAAAA"
            />
            <Text
              text={compartment}
              x={xStart + 3}
              y={yStart + 3}
              scaleX={1}
              scaleY={1}
            />
          </Layer>
        );
      })}
    </React.Fragment>
  );
};

export default RegionLayer;
