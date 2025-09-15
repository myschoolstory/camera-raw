import React, { useEffect, useRef } from 'react';

const Histogram = ({ histogramData, width = 256, height = 100 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!histogramData || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Find max value for scaling
    const maxRed = Math.max(...histogramData.red);
    const maxGreen = Math.max(...histogramData.green);
    const maxBlue = Math.max(...histogramData.blue);
    const maxLuminance = Math.max(...histogramData.luminance);
    const maxValue = Math.max(maxRed, maxGreen, maxBlue, maxLuminance);
    
    if (maxValue === 0) return;

    // Draw luminance histogram (white)
    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i < 256; i++) {
      const x = (i / 255) * width;
      const y = height - (histogramData.luminance[i] / maxValue) * height;
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();

    // Draw RGB histograms with blend mode
    ctx.globalCompositeOperation = 'screen';
    
    // Red channel
    ctx.strokeStyle = 'rgba(255, 0, 0, 0.7)';
    ctx.beginPath();
    for (let i = 0; i < 256; i++) {
      const x = (i / 255) * width;
      const y = height - (histogramData.red[i] / maxValue) * height;
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();

    // Green channel
    ctx.strokeStyle = 'rgba(0, 255, 0, 0.7)';
    ctx.beginPath();
    for (let i = 0; i < 256; i++) {
      const x = (i / 255) * width;
      const y = height - (histogramData.green[i] / maxValue) * height;
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();

    // Blue channel
    ctx.strokeStyle = 'rgba(0, 0, 255, 0.7)';
    ctx.beginPath();
    for (let i = 0; i < 256; i++) {
      const x = (i / 255) * width;
      const y = height - (histogramData.blue[i] / maxValue) * height;
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();

  }, [histogramData, width, height]);

  return (
    <div className="bg-gray-900 p-2 rounded-lg">
      <div className="text-xs text-gray-400 mb-1">Histogram</div>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="w-full h-auto border border-gray-700 rounded"
        style={{ maxWidth: '100%' }}
      />
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>0</span>
        <span>128</span>
        <span>255</span>
      </div>
    </div>
  );
};

export default Histogram;

