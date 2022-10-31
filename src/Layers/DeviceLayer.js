import React from 'react';
import { Layer, Rect, Text } from 'react-konva';
import { hasOverlap, viewportRectangle } from '../utils/viewport';

const DeviceLayer = ({ layoutData, stage }) => {
    const viewport = viewportRectangle(stage);
    return (
        <Layer key="device-layer">
            {layoutData?.layers?.map((layer) => {
                return layer.items.map((item) => {
                    return item.items.map((deviceItem, i) => {
                        const { posX, posY, width, height, scale, color, text } = deviceItem;
                        const device = { x: posX, y: posY, width, height };

                        if (!hasOverlap(viewport, device)) return null;

                        return (
                            <React.Fragment key={`deviceLayer-${i}`}>
                                <Rect
                                    x={posX}
                                    y={posY}
                                    width={width}
                                    height={height}
                                    scaleX={scale}
                                    scaleY={scale}
                                    fill={color}
                                    shadowBlur={10}
                                />
                                <Text text={text} x={posX + width / 2 - 6} y={posY + height / 2 - 4} scaleX={scale} scaleY={scale} />
                            </React.Fragment>
                        );
                    });
                });
            })}
        </Layer>
    );
};

export default DeviceLayer;
