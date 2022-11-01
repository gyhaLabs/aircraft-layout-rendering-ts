import React from 'react';
import { Rect, Text } from 'react-konva';
import { ExtendedDevice } from '../../types/extendedTypes';

const SPM = ({ device }: { device: ExtendedDevice }) => {
    const { posX, posY, logical_name } = device;

    return (
        <React.Fragment>
            <Rect x={posX - 5} y={posY - 5} width={10} height={10} scaleX={1} scaleY={1} stroke="#DDDDDD" fill="#DDDDDD" />
            <Text text={logical_name} x={posX - 3} y={posY - 3} scaleX={0.4} scaleY={0.4} />
        </React.Fragment>
    );
};

export default SPM;
