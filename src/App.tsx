import { useCallback } from 'react';
import { useState } from 'react';
import useImages from './hooks/useImages';
import ConnectionLayer from './Layers/ConnectionLayer';
import GroupLayer from './Layers/GroupLayer';
import { Stage, Layer, Image } from 'react-konva';
import useLopaLayout from './hooks/useLopaLayout';
import RegionLayer from './Layers/RegionLayer';

function App() {
    const { background } = useImages();

    const { data: layoutData } = useLopaLayout();

    const [stage, setStage] = useState({
        scale: 1,
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    });

    const handleDragEnd = useCallback((e: { target: { getStage: () => any } }) => {
        const stage = e.target.getStage();
        const scale = stage.scaleX();
        const mousePointTo = {
            x: (stage.getPointerPosition().x - stage.x()) / scale,
            y: (stage.getPointerPosition().y - stage.y()) / scale,
        };

        const stageToSet = {
            scale: scale,
            x: (stage.getPointerPosition().x / scale - mousePointTo.x) * scale,
            y: (stage.getPointerPosition().y / scale - mousePointTo.y) * scale,
            width: stage.width(),
            height: stage.height(),
        };

        setStage(stageToSet);
    }, []);

    const handleWheel = useCallback((e: { target: { getStage: () => any }; evt: { deltaY: number } }) => {
        const scaleBy = 1.1;
        const stage = e.target.getStage();
        const oldScale = stage.scaleX();
        const mousePointTo = {
            x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
            y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale,
        };

        const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;

        const stageToSet = {
            scale: newScale,
            x: (stage.getPointerPosition().x / newScale - mousePointTo.x) * newScale,
            y: (stage.getPointerPosition().y / newScale - mousePointTo.y) * newScale,
            width: stage.width(),
            height: stage.height(),
        };

        setStage(stageToSet);
    }, []);

    return (
        <div className="App">
            <div
                style={{
                    padding: 8,
                    marginBottom: 20,
                    background: 'grey',
                    color: 'white',
                }}
            >
                Aircraft layout rendering solution demo based on canvas
            </div>
            <Stage
                draggable
                width={window.innerWidth}
                height={window.innerHeight - 50}
                onWheel={handleWheel}
                onDragEnd={handleDragEnd}
                scaleX={stage.scale}
                scaleY={stage.scale}
                x={stage.x}
                y={stage.y}
            >
                <Layer>
                    <Image x={0} y={0} image={background} scaleX={0.5} scaleY={0.5} />
                </Layer>

                <RegionLayer regions={layoutData.regions} />

                <Layer>
                    {layoutData.groups.map((layer, i) => (
                        <GroupLayer layer={layer} stage={stage} key={`layer-${i}`} />
                    ))}
                </Layer>

                {stage.scale > 4 && <ConnectionLayer deviceGroups={layoutData.groups} stage={stage} />}
            </Stage>
        </div>
    );
}

export default App;

/* 
  Solution help from:
  https://longviewcoder.com/2021/02/04/html5-canvas-viewport-optimisation-with-konva/
  
  Test here:    
  https://codesandbox.io/s/github/gyhaLabs/aircraft-layout-rendering
*/
