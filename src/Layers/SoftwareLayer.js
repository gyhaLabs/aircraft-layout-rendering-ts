import React from 'react';
import { Layer, Rect, Text } from 'react-konva';
import { hasOverlap, viewportRectangle } from '../utils/viewport';

const SoftwareLayer = ({ layoutData, stage }) => {
    const viewport = viewportRectangle(stage);
    return (
        <Layer key="software-layer">
            {layoutData?.layers?.map((layer) => {
                return layer.items.map((item) => {
                    return item.items.map((deviceItem, i) => {
                        const { posX, posY, width, height, scale } = deviceItem;
                        const device = { x: posX, y: posY, width, height };

                        if (!hasOverlap(viewport, device)) return null;

                        return (
                            <React.Fragment key={`softwareLayer-${i}`}>
                                <Rect
                                    x={posX + 0.2}
                                    y={posY + 0.2}
                                    width={width}
                                    height={height}
                                    scaleX={scale / 2}
                                    scaleY={scale / 2}
                                    fill="blue"
                                    shadowBlur={10}
                                />
                                <Text text="Software 1" x={posX + 0.2} y={posY + 0.2} scaleX={scale / 12} scaleY={scale / 12} />
                            </React.Fragment>
                        );
                    });
                });
            })}
        </Layer>
    );
};

export default SoftwareLayer;
