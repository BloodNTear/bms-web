import './WindArrow.css';
import {v4 as uuidv4} from 'uuid';

function WindArrow({ flowState = false, speed = 1, startPoint, endPoint }) {
  
  const gradientId = uuidv4();
  
  const [x1, y1] = startPoint;
  const [x2, y2] = endPoint;

  const baseDuration = 3;
  const duration = `${baseDuration / (speed * speed)}s`;

  const animationStyle = flowState
    ? {
        animation: `wind-arrow-flow ${duration} linear infinite`
      }
    : {
        animationPlayState: 'paused'
      };

  return (
    <svg
      viewBox="0 0 2000 750"
      width="2000"
      height="750"
      style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
    >
      <defs>
        <linearGradient id={gradientId} gradientUnits="userSpaceOnUse" x1={x1} y1={y1} x2={x2} y2={y2}>
          <stop offset="0%" stopColor="#a0d8ef" stopOpacity="0.6" />
          <stop offset="50%" stopColor="#00bfff" stopOpacity="1" />
          <stop offset="100%" stopColor="#a0d8ef" stopOpacity="0.6" />
        </linearGradient>
      </defs>

      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={`url(#${gradientId})`}
        strokeWidth="4"
        fill="none"
        strokeDasharray="6 4"
        style={animationStyle}
      />
    </svg>
  );
}

export default WindArrow;
