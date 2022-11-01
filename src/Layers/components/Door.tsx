import React from 'react';
import { Image, Text } from 'react-konva';
import useImages from '../../hooks/useImages';
import { ExtendedDevice, LocationAlignment } from '../../types/extendedTypes';

const Door = ({ device, scale, align }: { device: ExtendedDevice; scale: number; align: string }) => {
    const { posX, posY, width, height, logical_name } = device;
    const { box } = useImages();

    const doorWidth = 40;
    const positionX = align === LocationAlignment.LEFT ? posX - 12 : posX + width + 12 - doorWidth;

    return (
        <React.Fragment>
            <Image x={positionX} y={posY} width={doorWidth} height={height} image={box} scaleX={1} scaleY={1} />
            <Text text={logical_name} scaleX={scale < 4 ? 0.5 : 0.2} scaleY={scale < 4 ? 0.5 : 0.2} x={positionX + 5} y={posY + 5} />
        </React.Fragment>
    );
};

export default Door;
