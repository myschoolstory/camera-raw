import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, RotateCcw } from 'lucide-react';

const AdjustmentGroup = ({ title, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full p-3 text-left hover:bg-gray-800 rounded-lg transition-colors">
        <span className="font-medium text-gray-200">{title}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </CollapsibleTrigger>
      <CollapsibleContent className="px-3 pb-3">
        <div className="space-y-4">
          {children}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

const SliderControl = ({ label, value, onChange, min = -100, max = 100, step = 1, unit = '' }) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm text-gray-300">{label}</label>
        <span className="text-xs text-gray-400 font-mono">
          {value > 0 ? '+' : ''}{value}{unit}
        </span>
      </div>
      <Slider
        value={[value]}
        onValueChange={(values) => onChange(values[0])}
        min={min}
        max={max}
        step={step}
        className="w-full"
      />
    </div>
  );
};

const AdjustmentPanel = ({ adjustments, onAdjustmentChange, onReset }) => {
  return (
    <Card className="w-80 bg-gray-900 border-gray-700 h-full overflow-y-auto">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-gray-100">Adjustments</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="text-gray-400 hover:text-gray-200"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-1">
        
        {/* Basic Adjustments */}
        <AdjustmentGroup title="Basic" defaultOpen={true}>
          <SliderControl
            label="Exposure"
            value={adjustments.exposure}
            onChange={(value) => onAdjustmentChange('exposure', value)}
            min={-5}
            max={5}
            step={0.1}
            unit=" EV"
          />
          <SliderControl
            label="Highlights"
            value={adjustments.highlights}
            onChange={(value) => onAdjustmentChange('highlights', value)}
          />
          <SliderControl
            label="Shadows"
            value={adjustments.shadows}
            onChange={(value) => onAdjustmentChange('shadows', value)}
          />
          <SliderControl
            label="Whites"
            value={adjustments.whites}
            onChange={(value) => onAdjustmentChange('whites', value)}
          />
          <SliderControl
            label="Blacks"
            value={adjustments.blacks}
            onChange={(value) => onAdjustmentChange('blacks', value)}
          />
          <SliderControl
            label="Contrast"
            value={adjustments.contrast}
            onChange={(value) => onAdjustmentChange('contrast', value)}
          />
        </AdjustmentGroup>

        {/* Color Adjustments */}
        <AdjustmentGroup title="Color" defaultOpen={false}>
          <SliderControl
            label="Temperature"
            value={adjustments.temperature}
            onChange={(value) => onAdjustmentChange('temperature', value)}
            min={-100}
            max={100}
            unit="K"
          />
          <SliderControl
            label="Tint"
            value={adjustments.tint}
            onChange={(value) => onAdjustmentChange('tint', value)}
          />
          <SliderControl
            label="Vibrance"
            value={adjustments.vibrance}
            onChange={(value) => onAdjustmentChange('vibrance', value)}
          />
          <SliderControl
            label="Saturation"
            value={adjustments.saturation}
            onChange={(value) => onAdjustmentChange('saturation', value)}
          />
        </AdjustmentGroup>

        {/* Detail Adjustments */}
        <AdjustmentGroup title="Detail" defaultOpen={false}>
          <SliderControl
            label="Clarity"
            value={adjustments.clarity}
            onChange={(value) => onAdjustmentChange('clarity', value)}
          />
          <SliderControl
            label="Texture"
            value={adjustments.texture}
            onChange={(value) => onAdjustmentChange('texture', value)}
          />
          <SliderControl
            label="Dehaze"
            value={adjustments.dehaze}
            onChange={(value) => onAdjustmentChange('dehaze', value)}
          />
          <SliderControl
            label="Sharpening"
            value={adjustments.sharpening}
            onChange={(value) => onAdjustmentChange('sharpening', value)}
            min={0}
            max={100}
          />
          <SliderControl
            label="Noise Reduction"
            value={adjustments.noiseReduction}
            onChange={(value) => onAdjustmentChange('noiseReduction', value)}
            min={0}
            max={100}
          />
        </AdjustmentGroup>

      </CardContent>
    </Card>
  );
};

export default AdjustmentPanel;

