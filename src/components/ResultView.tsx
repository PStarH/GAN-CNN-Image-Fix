import { RefreshCcw, Download, Workflow } from 'lucide-react'

interface ResultViewProps {
  originalImage: string
  processedImage: string
  onReset: () => void
}

export function ResultView({ originalImage, processedImage, onReset }: ResultViewProps) {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Side by Side View */}
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="aspect-[3/2] relative rounded-lg overflow-hidden bg-gray-100 shadow-lg">
            <img 
              src={originalImage} 
              alt="Original" 
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
              Before
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="aspect-[3/2] relative rounded-lg overflow-hidden bg-gray-100 shadow-lg">
            <img 
              src={processedImage} 
              alt="Processed" 
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
              After
            </div>
          </div>
        </div>
      </div>

      {/* Process Visualization */}
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <Workflow className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-medium">AI Processing Visualization</h3>
        </div>

        <div className="grid grid-cols-4 gap-6">
          {/* Original */}
          <div className="space-y-3">
            <div className="aspect-square relative rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200">
              <img 
                src={originalImage} 
                alt="Original" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center">
              <h4 className="font-medium text-gray-900">Original Image</h4>
              <p className="text-sm text-gray-500 mt-1">Input photo</p>
            </div>
          </div>

          {/* GAN Process */}
          <div className="space-y-3">
            <div className="aspect-square relative rounded-lg overflow-hidden bg-gray-100 border-2 border-blue-200">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20" />
              <img 
                src={processedImage} 
                alt="GAN Process" 
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/90 px-3 py-1 rounded-full text-xs font-medium text-blue-600">
                  GAN Processing
                </div>
              </div>
            </div>
            <div className="text-center">
              <h4 className="font-medium text-gray-900">GAN Enhancement</h4>
              <p className="text-sm text-gray-500 mt-1">
                Generates realistic textures and details
              </p>
            </div>
          </div>

          {/* CNN Process */}
          <div className="space-y-3">
            <div className="aspect-square relative rounded-lg overflow-hidden bg-gray-100 border-2 border-green-200">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-teal-500/20" />
              <img 
                src={processedImage} 
                alt="CNN Process" 
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/90 px-3 py-1 rounded-full text-xs font-medium text-green-600">
                  CNN Processing
                </div>
              </div>
            </div>
            <div className="text-center">
              <h4 className="font-medium text-gray-900">CNN Refinement</h4>
              <p className="text-sm text-gray-500 mt-1">
                Enhances details and removes artifacts
              </p>
            </div>
          </div>

          {/* Final Result */}
          <div className="space-y-3">
            <div className="aspect-square relative rounded-lg overflow-hidden bg-gray-100 border-2 border-indigo-200">
              <img 
                src={processedImage} 
                alt="Final Result" 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2">
                <div className="bg-indigo-600 px-2 py-1 rounded text-xs font-medium text-white">
                  Final
                </div>
              </div>
            </div>
            <div className="text-center">
              <h4 className="font-medium text-gray-900">Final Result</h4>
              <p className="text-sm text-gray-500 mt-1">
                Combined AI enhancements
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mt-6">
          <h4 className="font-medium text-gray-900 mb-2">How it works:</h4>
          <ol className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="font-medium text-blue-600">1.</span>
              GAN (Generative Adversarial Network) analyzes the image and generates new realistic details and textures
            </li>
            <li className="flex items-start gap-2">
              <span className="font-medium text-green-600">2.</span>
              CNN (Convolutional Neural Network) processes the enhanced image to sharpen details and remove any artifacts
            </li>
            <li className="flex items-start gap-2">
              <span className="font-medium text-indigo-600">3.</span>
              The final result combines both processes for optimal image quality
            </li>
          </ol>
        </div>
      </div>

      <div className="flex gap-4 justify-center">
        <button
          onClick={onReset}
          className="px-4 py-2 rounded-lg border border-gray-300 
            hover:bg-gray-50 flex items-center gap-2"
        >
          <RefreshCcw className="w-4 h-4" />
          Process Another Image
        </button>

        <button
          onClick={() => {
            const link = document.createElement('a')
            link.href = processedImage
            link.download = 'restored-image.png'
            link.click()
          }}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white
            hover:bg-blue-700 flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Download Result
        </button>
      </div>
    </div>
  )
}