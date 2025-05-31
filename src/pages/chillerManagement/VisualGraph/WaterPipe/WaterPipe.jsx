import './WaterPipe.css';

function WaterPipe({
  flowState = false,
  flowDirection = true,
  speed = 1,
  startPoint,
  endPoint
}) {
  const [x1, y1] = startPoint;
  const [x2, y2] = endPoint;

  const dashLength = 10;
  const animationName = flowDirection ? 'pipe-flow-forward' : 'pipe-flow-reverse';

  const baseDuration = 4;
  const duration = `${baseDuration / (speed * speed)}s`;

  const animationStyle = flowState
    ? {
        animation: `${animationName} ${duration} linear infinite`
      }
    : {};

  return (
    <line
      className="water-pipe"
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      strokeDasharray={dashLength}
      strokeWidth="8"
      style={animationStyle}
    />
  );
}

export default WaterPipe;
