import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload } from 'lucide-react'
import type { ImageData } from '../App'

interface ImageUploadProps {
  onUpload: (data: ImageData) => void
}

export function ImageUpload({ onUpload }: ImageUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      const url = URL.createObjectURL(file)
      onUpload({ file, url })
    }
  }, [onUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    multiple: false
  })

  return (
    <div className="max-w-2xl mx-auto">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-12
          flex flex-col items-center justify-center
          cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
        `}
      >
        <input {...getInputProps()} />
        <Upload className="w-12 h-12 text-gray-400 mb-4" />
        <p className="text-lg font-medium text-gray-900">
          {isDragActive ? 'Drop the image here' : 'Drag & drop an image here'}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          or click to select a file
        </p>
        <p className="text-xs text-gray-400 mt-4">
          Supports PNG, JPG, JPEG, WEBP
        </p>
      </div>
    </div>
  )
}