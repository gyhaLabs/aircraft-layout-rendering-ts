import React, { useState } from 'react';
import { Group, Image, Text } from 'react-konva';
import useImages from '../hooks/useImages';
import { DeviceGroup, DEVICE_TYPE, ExtendedDevice, SPECIAL_SECTIONS } from '../types/extendedTypes';
import Divider from './components/Devider';
import Door from './components/Door';
import SPM from './components/SPM';

export type GroupLayerProps = {
    layer: DeviceGroup;
    stage: {
        scale: number;
        x: number;
        y: number;
        width: number;
        height: number;
    };
};

const GroupLayer = ({ layer, stage }: GroupLayerProps) => {
    const { box, boxHovered, boxError, boxErrorHovered, lavatory } = useImages();
    const [hovered, setHovered] = useState<string>('');

    const isDivider = layer.name === SPECIAL_SECTIONS.DEVIDER;
    const isLavatory = layer.name === SPECIAL_SECTIONS.LAVATORY;
    const isExit = layer.name && [SPECIAL_SECTIONS.DOOR, SPECIAL_SECTIONS.EMERGENCY_EXIT].includes(layer.name);

    return (
        <Group key={`group-${layer.id}${Math.random()}`}>
            {layer?.devices?.map((device: ExtendedDevice) => {
                if (isDivider) {
                    return <Divider device={device} key={device.id} />;
                }

                if (isExit) {
                    return <Door device={device} scale={stage.scale} align={layer.alignment_in_fuselage} />;
                }

                if (device.type === DEVICE_TYPE.SPM) {
                    return <SPM device={device} />;
                }

                const { id, posX, posY, width, height, logical_name } = device;

                let image = hovered === logical_name ? boxHovered : box;

                if (device.hasError) {
                    image = hovered === logical_name ? boxErrorHovered : boxError;
                }

                return (
                    <React.Fragment key={`${layer.id}${id}${Math.random()}`}>
                        <Image
                            key={`${layer.id}${id}${Math.random()}`}
                            x={posX}
                            y={posY}
                            width={isExit ? 30 : width}
                            height={height}
                            image={image}
                            scaleX={1}
                            scaleY={1}
                            onClick={() => {
                                alert(`Clicked on ${logical_name}`);
                            }}
                            onMouseEnter={() => setHovered(logical_name)}
                            onMouseLeave={() => setHovered('')}
                        />

                        {isLavatory && <Image x={posX + width - 25} y={posY + 3} image={lavatory} scaleX={0.07} scaleY={0.07} />}

                        <Text
                            text={logical_name}
                            scaleX={stage.scale < 4 ? 0.5 : 0.2}
                            scaleY={stage.scale < 4 ? 0.5 : 0.2}
                            x={posX + 5}
                            y={posY + 5}
                        />
                    </React.Fragment>
                );
            })}
        </Group>
    );
};

export default GroupLayer;
