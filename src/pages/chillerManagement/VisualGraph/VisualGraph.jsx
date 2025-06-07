import './VisualGraph.css';

import { useRef, useEffect, useState } from 'react';

import GraphIMG from '../../../assets/graph-image-rework.PNG';
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
        onClick={handleSvgClick}
      >
        {/* Entrance To Pump */}
        <WaterPipe
          flowState={pumpState}
          flowDirection={true}
          speed={3}
          startPoint={[1314, 461]}
          endPoint={[1259, 461]}
        />

        {/* Pump to By pass Valve */}
        <WaterPipe
          flowState={pumpState}
          flowDirection={true}
          speed={3}
          startPoint={[1077, 461]}
          endPoint={[603, 461 ]}
        />

        {/* By Pass Valve To Chiller */}
        <WaterPipe
          flowState={pumpState}
          flowDirection={true}
          speed={4 - GetValveSpeed()}
          startPoint={[603, 461]}
          endPoint={[251, 461]}
        />

        {/* Chiller To By Pass Valve */}
        <WaterPipe
          flowState={pumpState}
          flowDirection={true}
          speed={4 - GetValveSpeed()}
          startPoint={[251, 617]}
          endPoint={[605, 617]}
          color={'#ff6b00'}
        />

        {/* By Pass Valve To Return */}
        <WaterPipe
          flowState={pumpState}
          flowDirection={true}
          speed={3}
          startPoint={[605, 617]}
          endPoint={[1314, 617]}
          color={'#ff8800'}
        />

        {/* Through By Pass Valve */}
        <WaterPipe
          flowState={pumpState && valveState > 0}
          flowDirection={true}
          speed={GetValveSpeed()}
          startPoint={[605, 461]}
          endPoint={[605, 617]}
        />

        {/* Visualize Comp Wind */}
        {compState && (
            <>
                <WindArrow 
                    flowState={true}
                    speed={3}
                    startPoint={[1593, 344]}
                    endPoint={[1600, 304]}
                />
                <WindArrow 
                    flowState={true}
                    speed={3}
                    startPoint={[1608, 344]}
                    endPoint={[1608, 304]}
                />
                <WindArrow 
                    flowState={true}
                    speed={3}
                    startPoint={[1623, 344]}
                    endPoint={[1616, 304]}
                />

                <WindArrow 
                    flowState={true}
                    speed={3}
                    startPoint={[1784, 344]}
                    endPoint={[1791, 304]}
                />
                <WindArrow 
                    flowState={true}
                    speed={3}
                    startPoint={[1799, 344]}
                    endPoint={[1799, 304]}
                />
                <WindArrow 
                    flowState={true}
                    speed={3}
                    startPoint={[1814, 344]}
                    endPoint={[1807, 304]}
                />
            </>
        )}

      </svg>
    </div>
  );
};

export default VisualGraph;