import React from 'react';
import { Layer, Rect, Text } from 'react-konva';
import { DeviceGroup } from '../types/extendedTypes';
import { hasOverlap, viewportRectangle } from '../utils/viewport';

export type ConnectionLayerProps = {
    deviceGroups: DeviceGroup[];
    stage: {
        scale: number;
        x: number;
        y: number;
        width: number;
        height: number;
    };
};

const ConnectionLayer = ({ deviceGroups, stage }: ConnectionLayerProps) => {
    const viewport = viewportRectangle(stage);
    return (
        <Layer key="device-layer">
            {deviceGroups.map((group: DeviceGroup) => {
                return group.devices?.map((deviceItem) => {
                    return deviceItem.connections?.map((connectionItem, i) => {
                        const { posX, posY, width, height, scale, color, destination_id, parentDevice, device_port } = connectionItem;
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
                                <Text
                                    text={`${destination_id} (${device_port})`}
                                    x={posX + 1}
                                    y={posY + 0.15}
                                    scaleX={scale * 0.5}
                                    scaleY={scale * 0.5}
                                />
                            </React.Fragment>
                        );
                    });
                });
            })}
        </Layer>
    );
};

export default ConnectionLayer;
