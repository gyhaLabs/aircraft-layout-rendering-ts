import { LocationAlignment } from "../types/location";
import { Region } from "../types/region";

export type LopaRegion = {
  region: Region;
};

export const analizeLopa = (lopaFile: LopaRegion[]) => {
  let rowSizeLeft = 0;
  let rowSizeRight = 0;
  let rowSizeMiddle = 0;

  let maxColSizeLeft = 0;
  let maxColSizeRight = 0;
  let maxColSizeMiddle = 0;

  lopaFile.map((sections) => {
    return sections.region.locations.map((location) => {
      switch (location.alignment_in_fuselage as LocationAlignment) {
        case LocationAlignment.LEFT:
          rowSizeLeft = rowSizeLeft + Number(location.grid_row_max);
          maxColSizeLeft = Math.max(
            maxColSizeLeft,
            Number(location.grid_col_max)
          );
          break;
        case LocationAlignment.RIGHT:
          rowSizeRight += Number(location.grid_row_max);
          maxColSizeRight = Math.max(
            maxColSizeRight,
            Number(location.grid_col_max)
          );
          break;
        case LocationAlignment.MIDDLE:
          rowSizeMiddle += Number(location.grid_row_max);
          maxColSizeMiddle = Math.max(
            maxColSizeMiddle,
            Number(location.grid_col_max)
          );
          break;
      }

      return null;
    });
  });

  return {
    rowSizeLeft,
    rowSizeRight,
    rowSizeMiddle,
    maxColSizeLeft,
    maxColSizeRight,
    maxColSizeMiddle,
  };
};
