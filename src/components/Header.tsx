import { Image as ImageIcon } from 'lucide-react'

export function Header() {
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 h-16 flex items-center">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-6 h-6 text-blue-600" />
          <h1 className="text-xl font-semibold">ImageMend</h1>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <span className="text-sm text-gray-500">AI-Powered Image Restoration</span>
        </div>
      </div>
    </header>
  )
}