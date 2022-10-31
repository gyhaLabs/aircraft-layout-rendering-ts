import { Connection } from "./connection";

export type Device = {
  connections?: Connection[];
  device: null;
  grid_col: string;
  grid_row: string;
  id: string;
  logical_name: string;
  type: string;
};
