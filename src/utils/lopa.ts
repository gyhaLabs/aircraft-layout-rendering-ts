import { DeviceGroup, ExtendedRegion, LocationAlignment, Region } from '../types/extendedTypes';

export type LopaRegion = {
    region: Region;
};

type RegionUnitHeight = {
    id: number;
    unitHeight: number;
};

export const parseLopaJSON = (lopaFile: LopaRegion[]) => {
    let regions: ExtendedRegion[] = [];
    lopaFile.map((section) => {
        regions.push(section.region);
    });

    const { unitHeights, fullUnitHeight } = getRegionUnitHeights(regions);

    regions.map((region: ExtendedRegion) => {
        region.columns = getColumnCount(region);
        region.heightRatio = (unitHeights.find((r) => r.id === region.id)?.unitHeight || 1) / fullUnitHeight;
    });

    return { regions, fullUnitHeight };
};

/**
 * @note Get the height of every region;
 * @param regions
 * @returns
 */
const getRegionUnitHeights = (regions: ExtendedRegion[]) => {
    let regionUnitHeights: RegionUnitHeight[] = [];
    let fullUnitHeight = 0;
    regions.map((region: ExtendedRegion) => {
        let rowSizeLeft = 0;
        let rowSizeRight = 0;
        let rowSizeMiddle = 0;
        let rowSizeFull = 0;

        region.locations.map((location: DeviceGroup) => {
            const rows = Number(location.grid_row_max) || 1;
            switch (location.alignment_in_fuselage as LocationAlignment) {
                case LocationAlignment.LEFT:
                    rowSizeLeft += rows;
                    break;
                case LocationAlignment.RIGHT:
                    rowSizeRight += rows;
                    break;
                case LocationAlignment.MIDDLE:
                    rowSizeMiddle += rows;
                    break;
                case LocationAlignment.FULL_WIDTH:
                    rowSizeFull += rows;
                    break;
            }
        });
        const localMax = Math.max(rowSizeLeft, rowSizeRight, rowSizeMiddle, rowSizeFull);
        regionUnitHeights.push({ id: region.id, unitHeight: localMax });
        fullUnitHeight += localMax;
    });
    return { unitHeights: regionUnitHeights, fullUnitHeight };
};

/**
 * @note Determine if the local region is 2 or 3 columned;
 * @param region
 * @returns
 */
const getColumnCount = (region: ExtendedRegion) => {
    let columns = 2;
    region.locations.map((location: DeviceGroup) => {
        if (location.alignment_in_fuselage === LocationAlignment.MIDDLE) {
            columns = 3;
        }
    });
    return columns;
};
