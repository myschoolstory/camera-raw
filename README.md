# Raw Image Editor - Professional Photo Enhancement

A browser-based dedicated workspace for editing and enhancing raw image files from digital cameras, offering extensive control over exposure, color, and detail adjustments.

## Features

### Core Image Processing
- **Exposure Controls**: Exposure compensation, highlights recovery, shadows lift, whites/blacks adjustment, contrast
- **Color Correction**: Temperature and tint adjustment, vibrance and saturation controls, HSL adjustments
- **Detail Enhancement**: Clarity/structure adjustment, texture enhancement, dehaze, sharpening, noise reduction
- **Real-time Preview**: Immediate feedback on all adjustments
- **Non-destructive Editing**: All adjustments applied as layers without modifying original image

### User Interface
- **Professional Dark Theme**: Reduces eye strain during long editing sessions
- **Three-Panel Layout**: File management, image canvas, and adjustment controls
- **Responsive Design**: Works on desktop and tablet devices
- **Histogram Display**: Real-time RGB and luminance histogram
- **Before/After Comparison**: Toggle between original and edited versions
- **Zoom Controls**: Zoom in/out and fit-to-screen functionality

### Supported Operations
- Load image files (JPEG, PNG, TIFF, BMP, WebP)
- Drag & drop file upload
- Real-time adjustment previews
- Export processed images in high quality
- Reset all adjustments
- Undo/redo functionality

## Installation & Setup

### Prerequisites
- Node.js 18+ and pnpm package manager
- Modern web browser with HTML5 Canvas support

### Installation Steps

1. **Extract the archive:**
   ```bash
   tar -xzf raw-image-editor.tar.gz
   cd raw-image-editor
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Start the development server:**
   ```bash
   pnpm run dev
   ```

4. **Open in browser:**
   Navigate to `http://localhost:5173` (or the port shown in terminal)

### Production Build

To create a production build for deployment:

```bash
pnpm run build
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

## Usage Guide

### Loading Images
1. **Sample Image**: Click "Load Sample Image" to try the editor with a demo photo
2. **Upload File**: Drag & drop an image file or click "Choose File" to browse
3. **Supported Formats**: JPEG, PNG, TIFF, BMP, WebP

### Making Adjustments

#### Basic Adjustments
- **Exposure**: Overall brightness (-5 to +5 EV)
- **Highlights**: Recover blown highlights
- **Shadows**: Lift dark areas
- **Whites**: Adjust white point
- **Blacks**: Adjust black point
- **Contrast**: Overall contrast adjustment

#### Color Adjustments
- **Temperature**: Warm/cool color balance
- **Tint**: Green/magenta color balance
- **Vibrance**: Selective saturation boost
- **Saturation**: Overall color intensity

#### Detail Adjustments
- **Clarity**: Mid-tone contrast enhancement
- **Texture**: Surface detail enhancement
- **Dehaze**: Atmospheric haze removal
- **Sharpening**: Edge definition (0-100%)
- **Noise Reduction**: Luminance noise reduction (0-100%)

### Interface Controls
- **Zoom**: Use +/- buttons or mouse wheel to zoom
- **Show Original**: Toggle to compare with original image
- **Export**: Download the edited image as JPEG
- **Reset**: Clear all adjustments and return to original
- **Histogram**: Monitor tonal distribution in real-time

## Technical Architecture

### Frontend Technologies
- **React 18**: Modern component-based UI framework
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: High-quality UI component library
- **HTML5 Canvas**: Hardware-accelerated image processing
- **Vite**: Fast build tool and development server

### Image Processing Pipeline
1. **File Reading**: Browser File API for local file access
2. **Canvas Rendering**: HTML5 Canvas for image manipulation
3. **Real-time Processing**: Immediate preview of all adjustments
4. **Non-destructive Workflow**: Original image data preserved
5. **Export Pipeline**: High-quality JPEG output

### Performance Features
- **Efficient Algorithms**: Optimized image processing functions
- **Real-time Updates**: Smooth adjustment previews
- **Memory Management**: Proper cleanup of image data
- **Responsive UI**: Smooth interactions and animations

## Browser Compatibility

- **Chrome/Chromium**: Full support
- **Firefox**: Full support
- **Safari**: Full support
- **Edge**: Full support

Requires modern browser with HTML5 Canvas and File API support.

## Development

### Project Structure
```
raw-image-editor/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── AdjustmentPanel.jsx
│   │   ├── ImageCanvas.jsx
│   │   ├── FileUpload.jsx
│   │   └── Histogram.jsx
│   ├── lib/                # Utility libraries
│   │   └── imageProcessor.js
│   ├── App.jsx             # Main application component
│   ├── App.css             # Application styles
│   └── main.jsx            # Entry point
├── public/                 # Static assets
├── package.json            # Dependencies and scripts
└── vite.config.js          # Build configuration
```

### Key Components
- **ImageProcessor**: Core image manipulation engine
- **AdjustmentPanel**: Professional adjustment controls
- **ImageCanvas**: Image display and interaction
- **Histogram**: Real-time histogram visualization
- **FileUpload**: Drag & drop file handling

## License

This project is provided as-is for educational and professional use.

## Support

For technical support or feature requests, please refer to the project documentation or contact the development team.

---

**Raw Image Editor** - Professional photo enhancement in your browser.

