import Spline from '@splinetool/react-spline';

export default function SplineBackground() {
  return (
    <div className="fixed inset-0 z-0">
      <Spline 
        scene="https://prod.spline.design/your-scene-id/scene.splinecode"
        className="w-full h-full"
      />
    </div>
  );
}