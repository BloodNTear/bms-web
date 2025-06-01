import './VisualGraph.css';

import { useRef, useEffect, useState } from 'react';

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

  const imgRef = useRef(null);
  const [size, setSize] = useState({ width: 1000, height: 750 });

  useEffect(() => {
    if (imgRef.current) {
      const updateSize = () => {
        const { width, height } = imgRef.current.getBoundingClientRect();
        setSize({ width, height });
      };
      updateSize();
      window.addEventListener('resize', updateSize);
      return () => window.removeEventListener('resize', updateSize);
    }
  }, []);

  return (
    <div className="image-container" style={{ position: 'relative' }}>
      <img
        ref={imgRef}
        src={GraphIMG}
        alt="Visual Graph"
        style={{ width: '100%', height: 'auto', display: 'block' }}
      />

      <svg
        ref={svgRef}
        viewBox="0 0 1000 750"
        width={size.width}
        height={size.height}
        style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'auto', cursor: 'crosshair' }}
        onClick={handleSvgClick}
      >
        {/* Entrance To Pump */}
        <WaterPipe
          flowState={pumpState}
          flowDirection={true}
          speed={3}
          startPoint={[844, 601]}
          endPoint={[793, 601]}
        />

        {/* Pump to By pass Valve */}
        <WaterPipe
          flowState={pumpState}
          flowDirection={true}
          speed={3}
          startPoint={[627, 601]}
          endPoint={[152, 601]}
        />

        {/* By Pass Valve To Chiller */}
        <WaterPipe
          flowState={pumpState}
          flowDirection={true}
          speed={4 - GetValveSpeed()}
          startPoint={[152, 601]}
          endPoint={[-256, 601]}
        />

        {/* Chiller To By Pass Valve */}
        <WaterPipe
          flowState={pumpState}
          flowDirection={true}
          speed={4 - GetValveSpeed()}
          startPoint={[-256, 451]}
          endPoint={[152, 451]}
        />

        {/* By Pass Valve To Return */}
        <WaterPipe
          flowState={pumpState}
          flowDirection={true}
          speed={3}
          startPoint={[152, 451]}
          endPoint={[844, 451]}
        />

        {/* Through By Pass Valve */}
        <WaterPipe
          flowState={pumpState && valveState > 0}
          flowDirection={true}
          speed={GetValveSpeed()}
          startPoint={[152, 601]}
          endPoint={[152, 451]}
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