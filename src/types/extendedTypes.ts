export const SPECIAL_SECTIONS = {
    DOOR: 'door',
    DEVIDER: 'devider',
    EMERGENCY_EXIT: 'emergency_exit',
    LAVATORY: 'lavatory',
};

export const DEVICE_TYPE = {
    SPM: 'SPM', // it's a connection hub for a row of seats
    ISD: 'ISD', // it's a seat
};

export type Region = {
    compartment: string;
    deck: string;
    id: number;
    locations: Location[];
};

export type ExtendedRegion = Region & {
    columns?: number;
    heightRatio?: number;
};

export enum LocationAlignment {
    MIDDLE = 'middle',
    LEFT = 'left',
    RIGHT = 'right',
    FULL_WIDTH = 'full_width',
}

export type Location = {
    alignment_in_fuselage: string;
    grid_col_max: string;
    grid_row_max: string;
    id: number;
    location: string | null;
    order_in_region: string;
    section: string;
    zone_number: string;
};

export type DeviceGroup = Location & {
    groupPosXStart: number;
    groupPosXEnd: number;
    groupPosYStart: number;
    groupPosYEnd: number;
    itemSpacingX?: number;
    itemSpacingY?: number;
    name?: string;
    devices?: ExtendedDevice[];
};

export type Device = {
    device: string | null;
    grid_col: string;
    grid_row: string;
    id: string;
    logical_name: string;
    type: string;
};

export type ExtendedDevice = Device & {
    width: number;
    height: number;
    posX: number;
    posY: number;
    hasError?: boolean;
    color?: string;
    connections?: ExtendedConnection[];
};

export type Connection = {
    connection: null;
    description: string;
    destination_id: string;
    device_port: string;
    device_port_type: string;
    id: number;
};

export type ExtendedConnection = Connection & {
    type?: string;
    seat?: string;
    width?: number;
    height?: number;
    scale?: number;
    posX?: number;
    posY?: number;
    text?: string;
    hasError?: boolean;
    color?: string;
};
