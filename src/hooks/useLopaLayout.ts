import { useMemo, useState } from "react";
import { LocationAlignment } from "../types/location";
import { analizeLopa } from "../utils/lopa";
import { getLopaJSON } from "../utils/lopa.testfile";

const spaceBetweenSeatsX = 5;
const spaceBetweenSeatsY = 3;
const deckPosYStart = 0;
const deckPosYEnd = 1410;
const deckPosXStart = 236;
const deckPosXEnd = 482;

const useLopaLayout = () => {
  const lopaJSON = getLopaJSON();
  const {
    rowSizeLeft,
    rowSizeRight,
    rowSizeMiddle,
    maxColSizeLeft,
    maxColSizeRight,
    maxColSizeMiddle,
  } = analizeLopa(lopaJSON.lopa);

  /*   console.log(
    rowSizeLeft,
    rowSizeRight,
    rowSizeMiddle,
    maxColSizeLeft,
    maxColSizeRight,
    maxColSizeMiddle
  ); */

  const baseHeight =
    (deckPosYEnd - deckPosYStart) /
    (rowSizeLeft + rowSizeMiddle + rowSizeRight);
  const baseWidth =
    (deckPosXEnd - deckPosXStart) /
    Math.max(maxColSizeLeft, maxColSizeMiddle, maxColSizeRight);

  /*   console.log(baseHeight);
  console.log(baseWidth); */

  const layoutData = useMemo(() => {
    let regionBoundary = 0;

    const data = {
      regions: lopaJSON.lopa.map((section) => {
        const regionHeight = section.region.locations.reduce(
          (prev, location) => Number(location.grid_row_max) * baseHeight + prev,
          0
        );

        const region = {
          ...section.region,
          xStart: deckPosXStart,
          yStart: regionBoundary,
          width: deckPosXEnd - deckPosXStart,
          height: regionHeight,
        };
        regionBoundary += regionHeight + 3;
        return region;
      }),

      layers: lopaJSON.lopa.map((section) => {
        return section.region.locations.map((location) => {
          const {
            section,
            alignment_in_fuselage: align,
            grid_col_max,
            grid_row_max,
          } = location;
          return {
            id: location.id,

            //stagePosXStart: align === LocationAlignment.LEFT ? deckPosXStart
            stagePosXEnd: 482,
            stagePosYStart: 0.599,
            stagePosYEnd: 1410,

            columnCount: grid_col_max,
            rowCount: grid_row_max,
            spaceBetweenSeatsX,
            spaceBetweenSeatsY,
            name: section,
            description: section,
            visible: true,
            items: [],
          };
        });
      }),
    };

    /*  // generate seats
    let colNumbers = ["A", "B", "C", "D", "E", "F"];

    data.layers.forEach((seatLayer) => {
      let seatStageWidth = seatLayer.stagePosXEnd - seatLayer.stagePosXStart;
      let seatStageHeight = seatLayer.stagePosYEnd - seatLayer.stagePosYStart;
      let seatWidth = seatStageWidth / seatLayer.columnCount;
      let seatHeight = seatStageHeight / seatLayer.rowCount;

      for (let row = 1; row <= seatLayer.rowCount; row++) {
        for (let col = 1; col <= seatLayer.columnCount; col++) {
          const item = {
            id: `${col + seatLayer.numberingStart}${row}`,
            type: "seat",
            width:
              (seatStageWidth - seatLayer.spaceBetweenSeatsX) /
              seatLayer.columnCount,
            height:
              (seatStageHeight - seatLayer.spaceBetweenSeatsY) /
              seatLayer.rowCount,
            posX:
              seatLayer.stagePosXStart +
              seatLayer.spaceBetweenSeatsX * (col - 1) +
              seatWidth * (col - 1),
            posY:
              seatLayer.stagePosYStart +
              seatLayer.spaceBetweenSeatsY * (row - 1) +
              seatHeight * (row - 1),
            text: `${colNumbers[col + seatLayer.numberingStart - 1]}${row}`,
            hasError: Math.floor(Math.random() * 10) < 2,
            items: [],
          };

          // generating sub items level 1
                     const deviceCount = Math.floor(Math.random() * 3) + 1;
          for (let i = 0; i < deviceCount; i++) {
            const spaceBetweenDevices = 2;

            const deviceItem = {
              id: `device-${col + seatLayer.numberingStart}${row}-${i}`,
              type: "device",
              seat: `${col + seatLayer.numberingStart}${row}`,
              width: 10,
              height: 10,
              scale: 0.1,
              posX: 2 + item.posX + spaceBetweenDevices * i + 10 * i,
              posY:
                item.posY + Math.floor(Math.random() * (item.height - 2)) + 2,
              text: `Device ${i + 1}`,
              hasError: Math.floor(Math.random() * 10) < 2,
              items: [],
              color: item.hasError
                ? "red"
                : `#${Math.floor(Math.random() * 16777215).toString(16)}`,
            };
            item.items.push(deviceItem);
          } 

          seatLayer.items.push(item);
        }
      }
    }); */

    return data;
  }, []);

  const [data, setData] = useState(layoutData);
  return { data, setData };
};

export default useLopaLayout;
