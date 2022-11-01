import { Image } from 'react-konva';
import useImages from '../../hooks/useImages';
import { ExtendedDevice } from '../../types/extendedTypes';

const Divider = ({ device }: { device: ExtendedDevice }) => {
    const { posX, posY, width, height } = device;
    const { boxHovered } = useImages();
    return <Image x={posX} y={posY + height / 2} width={width} height={3} image={boxHovered} scaleX={1} scaleY={1} />;
};

export default Divider;
