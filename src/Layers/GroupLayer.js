import React from 'react';
import { Group, Image, Text } from 'react-konva';
import useImages from '../hooks/useImages';

const GroupLayer = ({ layer, hoveredIds, setHoveredIds, stage }) => {
    const { box, boxHovered, boxError, boxErrorHovered } = useImages();

    return (
        <Group key={`group-${layer.id}`}>
            {layer?.items?.map((item) => {
                let image = hoveredIds.find((id) => id === item.id) ? boxHovered : box;

                if (item.hasError) {
                    image = hoveredIds.find((id) => id === item.id) ? boxErrorHovered : boxError;
                }
                return (
                    <React.Fragment key={`${layer.id}${item.id}`}>
                        <Image
                            x={item.posX}
                            y={item.posY}
                            width={item.width}
                            height={item.height}
                            image={image}
                            scaleX={1}
                            scaleY={1}
                            onClick={() => {
                                alert(`Clicked on ${item.text}`);
                            }}
                            onMouseEnter={() => {
                                setHoveredIds((prev) => [...prev, item.id]);
                            }}
                            onMouseLeave={() => {
                                setHoveredIds((prev) => {
                                    const arrN = [...prev];
                                    arrN.pop();
                                    return [...arrN];
                                });
                            }}
                        />

                        <Text
                            text={item.text}
                            scaleX={stage.scale < 4 ? 0.5 : 0.2}
                            scaleY={stage.scale < 4 ? 0.5 : 0.2}
                            x={item.posX + 5}
                            y={item.posY + 5}
                        />
                    </React.Fragment>
                );
            })}
        </Group>
    );
};

export default GroupLayer;
