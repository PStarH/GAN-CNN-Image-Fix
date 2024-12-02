import { useState } from 'react'
import { Sparkles, Brain, Info } from 'lucide-react'
import type { ImageData } from '../App'
import { ImageProcessor } from '../utils/ImageProcessor'

interface ImageEditorProps {
  imageData: ImageData
  onProcess: (processedImageUrl: string) => void
}

type ProcessingMode = 'resolution' | 'color'

interface ModeSettings {
  name: string
  description: string
  settings: {
    [key: string]: {
      min: number
      max: number
      default: number
      step: number
      label: string
    }
  }
}

const MODE_SETTINGS: Record<ProcessingMode, ModeSettings> = {
  resolution: {
    name: 'Resolution Enhancement',
    description: 'Improve image clarity and sharpness without affecting colors. Best for upscaling and detail enhancement.',
    settings: {
      sharpness: {
        min: 0,
        max: 100,
        default: 60,
        step: 1,
        label: 'Sharpness Level'
      },
      detailEnhancement: {
        min: 0,
        max: 100,
        default: 70,
        step: 1,
        label: 'Detail Enhancement'
      },
      noiseReduction: {
        min: 0,
        max: 100,
        default: 50,
        step: 1,
        label: 'Noise Reduction'
      }
    }
  },
  color: {
    name: 'Color Restoration',
    description: 'Restore and enhance faded colors while preserving the original image details.',
    settings: {
      colorIntensity: {
        min: 0,
        max: 100,
        default: 50,
        step: 1,
        label: 'Color Intensity'
      },
      saturation: {
        min: 0,
        max: 100,
        default: 40,
        step: 1,
        label: 'Saturation'
      },
      balance: {
        min: 0,
        max: 100,
        default: 50,
        step: 1,
        label: 'Color Balance'
      }
    }
  }
}

export function ImageEditor({ imageData, onProcess }: ImageEditorProps) {
  const [mode, setMode] = useState<ProcessingMode>('resolution')
  const [settings, setSettings] = useState<Record<string, number>>(() => {
    const initSettings: Record<string, number> = {}
    Object.entries(MODE_SETTINGS[mode].settings).forEach(([key, setting]) => {
      initSettings[key] = setting.default
    })
    return initSettings
  })
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSettingChange = (key: string, value: number) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleProcess = async () => {
    setIsProcessing(true)
    try {
      const processor = new ImageProcessor()
      const processedImageUrl = await processor.processImage(imageData.url, mode, settings)
      onProcess(processedImageUrl)
    } catch (error) {
      console.error('Processing failed:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-[2fr,1fr] gap-8">
        <div className="space-y-4">
          <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
            <img 
              src={imageData.url} 
              alt="Original" 
              className="w-full h-full object-contain"
            />
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <Brain className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-blue-900">{MODE_SETTINGS[mode].name}</h3>
                <p className="text-sm text-blue-700 mt-1">
                  {MODE_SETTINGS[mode].description}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium mb-4">Processing Mode</h2>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(MODE_SETTINGS) as ProcessingMode[]).map((processingMode) => (
                    <button
                      key={processingMode}
                      onClick={() => {
                        setMode(processingMode)
                        const newSettings: Record<string, number> = {}
                        Object.entries(MODE_SETTINGS[processingMode].settings).forEach(([key, setting]) => {
                          newSettings[key] = setting.default
                        })
                        setSettings(newSettings)
                      }}
                      className={`
                        px-4 py-3 text-sm rounded-md transition-colors
                        ${mode === processingMode 
                          ? 'bg-blue-100 text-blue-700 font-medium border-2 border-blue-200' 
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-2 border-transparent'}
                      `}
                    >
                      <div className="text-center">
                        <div className="font-medium mb-1">
                          {MODE_SETTINGS[processingMode].name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {processingMode === 'resolution' 
                            ? 'Enhance clarity & details' 
                            : 'Restore faded colors'}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  Processing Settings
                  <Info className="w-4 h-4 text-gray-400" />
                </h3>
                
                {Object.entries(MODE_SETTINGS[mode].settings).map(([key, setting]) => (
                  <div key={key} className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-sm text-gray-600">{setting.label}</label>
                      <span className="text-sm text-gray-500">{settings[key]}%</span>
                    </div>
                    <input
                      type="range"
                      min={setting.min}
                      max={setting.max}
                      step={setting.step}
                      value={settings[key]}
                      onChange={(e) => handleSettingChange(key, Number(e.target.value))}
                      className="w-full accent-blue-600"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleProcess}
              disabled={isProcessing}
              className={`
                flex-1 px-4 py-2 rounded-lg
                flex items-center justify-center gap-2
                transition-colors
                ${isProcessing
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'}
                text-white
              `}
            >
              <Sparkles className="w-4 h-4" />
              {isProcessing ? 'Processing...' : 'Enhance Image'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}