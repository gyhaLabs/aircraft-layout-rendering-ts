import { useMemo, useState } from 'react';
import { DeviceGroup, LocationAlignment, ExtendedDevice, ExtendedRegion, DEVICE_TYPE } from '../types/extendedTypes';
import { parseLopaJSON } from '../utils/lopa';
import { getLopaJSON } from '../utils/lopa.testfile';

const itemSpacingX = 4;
const itemSpacingY = 4;
const groupSpacing = 8;
const deckPosYStart = 0;
const deckPosYEnd = 1410;
const fullHeight = deckPosYEnd - deckPosYStart;
const deckPosXStart = 236;
const deckPosXEnd = 482;

const getGroupPosXStart = (region: ExtendedRegion, deviceGroup: DeviceGroup) => {
    switch (deviceGroup.alignment_in_fuselage) {
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

const getGroupPosXEnd = (region: ExtendedRegion, deviceGroup: DeviceGroup) => {
    switch (deviceGroup.alignment_in_fuselage) {
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

                    const regions = region.locations.map((deviceGroup: DeviceGroup) => {
                        const { section, alignment_in_fuselage: alignment, grid_row_max } = deviceGroup;
                        const locationHeight = ((Number(grid_row_max) || 1) * fullHeight) / fullUnitHeight;

                        locationY[LocationAlignment.FULL_WIDTH] = Math.max(
                            locationY[LocationAlignment.LEFT],
                            locationY[LocationAlignment.MIDDLE],
                            locationY[LocationAlignment.RIGHT]
                        );

                        const group: DeviceGroup = {
                            ...deviceGroup,
                            groupPosXStart: getGroupPosXStart(region, deviceGroup) + groupSpacing,
                            groupPosXEnd: getGroupPosXEnd(region, deviceGroup) - groupSpacing,
                            groupPosYStart: locationY[alignment as LocationAlignment] + groupSpacing,
                            groupPosYEnd: locationY[alignment as LocationAlignment] + locationHeight - groupSpacing,
                            itemSpacingX,
                            itemSpacingY,
                            name: section,
                            devices: deviceGroup.devices || [],
                        };

                        locationY[alignment as LocationAlignment] += locationHeight;
                        return group;
                    });

                    regionStartingPoint += regionHeight + 3;

                    return regions;
                })
                .flat(),
        };

        data.groups.forEach((group: DeviceGroup, i) => {
            const { groupPosXEnd, groupPosYEnd, groupPosXStart, groupPosYStart, name } = group;
            let groupWidth = groupPosXEnd && groupPosXStart ? groupPosXEnd - groupPosXStart : 0;
            let groupHeight = groupPosYEnd && groupPosYStart ? groupPosYEnd - groupPosYStart : 0;

            // If there are no devices in a group (Ex: lavatory, galley, door, emergency_exit)
            if (!group.devices?.length) {
                const item: ExtendedDevice = {
                    device: name || '',
                    grid_col: '1',
                    grid_row: '1',
                    logical_name: name || '',
                    type: name || '',

                    id: `${group.name}-${i}`,
                    width: groupWidth - itemSpacingX,
                    height: groupHeight - itemSpacingY,
                    posX: groupPosXStart,
                    posY: groupPosYStart,
                    hasError: false,
                    connections: [],
                };
                group.devices = [item];
            } else {
                let devices: ExtendedDevice[] = [];
                group.devices.map((device) => {
                    const cols = Number(group.grid_col_max);
                    const rows = Number(group.grid_row_max);

                    const col = Number(device.grid_col);
                    const row = Number(device.grid_row);

                    let itemWidth = groupWidth / cols - itemSpacingX;
                    let itemHeight = groupHeight / rows - itemSpacingY;

                    let xStart = groupPosXStart || 0;
                    let yStart = groupPosYStart || 0;

                    const deviceName = [DEVICE_TYPE.ISD, DEVICE_TYPE.SPM].includes(device.type) ? device.logical_name : device.type;

                    const item: ExtendedDevice = {
                        device: deviceName,
                        grid_col: device.grid_col,
                        grid_row: device.grid_row,
                        logical_name: deviceName,
                        type: device.type,

                        id: `${group.name}-${i}`,
                        width: (groupWidth - itemSpacingX) / cols,
                        height: (groupHeight - itemSpacingY) / rows,
                        posX: xStart + itemSpacingX * (col - 1) + itemWidth * (col - 1),
                        posY: yStart + itemSpacingY * (row - 1) + itemHeight * (row - 1),
                        hasError: Math.floor(Math.random() * 10) < 2,
                        connections: [],
                    };

                    devices.push(item);
                });

                group.devices = devices;
            }

            /*  const { groupPosXEnd, groupPosYEnd, groupPosXStart, groupPosYStart, columnCount, rowCount, numberingStart, name } = group;
            let groupWidth = groupPosXEnd - groupPosXStart;
            let groupHeight = groupPosYEnd - groupPosYStart;
            let itemWidth = groupWidth / columnCount - itemSpacingX;
            let itemHeight = groupHeight / rowCount - itemSpacingY;

            for (let row = 1; row <= rowCount; row++) {
                for (let col = 1; col <= columnCount; col++) {
                    const deviceName = rowCount <= 1 ? name : `${name.substring(0, 3)}${row}${col + numberingStart}`;

                    const item: ExtendedDevice = {
                        id: `${deviceName}${col + numberingStart}${row}${Math.random()}`,
                        type: 'seat',
                        width: (groupWidth - itemSpacingX) / columnCount,
                        height: (groupHeight - itemSpacingY) / rowCount,
                        posX: groupPosXStart + itemSpacingX * (col - 1) + itemWidth * (col - 1),
                        posY: groupPosYStart + itemSpacingY * (row - 1) + itemHeight * (row - 1),
                        text: deviceName,
                        hasError: Math.floor(Math.random() * 10) < 2,
                        connections: [],
                    };

                    // generating sub items level 1
                    const deviceCount = Math.floor(Math.random() * 3) + 1;
                    for (let i = 0; i < deviceCount; i++) {
                        const spaceBetweenDevices = 2;

                        const deviceItem: Connection = {
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
                        item.connections.push(deviceItem);
                    }

                    group.devices.push(item);
                }
            } */
        });

        return data;
    }, []);

    const [data, setData] = useState(layoutData);
    return { data, setData };
};

export default useLopaLayout;
