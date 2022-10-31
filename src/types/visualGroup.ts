export type VisualGroup = {
    id: string;
    groupPosXStart: number;
    groupPosXEnd: number;
    groupPosYStart: number;
    groupPosYEnd: number;

    columnCount: number;
    rowCount: number;

    numberingStart: number;

    itemSpacingX: number;
    itemSpacingY: number;

    name: string;
    description: string;
    visible: boolean;
    items: VisualGroupItem[];
};

export type VisualGroupItem = {
    id: string;
    type: string;
    width: number;
    height: number;
    posX: number;
    posY: number;
    text: string;
    hasError: boolean;
    color?: string;
    items: VisualGroupSubItem[];
};

export type VisualGroupSubItem = {
    id: string;
    type: string;
    seat: string;
    width: number;
    height: number;
    scale: number;
    posX: number;
    posY: number;
    text: string;
    hasError: boolean;
    color: string;
};
