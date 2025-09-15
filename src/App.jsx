import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Camera, Settings, BarChart3 } from 'lucide-react';
import FileUpload from './components/FileUpload';
import ImageCanvas from './components/ImageCanvas';
import AdjustmentPanel from './components/AdjustmentPanel';
import Histogram from './components/Histogram';
import './App.css';

// Sample image for demonstration
const SAMPLE_IMAGE = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80';

function App() {
  const [currentFile, setCurrentFile] = useState(null);
  const [histogramData, setHistogramData] = useState(null);
  const [imageProcessor, setImageProcessor] = useState(null);
  const [adjustments, setAdjustments] = useState({
    exposure: 0,
    highlights: 0,
    shadows: 0,
    whites: 0,
    blacks: 0,
    contrast: 0,
    temperature: 0,
    tint: 0,
    vibrance: 0,
    saturation: 0,
    clarity: 0,
    texture: 0,
    dehaze: 0,
    sharpening: 0,
    noiseReduction: 0
  });

  const handleFileSelect = useCallback((file) => {
    setCurrentFile(file);
  }, []);

  const handleClearFile = useCallback(() => {
    setCurrentFile(null);
    setHistogramData(null);
    // Reset adjustments
    setAdjustments({
      exposure: 0,
      highlights: 0,
      shadows: 0,
      whites: 0,
      blacks: 0,
      contrast: 0,
      temperature: 0,
      tint: 0,
      vibrance: 0,
      saturation: 0,
      clarity: 0,
      texture: 0,
      dehaze: 0,
      sharpening: 0,
      noiseReduction: 0
    });
  }, []);

  const handleAdjustmentChange = useCallback((key, value) => {
    setAdjustments(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const handleResetAdjustments = useCallback(() => {
    setAdjustments({
      exposure: 0,
      highlights: 0,
      shadows: 0,
      whites: 0,
      blacks: 0,
      contrast: 0,
      temperature: 0,
      tint: 0,
      vibrance: 0,
      saturation: 0,
      clarity: 0,
      texture: 0,
      dehaze: 0,
      sharpening: 0,
      noiseReduction: 0
    });
  }, []);

  const handleHistogramUpdate = useCallback((histogram) => {
    setHistogramData(histogram);
  }, []);

  const handleImageProcessorReady = useCallback((processor) => {
    setImageProcessor(processor);
  }, []);

  const loadSampleImage = () => {
    setCurrentFile(SAMPLE_IMAGE);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Camera className="h-8 w-8 text-blue-400" />
            <div>
              <h1 className="text-xl font-bold text-gray-100">Raw Image Editor</h1>
              <p className="text-sm text-gray-400">Professional Photo Enhancement</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {!currentFile && (
              <Button 
                variant="outline" 
                onClick={loadSampleImage}
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Load Sample Image
              </Button>
            )}
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Settings className="h-4 w-4" />
              <span>Professional Tools</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Panel - File Upload */}
        <div className="w-80 bg-gray-900 border-r border-gray-800 p-4 flex flex-col">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-100 mb-3 flex items-center">
              <Camera className="h-5 w-5 mr-2" />
              Image Source
            </h2>
            <FileUpload
              onFileSelect={handleFileSelect}
              currentFile={currentFile}
              onClearFile={handleClearFile}
            />
          </div>

          {/* Histogram */}
          {histogramData && (
            <div className="mb-4">
              <h3 className="text-md font-medium text-gray-100 mb-3 flex items-center">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analysis
              </h3>
              <Histogram histogramData={histogramData} />
            </div>
          )}

          {/* Image Info */}
          {currentFile && (
            <Card className="bg-gray-800 border-gray-700 mt-auto">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-300">Image Info</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-gray-400 space-y-1">
                <div className="flex justify-between">
                  <span>Format:</span>
                  <span>
                    {typeof currentFile === 'string' ? 'JPEG' : currentFile.type?.split('/')[1]?.toUpperCase() || 'Unknown'}
                  </span>
                </div>
                {typeof currentFile !== 'string' && (
                  <div className="flex justify-between">
                    <span>Size:</span>
                    <span>{(currentFile.size / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="text-green-400">Ready</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Center Panel - Image Canvas */}
        <div className="flex-1 p-4">
          <ImageCanvas
            imageFile={currentFile}
            adjustments={adjustments}
            onHistogramUpdate={handleHistogramUpdate}
            onImageProcessorReady={handleImageProcessorReady}
          />
        </div>

        {/* Right Panel - Adjustments */}
        <div className="w-80 bg-gray-900 border-l border-gray-800 p-4">
          <AdjustmentPanel
            adjustments={adjustments}
            onAdjustmentChange={handleAdjustmentChange}
            onReset={handleResetAdjustments}
          />
        </div>
      </div>
    </div>
  );
}

export default App;

