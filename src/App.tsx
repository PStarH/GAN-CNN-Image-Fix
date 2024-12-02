import { useState } from 'react'
import { ImageUpload } from './components/ImageUpload'
import { Header } from './components/Header'
import { ImageEditor } from './components/ImageEditor'
import { ResultView } from './components/ResultView'
import { AIProcessing } from './components/AIProcessing'

export type ImageData = {
  url: string
  file: File
}

function App() {
  const [imageData, setImageData] = useState<ImageData | null>(null)
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleImageUpload = (data: ImageData) => {
    setImageData(data)
    setProcessedImage(null)
  }

  const handleProcess = (processedImageUrl: string) => {
    setProcessedImage(processedImageUrl)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {!imageData ? (
          <ImageUpload onUpload={handleImageUpload} />
        ) : !processedImage ? (
          <ImageEditor 
            imageData={imageData} 
            onProcess={handleProcess}
          />
        ) : (
          <ResultView 
            originalImage={imageData.url} 
            processedImage={processedImage}
            onReset={() => {
              setImageData(null)
              setProcessedImage(null)
            }}
          />
        )}

        {isProcessing && <AIProcessing />}
      </main>
    </div>
  )
}

export default App