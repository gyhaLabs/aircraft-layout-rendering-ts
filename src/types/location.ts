import { Device } from "./device";

export type Location = {
  alignment_in_fuselage: string;
  devices?: Device[];
  grid_col_max: string;
  grid_row_max: string;
  id: number;
  location: string | null;
  order_in_region: string;
  section: string;
  zone_number: string;
};

export enum LocationAlignment {
  MIDDLE = "middle",
  LEFT = "left",
  RIGHT = "right",
  FULL_WIDTH = "full_width",
}
