// Image processing utilities for raw image editing

export class ImageProcessor {
  constructor(canvas, context) {
    this.canvas = canvas;
    this.ctx = context;
    this.originalImageData = null;
    this.currentImageData = null;
    this.adjustments = {
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
    };
  }

  loadImage(imageElement) {
    this.canvas.width = imageElement.naturalWidth;
    this.canvas.height = imageElement.naturalHeight;
    this.ctx.drawImage(imageElement, 0, 0);
    this.originalImageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    this.currentImageData = new ImageData(
      new Uint8ClampedArray(this.originalImageData.data),
      this.canvas.width,
      this.canvas.height
    );
    return this.originalImageData;
  }

  applyAdjustments() {
    if (!this.originalImageData) return;

    // Start with original image data
    this.currentImageData = new ImageData(
      new Uint8ClampedArray(this.originalImageData.data),
      this.canvas.width,
      this.canvas.height
    );

    // Apply adjustments in order
    this.applyExposure();
    this.applyHighlightsShadows();
    this.applyWhitesBlacks();
    this.applyContrast();
    this.applyTemperatureTint();
    this.applyVibranceSaturation();
    this.applyClarity();
    this.applySharpening();

    // Update canvas
    this.ctx.putImageData(this.currentImageData, 0, 0);
  }

