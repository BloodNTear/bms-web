import './VisualGraph.css';

import { useRef } from 'react';

import GraphIMG from '../../../assets/graph-image.PNG';
import WaterPipe from './WaterPipe/WaterPipe';
import WindArrow from './WindArrow/WindArrow';

function VisualGraph({ pumpState, valveState, compState }) {
  const svgRef = useRef(null);

  function handleSvgClick(event) {
    const svg = svgRef.current;
    if (!svg) return;

    const pt = svg.createSVGPoint();
    pt.x = event.clientX;
    pt.y = event.clientY;

    const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());

    alert(`x: ${svgP.x.toFixed(2)}, y: ${svgP.y.toFixed(2)}`);
  };

  function GetValveSpeed(){
     if(valveState > 0 && valveState < 10){
        return 1;
     }else if(valveState < 20){
        return 2;
     }else{
        return 3;
     }
  };

  return (
    <div className="image-container" style={{ position: 'relative' }}>
      <img src={GraphIMG} alt="Visual Graph" />

      <svg
        ref={svgRef}
        viewBox="0 0 1000 750"
        width="1000"
        height="750"
        style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'auto', cursor: 'crosshair' }}
        onClick={handleSvgClick}
      >

        {/* Entrance To Pump */}
        <WaterPipe
          flowState={pumpState}
          flowDirection={true}
          speed={3}
          startPoint={[603, 269]}
          endPoint={[581, 269]}
        />

        {/* Pump to By pass Valve */}
        <WaterPipe
          flowState={pumpState}
          flowDirection={true}
          speed={3}
          startPoint={[500, 269]}
          endPoint={[289, 269]}
        />

        {/* By Pass Valve To Chiller */}
        <WaterPipe
          flowState={pumpState}
          flowDirection={true}
          speed={4 - GetValveSpeed()}
          startPoint={[289, 269]}
          endPoint={[105, 269]}
        />

        {/* Chiller To By Pass Valve */}
        <WaterPipe
          flowState={pumpState}
          flowDirection={true}
          speed={4 - GetValveSpeed()}
          startPoint={[105, 202]}
          endPoint={[289, 202]}
        />

        {/* By Pass Valve To Return */}
        <WaterPipe
          flowState={pumpState}
          flowDirection={true}
          speed={3}
          startPoint={[289, 202]}
          endPoint={[601, 202]}
        />

        {/* Through By Pass Valve */}
        <WaterPipe
          flowState={pumpState && valveState > 0}
          flowDirection={true}
          speed={GetValveSpeed()}
          startPoint={[290, 269]}
          endPoint={[290, 202]}
        />

        {/* Visualize Comp Wind */}
        {compState && (
            <>
                <WindArrow 
                    flowState={true}
                    speed={3}
                    startPoint={[713, 160]}
                    endPoint={[720, 140]}
                />
                <WindArrow 
                    flowState={true}
                    speed={3}
                    startPoint={[728, 160]}
                    endPoint={[728, 140]}
                />
                <WindArrow 
                    flowState={true}
                    speed={3}
                    startPoint={[744, 160]}
                    endPoint={[736, 140]}
                />

                <WindArrow 
                    flowState={true}
                    speed={3}
                    startPoint={[795, 160]}
                    endPoint={[802, 140]}
                />
                <WindArrow 
                    flowState={true}
                    speed={3}
                    startPoint={[810, 160]}
                    endPoint={[810, 140]}
                />
                <WindArrow 
                    flowState={true}
                    speed={3}
                    startPoint={[825, 160]}
                    endPoint={[818, 140]}
                />
            </>
        )}

      </svg>
    </div>
  );
};

export default VisualGraph;