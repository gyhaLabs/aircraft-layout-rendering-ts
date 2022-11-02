import React from 'react';
import { Rect, Text } from 'react-konva';
import { ExtendedDevice } from '../../types/extendedTypes';

const SPM = ({ device }: { device: ExtendedDevice }) => {
    const { posX, posY, logical_name, width, height } = device;

    return (
        <React.Fragment>
            <Rect x={posX} y={posY} width={width} height={height} scaleX={1} scaleY={1} stroke="#DDDDDD" fill="#DDDDDD" />
            <Text text={logical_name} x={posX} y={posY - 3} scaleX={0.12} scaleY={0.12} />
        </React.Fragment>
    );
};

export default SPM;
