import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RotateCcw, Download, Eye, EyeOff } from 'lucide-react';
import { ImageProcessor } from '../lib/imageProcessor';

const ImageCanvas = ({ 
  imageFile, 
  adjustments, 
  onHistogramUpdate,
  onImageProcessorReady 
}) => {
  const canvasRef = useRef(null);
  const originalCanvasRef = useRef(null);
  const imageProcessorRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [showOriginal, setShowOriginal] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  // Initialize image processor
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      imageProcessorRef.current = new ImageProcessor(canvas, ctx);
      
      if (onImageProcessorReady) {
        onImageProcessorReady(imageProcessorRef.current);
      }
    }
  }, [onImageProcessorReady]);

  // Load image when file changes
  useEffect(() => {
    if (imageFile && imageProcessorRef.current) {
      const img = new Image();
      img.onload = () => {
        // Calculate canvas size to fit container while maintaining aspect ratio
        const containerWidth = 800; // Max width
        const containerHeight = 600; // Max height
        const aspectRatio = img.naturalWidth / img.naturalHeight;
        
        let displayWidth, displayHeight;
        if (aspectRatio > containerWidth / containerHeight) {
          displayWidth = Math.min(containerWidth, img.naturalWidth);
          displayHeight = displayWidth / aspectRatio;
        } else {
          displayHeight = Math.min(containerHeight, img.naturalHeight);
          displayWidth = displayHeight * aspectRatio;
        }

        setCanvasSize({ width: displayWidth, height: displayHeight });
        
        // Set up canvases
        const canvas = canvasRef.current;
        const originalCanvas = originalCanvasRef.current;
        
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        originalCanvas.width = img.naturalWidth;
        originalCanvas.height = img.naturalHeight;
        
        // Draw original image to original canvas
        const originalCtx = originalCanvas.getContext('2d');
        originalCtx.drawImage(img, 0, 0);
        
        // Load image into processor
        imageProcessorRef.current.loadImage(img);
        
        // Update histogram
        if (onHistogramUpdate) {
          const histogram = imageProcessorRef.current.getHistogram();
          onHistogramUpdate(histogram);
        }
      };
      
      if (typeof imageFile === 'string') {
        img.src = imageFile;
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
          img.src = e.target.result;
        };
        reader.readAsDataURL(imageFile);
      }
    }
  }, [imageFile, onHistogramUpdate]);

  // Apply adjustments when they change
  useEffect(() => {
    if (imageProcessorRef.current && imageFile) {
      // Update all adjustments
      Object.keys(adjustments).forEach(key => {
        imageProcessorRef.current.adjustments[key] = adjustments[key];
      });
      
      // Apply adjustments
      imageProcessorRef.current.applyAdjustments();
      
      // Update histogram
      if (onHistogramUpdate) {
        const histogram = imageProcessorRef.current.getHistogram();
        onHistogramUpdate(histogram);
      }
    }
  }, [adjustments, imageFile, onHistogramUpdate]);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.2, 5));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev / 1.2, 0.1));
  };

  const handleResetZoom = () => {
    setZoom(1);
  };

  const handleDownload = () => {
    if (imageProcessorRef.current) {
      const dataURL = imageProcessorRef.current.exportImage('image/jpeg', 0.95);
      const link = document.createElement('a');
      link.download = 'edited-image.jpg';
      link.href = dataURL;
      link.click();
    }
  };

  const toggleOriginal = () => {
    setShowOriginal(!showOriginal);
  };

  if (!imageFile) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-800 rounded-lg">
        <div className="text-center text-gray-400">
          <div className="text-6xl mb-4">📷</div>
          <p className="text-lg">No image loaded</p>
          <p className="text-sm">Upload an image to start editing</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-800 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 bg-gray-900 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={handleZoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm text-gray-300 font-mono min-w-[60px] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <Button variant="ghost" size="sm" onClick={handleZoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleResetZoom}>
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant={showOriginal ? "default" : "ghost"} 
            size="sm" 
            onClick={toggleOriginal}
          >
            {showOriginal ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showOriginal ? 'Hide Original' : 'Show Original'}
          </Button>
          <Button variant="ghost" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Canvas Container */}
      <div className="flex-1 overflow-auto bg-gray-700 relative">
        <div 
          className="flex items-center justify-center min-h-full p-4"
          style={{ 
            transform: `scale(${zoom})`,
            transformOrigin: 'center center',
            transition: 'transform 0.2s ease-out'
          }}
        >
          <div className="relative">
            {/* Main canvas */}
            <canvas
              ref={canvasRef}
              style={{
                width: canvasSize.width,
                height: canvasSize.height,
                display: showOriginal ? 'none' : 'block'
              }}
              className="border border-gray-600 rounded shadow-lg bg-white"
            />
            
            {/* Original canvas */}
            <canvas
              ref={originalCanvasRef}
              style={{
                width: canvasSize.width,
                height: canvasSize.height,
                display: showOriginal ? 'block' : 'none'
              }}
              className="border border-gray-600 rounded shadow-lg bg-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCanvas;

