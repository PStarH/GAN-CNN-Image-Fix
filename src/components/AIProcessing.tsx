import { Loader } from 'lucide-react'

export function AIProcessing() {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex flex-col items-center text-center">
          <Loader className="w-8 h-8 text-blue-600 animate-spin" />
          <h3 className="text-lg font-medium mt-4">Processing Image with AI</h3>
          <p className="text-sm text-gray-500 mt-2">
            Our AI models are analyzing and enhancing your image. This might take a few moments...
          </p>
          
          <div className="w-full mt-6">
            <div className="h-2 bg-gray-100 rounded-full">
              <div className="h-full bg-blue-600 rounded-full w-1/2 animate-pulse" />
            </div>
          </div>
          
          <div className="mt-4 text-xs text-gray-400">
            Running GAN and CNN models for optimal results
          </div>
        </div>
      </div>
    </div>
  )
}