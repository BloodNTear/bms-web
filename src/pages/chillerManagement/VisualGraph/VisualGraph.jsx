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
        viewBox="0 0 2000 750"
        width={size.width}
        height={size.height}
        style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'auto', cursor: 'crosshair' }}
        // onClick={handleSvgClick}
      >
        {/* Entrance To Pump */}
        <WaterPipe
          flowState={pumpState}
          flowDirection={true}
          speed={3}
          startPoint={[1347, 602]}
          endPoint={[1298, 602]}
        />

        {/* Pump to By pass Valve */}
        <WaterPipe
          flowState={pumpState}
          flowDirection={true}
          speed={3}
          startPoint={[1124, 602]}
          endPoint={[650, 602]}
        />

        {/* By Pass Valve To Chiller */}
        <WaterPipe
          flowState={pumpState}
          flowDirection={true}
          speed={4 - GetValveSpeed()}
          startPoint={[650, 602]}
          endPoint={[235, 602]}
        />

        {/* Chiller To By Pass Valve */}
        <WaterPipe
          flowState={pumpState}
          flowDirection={true}
          speed={4 - GetValveSpeed()}
          startPoint={[235, 453]}
          endPoint={[650, 453]}
        />

        {/* By Pass Valve To Return */}
        <WaterPipe
          flowState={pumpState}
          flowDirection={true}
          speed={3}
          startPoint={[650, 453]}
          endPoint={[1347, 453]}
        />

        {/* Through By Pass Valve */}
        <WaterPipe
          flowState={pumpState && valveState > 0}
          flowDirection={true}
          speed={GetValveSpeed()}
          startPoint={[650, 602]}
          endPoint={[650, 453]}
        />

        {/* Visualize Comp Wind */}
        {compState && (
            <>
                <WindArrow 
                    flowState={true}
                    speed={3}
                    startPoint={[1613, 344]}
                    endPoint={[1620, 304]}
                />
                <WindArrow 
                    flowState={true}
                    speed={3}
                    startPoint={[1628, 344]}
                    endPoint={[1628, 304]}
                />
                <WindArrow 
                    flowState={true}
                    speed={3}
                    startPoint={[1643, 344]}
                    endPoint={[1636, 304]}
                />

                <WindArrow 
                    flowState={true}
                    speed={3}
                    startPoint={[1794, 344]}
                    endPoint={[1801, 304]}
                />
                <WindArrow 
                    flowState={true}
                    speed={3}
                    startPoint={[1809, 344]}
                    endPoint={[1809, 304]}
                />
                <WindArrow 
                    flowState={true}
                    speed={3}
                    startPoint={[1824, 344]}
                    endPoint={[1817, 304]}
                />
            </>
        )}

      </svg>
    </div>
  );
};

export default VisualGraph;