  applyExposure() {
    const factor = Math.pow(2, this.adjustments.exposure);
    const data = this.currentImageData.data;

    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.min(255, data[i] * factor);     // Red
      data[i + 1] = Math.min(255, data[i + 1] * factor); // Green
      data[i + 2] = Math.min(255, data[i + 2] * factor); // Blue
    }
  }

  applyHighlightsShadows() {
    const data = this.currentImageData.data;
    const highlightFactor = 1 - (this.adjustments.highlights / 100);
    const shadowFactor = 1 + (this.adjustments.shadows / 100);

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Calculate luminance
      const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
      const normalizedLum = luminance / 255;

      // Apply highlights (affects bright areas more)
      if (normalizedLum > 0.5) {
        const highlightWeight = (normalizedLum - 0.5) * 2;
        data[i] = Math.max(0, Math.min(255, r * (1 - highlightWeight * (1 - highlightFactor))));
        data[i + 1] = Math.max(0, Math.min(255, g * (1 - highlightWeight * (1 - highlightFactor))));
        data[i + 2] = Math.max(0, Math.min(255, b * (1 - highlightWeight * (1 - highlightFactor))));
      }

      // Apply shadows (affects dark areas more)
      if (normalizedLum < 0.5) {
        const shadowWeight = (0.5 - normalizedLum) * 2;
        data[i] = Math.max(0, Math.min(255, r * (1 + shadowWeight * (shadowFactor - 1))));
        data[i + 1] = Math.max(0, Math.min(255, g * (1 + shadowWeight * (shadowFactor - 1))));
        data[i + 2] = Math.max(0, Math.min(255, b * (1 + shadowWeight * (shadowFactor - 1))));
      }
    }
  }

  applyWhitesBlacks() {
    const data = this.currentImageData.data;
    const whitesFactor = this.adjustments.whites / 100;
    const blacksFactor = this.adjustments.blacks / 100;

    for (let i = 0; i < data.length; i += 4) {
      // Apply whites adjustment (affects bright tones)
      data[i] = Math.max(0, Math.min(255, data[i] + (255 - data[i]) * whitesFactor));
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + (255 - data[i + 1]) * whitesFactor));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + (255 - data[i + 2]) * whitesFactor));

      // Apply blacks adjustment (affects dark tones)
      data[i] = Math.max(0, Math.min(255, data[i] + data[i] * blacksFactor));
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + data[i + 1] * blacksFactor));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + data[i + 2] * blacksFactor));
    }
  }

  applyContrast() {
    const factor = (259 * (this.adjustments.contrast + 255)) / (255 * (259 - this.adjustments.contrast));
    const data = this.currentImageData.data;

    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.max(0, Math.min(255, factor * (data[i] - 128) + 128));
      data[i + 1] = Math.max(0, Math.min(255, factor * (data[i + 1] - 128) + 128));
      data[i + 2] = Math.max(0, Math.min(255, factor * (data[i + 2] - 128) + 128));
    }
  }

  applyTemperatureTint() {
    const data = this.currentImageData.data;
    const tempFactor = this.adjustments.temperature / 100;
    const tintFactor = this.adjustments.tint / 100;

    for (let i = 0; i < data.length; i += 4) {
      // Temperature adjustment (blue/orange)
      if (tempFactor > 0) {
        // Warmer (more orange/red)
        data[i] = Math.min(255, data[i] * (1 + tempFactor * 0.3));
        data[i + 2] = Math.max(0, data[i + 2] * (1 - tempFactor * 0.3));
      } else {
        // Cooler (more blue)
        data[i] = Math.max(0, data[i] * (1 + tempFactor * 0.3));
        data[i + 2] = Math.min(255, data[i + 2] * (1 - tempFactor * 0.3));
      }

      // Tint adjustment (green/magenta)
      if (tintFactor > 0) {
        // More magenta
        data[i] = Math.min(255, data[i] * (1 + tintFactor * 0.2));
        data[i + 2] = Math.min(255, data[i + 2] * (1 + tintFactor * 0.2));
        data[i + 1] = Math.max(0, data[i + 1] * (1 - tintFactor * 0.2));
      } else {
        // More green
        data[i + 1] = Math.min(255, data[i + 1] * (1 - tintFactor * 0.2));
      }
    }
  }

  applyVibranceSaturation() {
    const data = this.currentImageData.data;
    const vibranceFactor = this.adjustments.vibrance / 100;
    const saturationFactor = this.adjustments.saturation / 100;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Convert to HSL for saturation adjustment
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const diff = max - min;
      const sum = max + min;
      const lightness = sum / 2;

      if (diff !== 0) {
        const saturation = lightness > 127.5 ? diff / (510 - sum) : diff / sum;
        
        // Apply vibrance (selective saturation)
        let vibranceAdjustment = vibranceFactor * (1 - saturation);
        
        // Apply saturation
        let totalSaturationAdjustment = saturationFactor + vibranceAdjustment;
        totalSaturationAdjustment = Math.max(-1, Math.min(1, totalSaturationAdjustment));

        const gray = 0.299 * r + 0.587 * g + 0.114 * b;
        
        data[i] = Math.max(0, Math.min(255, gray + (r - gray) * (1 + totalSaturationAdjustment)));
        data[i + 1] = Math.max(0, Math.min(255, gray + (g - gray) * (1 + totalSaturationAdjustment)));
        data[i + 2] = Math.max(0, Math.min(255, gray + (b - gray) * (1 + totalSaturationAdjustment)));
      }
    }
  }

  applyClarity() {
    if (this.adjustments.clarity === 0) return;

    const data = this.currentImageData.data;
    const width = this.canvas.width;
    const height = this.canvas.height;
    const clarityFactor = this.adjustments.clarity / 100;

    // Simple unsharp mask for clarity
    const tempData = new Uint8ClampedArray(data);

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = (y * width + x) * 4;
        
        for (let c = 0; c < 3; c++) {
          const center = tempData[idx + c];
          const surrounding = (
            tempData[((y - 1) * width + x) * 4 + c] +
            tempData[((y + 1) * width + x) * 4 + c] +
            tempData[(y * width + (x - 1)) * 4 + c] +
            tempData[(y * width + (x + 1)) * 4 + c]
          ) / 4;
          
          const difference = center - surrounding;
          data[idx + c] = Math.max(0, Math.min(255, center + difference * clarityFactor));
        }
      }
    }
  }

  applySharpening() {
    if (this.adjustments.sharpening === 0) return;

    const data = this.currentImageData.data;
    const width = this.canvas.width;
    const height = this.canvas.height;
    const sharpenFactor = this.adjustments.sharpening / 100;

    // Sharpening kernel
    const kernel = [
      0, -1, 0,
      -1, 5, -1,
      0, -1, 0
    ];

    const tempData = new Uint8ClampedArray(data);

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = (y * width + x) * 4;
        
        for (let c = 0; c < 3; c++) {
          let sum = 0;
          for (let ky = -1; ky <= 1; ky++) {
            for (let kx = -1; kx <= 1; kx++) {
              const kernelIdx = (ky + 1) * 3 + (kx + 1);
              const pixelIdx = ((y + ky) * width + (x + kx)) * 4 + c;
              sum += tempData[pixelIdx] * kernel[kernelIdx];
            }
          }
          
          const original = tempData[idx + c];
          const sharpened = Math.max(0, Math.min(255, sum));
          data[idx + c] = original + (sharpened - original) * sharpenFactor;
        }
      }
    }
  }

  updateAdjustment(key, value) {
    this.adjustments[key] = value;
    this.applyAdjustments();
  }

  resetAdjustments() {
    Object.keys(this.adjustments).forEach(key => {
      this.adjustments[key] = 0;
    });
    this.applyAdjustments();
  }

  getHistogram() {
    if (!this.currentImageData) return null;

    const data = this.currentImageData.data;
    const histogram = {
      red: new Array(256).fill(0),
      green: new Array(256).fill(0),
      blue: new Array(256).fill(0),
      luminance: new Array(256).fill(0)
    };

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const luminance = Math.round(0.299 * r + 0.587 * g + 0.114 * b);

      histogram.red[r]++;
      histogram.green[g]++;
      histogram.blue[b]++;
      histogram.luminance[luminance]++;
    }

    return histogram;
  }

  exportImage(format = 'image/jpeg', quality = 0.9) {
    return this.canvas.toDataURL(format, quality);
  }
}

