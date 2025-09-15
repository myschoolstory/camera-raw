import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, FileImage, X } from 'lucide-react';

const FileUpload = ({ onFileSelect, currentFile, onClearFile }) => {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.tiff', '.tif', '.bmp', '.webp']
    },
    multiple: false
  });

  if (currentFile) {
    return (
      <Card className="bg-gray-900 border-gray-700">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileImage className="h-5 w-5 text-blue-400" />
              <div>
                <p className="text-sm font-medium text-gray-200">
                  {typeof currentFile === 'string' ? 'Sample Image' : currentFile.name}
                </p>
                <p className="text-xs text-gray-400">
                  {typeof currentFile === 'string' 
                    ? 'Ready for editing' 
                    : `${(currentFile.size / 1024 / 1024).toFixed(2)} MB`
                  }
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFile}
              className="text-gray-400 hover:text-gray-200"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardContent className="p-6">
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${isDragActive 
              ? 'border-blue-400 bg-blue-400/10' 
              : 'border-gray-600 hover:border-gray-500'
            }
          `}
        >
          <input {...getInputProps()} />
          <Upload className={`h-12 w-12 mx-auto mb-4 ${isDragActive ? 'text-blue-400' : 'text-gray-400'}`} />
          
          {isDragActive ? (
            <div>
              <p className="text-lg font-medium text-blue-400 mb-2">Drop your image here</p>
              <p className="text-sm text-gray-400">Release to upload</p>
            </div>
          ) : (
            <div>
              <p className="text-lg font-medium text-gray-200 mb-2">
                Drag & drop your image here
              </p>
              <p className="text-sm text-gray-400 mb-4">
                or click to browse files
              </p>
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                Choose File
              </Button>
            </div>
          )}
          
          <div className="mt-4 text-xs text-gray-500">
            Supports: JPEG, PNG, TIFF, BMP, WebP
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileUpload;

