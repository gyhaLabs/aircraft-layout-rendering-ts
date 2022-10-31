import { Location } from './location';

export type Region = {
    compartment: string;
    deck: string;
    id: number;
    locations: Location[];
    columns?: number;
    heightRatio?: number;
};
