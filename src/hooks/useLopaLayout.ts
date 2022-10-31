import { useMemo, useState } from 'react';
import { Location, LocationAlignment } from '../types/location';
import { Region } from '../types/region';
import { VisualGroup, VisualGroupItem, VisualGroupSubItem } from '../types/visualGroup';
import { parseLopaJSON } from '../utils/lopa';
import { getLopaJSON } from '../utils/lopa.testfile';

const itemSpacingX = 4;
const itemSpacingY = 4;
const groupSpacing = 6;
const deckPosYStart = 0;
const deckPosYEnd = 1410;
const fullHeight = deckPosYEnd - deckPosYStart;
const deckPosXStart = 236;
const deckPosXEnd = 482;

const getGroupPosXStart = (region: Region, location: Location) => {
    switch (location.alignment_in_fuselage) {
        case LocationAlignment.LEFT:
            return deckPosXStart;
        case LocationAlignment.MIDDLE:
            return deckPosXStart + (deckPosXEnd - deckPosXStart) / 3;
        case LocationAlignment.RIGHT:
            return region.columns === 3 ? deckPosXStart + ((deckPosXEnd - deckPosXStart) / 3) * 2 : (deckPosXStart + deckPosXEnd) / 2;
        case LocationAlignment.FULL_WIDTH:
            return deckPosXStart;
        default:
            return deckPosXStart;
    }
};

const getGroupPosXEnd = (region: Region, location: Location) => {
    switch (location.alignment_in_fuselage) {
        case LocationAlignment.LEFT:
            return region.columns === 3 ? deckPosXStart + (deckPosXEnd - deckPosXStart) / 3 : (deckPosXStart + deckPosXEnd) / 2;
        case LocationAlignment.MIDDLE:
            return deckPosXStart + ((deckPosXEnd - deckPosXStart) / 3) * 2;
        case LocationAlignment.RIGHT:
            return deckPosXEnd;
        case LocationAlignment.FULL_WIDTH:
            return deckPosXEnd;
        default:
            return deckPosXEnd;
    }
};

const getNumberingStart = (region: Region, location: Location) => {
    switch (location.alignment_in_fuselage) {
        case LocationAlignment.LEFT:
            return 0;
        case LocationAlignment.MIDDLE:
            return Number(location.grid_col_max) || 1;
        case LocationAlignment.RIGHT:
            return region.columns === 3 ? (Number(location.grid_col_max) || 1) * 2 : Number(location.grid_col_max) || 1;
        case LocationAlignment.FULL_WIDTH:
            return 0;
        default:
            return 0;
    }
};

const useLopaLayout = () => {
    const lopaJSON = getLopaJSON();
    const { regions, fullUnitHeight } = parseLopaJSON(lopaJSON.lopa);

    const layoutData = useMemo(() => {
        let regionBoundary = 0;
        let regionStartingPoint = 0;
        let locationY = {
            [LocationAlignment.LEFT]: 0,
            [LocationAlignment.MIDDLE]: 0,
            [LocationAlignment.RIGHT]: 0,
            [LocationAlignment.FULL_WIDTH]: 0,
        };

        const data = {
            regions: regions.map((region) => {
                const regionHeight = fullHeight * (region.heightRatio || 1);
                const r = {
                    ...region,
                    xStart: deckPosXStart,
                    yStart: regionBoundary,
                    width: deckPosXEnd - deckPosXStart,
                    height: regionHeight,
                };
                regionBoundary += regionHeight + 3;
                return r;
            }),

            groups: regions
                .map((region) => {
                    const regionHeight = fullHeight * (region.heightRatio || 1);
                    locationY[LocationAlignment.LEFT] = regionStartingPoint;
                    locationY[LocationAlignment.MIDDLE] = regionStartingPoint;
                    locationY[LocationAlignment.RIGHT] = regionStartingPoint;
                    locationY[LocationAlignment.FULL_WIDTH] = regionStartingPoint;

                    const regions = region.locations.map((location) => {
                        const { section, alignment_in_fuselage: alignment, grid_col_max, grid_row_max } = location;
                        const locationHeight = ((Number(grid_row_max) || 1) * fullHeight) / fullUnitHeight;

                        const group: VisualGroup = {
                            id: location.id.toString(),

                            groupPosXStart: getGroupPosXStart(region, location) + groupSpacing,
                            groupPosXEnd: getGroupPosXEnd(region, location) - groupSpacing,
                            groupPosYStart: locationY[alignment as LocationAlignment] + groupSpacing,
                            groupPosYEnd: locationY[alignment as LocationAlignment] + locationHeight - groupSpacing,

                            columnCount: Number(grid_col_max) || 1,
                            rowCount: Number(grid_row_max) || 1,

                            numberingStart: getNumberingStart(region, location),

                            itemSpacingX,
                            itemSpacingY,

                            name: section,
                            description: section,
                            visible: true,
                            items: [],
                        };

                        locationY[alignment as LocationAlignment] += locationHeight;

                        return group;
                    });

                    regionStartingPoint += regionHeight + 3;

                    return regions;
                })
                .flat(),
        };

        data.groups.forEach((group: VisualGroup) => {
            const { groupPosXEnd, groupPosYEnd, groupPosXStart, groupPosYStart, columnCount, rowCount, numberingStart, name } = group;
            let groupWidth = groupPosXEnd - groupPosXStart;
            let groupHeight = groupPosYEnd - groupPosYStart;
            let itemWidth = groupWidth / columnCount - itemSpacingX;
            let itemHeight = groupHeight / rowCount - itemSpacingY;

            for (let row = 1; row <= rowCount; row++) {
                for (let col = 1; col <= columnCount; col++) {
                    const deviceName = rowCount <= 1 ? name : `${name.substring(0, 3)}${row}${col + numberingStart}`;

                    const item: VisualGroupItem = {
                        id: `${deviceName}${col + numberingStart}${row}`,
                        type: 'seat',
                        width: (groupWidth - itemSpacingX) / columnCount,
                        height: (groupHeight - itemSpacingY) / rowCount,
                        posX: groupPosXStart + itemSpacingX * (col - 1) + itemWidth * (col - 1),
                        posY: groupPosYStart + itemSpacingY * (row - 1) + itemHeight * (row - 1),
                        text: deviceName,
                        hasError: Math.floor(Math.random() * 10) < 2,
                        items: [],
                    };

                    // generating sub items level 1
                    const deviceCount = Math.floor(Math.random() * 3) + 1;
                    for (let i = 0; i < deviceCount; i++) {
                        const spaceBetweenDevices = 2;

                        const deviceItem: VisualGroupSubItem = {
                            id: `device-${col + numberingStart}${row}-${i}`,
                            type: 'device',
                            seat: `${col + numberingStart}${row}`,
                            width: 10,
                            height: 10,
                            scale: 0.1,
                            posX: 2 + item.posX + spaceBetweenDevices * i + 10 * i,
                            posY: item.posY + Math.floor(Math.random() * (item.height - 2)) + 2,
                            text: `Device ${i + 1}`,
                            hasError: Math.floor(Math.random() * 10) < 2,
                            //items: [],
                            color: item.hasError ? 'red' : `#${Math.floor(Math.random() * 16777215).toString(16)}`,
                        };
                        item.items.push(deviceItem);
                    }

                    group.items.push(item);
                }
            }
        });

        return data;
    }, []);

    const [data, setData] = useState(layoutData);
    return { data, setData };
};

export default useLopaLayout;
