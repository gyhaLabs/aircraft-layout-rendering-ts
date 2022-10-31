import { useMemo, useState } from "react";

const useAircraftLayout = () => {
  const layoutData = useMemo(() => {
    const data = {
      layers: [
        {
          id: 1,
          stagePosXStart: 234,
          stagePosXEnd: 340,
          stagePosYStart: 0.599,
          stagePosYEnd: 1410,
          columnCount: 3,
          rowCount: 39,
          spaceBetweenSeatsX: 5,
          spaceBetweenSeatsY: 3,
          numberingStart: 0,
          name: "seatLayer",
          description: "Seat Layer - Left Side",
          visible: true,
          items: [],
        },
        {
          id: 2,
          stagePosXStart: 376,
          stagePosXEnd: 482,
          stagePosYStart: 0.599,
          stagePosYEnd: 1410,
          columnCount: 3,
          rowCount: 39,
          spaceBetweenSeatsX: 5,
          spaceBetweenSeatsY: 3,
          numberingStart: 3,
          name: "seatLayer",
          description: "Seat Layer - Right Side",
          visible: true,
          items: [],
        },
      ],
    };

    // generate seats
    let colNumbers = ["A", "B", "C", "D", "E", "F"];

    data.layers
      .filter((layer) => layer.name === "seatLayer")
      .forEach((seatLayer) => {
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
      });
    return data;
  }, []);

  const [data, setData] = useState(layoutData);
  return { data, setData };
};

export default useAircraftLayout;
