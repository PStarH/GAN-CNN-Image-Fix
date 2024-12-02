type ProcessingSettings = {
  [key: string]: number
}

export class ImageProcessor {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D

  constructor() {
    this.canvas = document.createElement('canvas')
    const ctx = this.canvas.getContext('2d')
    if (!ctx) throw new Error('Could not get 2D context')
    this.ctx = ctx
  }

  private async loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = url
    })
  }

  private enhanceResolution(settings: ProcessingSettings) {
    const { sharpness, detailEnhancement, noiseReduction } = settings
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
    const data = imageData.data

    // Apply noise reduction first
    this.applyNoiseReduction(data, noiseReduction / 100)

    // Apply sharpening
    this.applySharpen(data, this.canvas.width, sharpness / 100)

    // Enhance details
    this.enhanceDetails(data, detailEnhancement / 100)

    this.ctx.putImageData(imageData, 0, 0)
  }

  private restoreColors(settings: ProcessingSettings) {
    const { colorIntensity, saturation, balance } = settings
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
    const data = imageData.data

    // Apply color adjustments with more conservative values
    this.adjustColors(data, colorIntensity / 100, saturation / 100, balance / 100)

    this.ctx.putImageData(imageData, 0, 0)
  }

  private applyNoiseReduction(data: Uint8ClampedArray, strength: number) {
    const tempData = new Uint8ClampedArray(data)
    
    for (let i = 0; i < data.length; i += 4) {
      const neighborhood = this.getNeighborhoodAverage(tempData, i, this.canvas.width)
      
      // Apply selective noise reduction
      const variance = this.getLocalVariance(tempData, i, this.canvas.width)
      const smoothingFactor = Math.min(strength, strength * (30 / (variance + 30)))

      data[i] = tempData[i] * (1 - smoothingFactor) + neighborhood.r * smoothingFactor
      data[i + 1] = tempData[i + 1] * (1 - smoothingFactor) + neighborhood.g * smoothingFactor
      data[i + 2] = tempData[i + 2] * (1 - smoothingFactor) + neighborhood.b * smoothingFactor
    }
  }

  private applySharpen(data: Uint8ClampedArray, width: number, strength: number) {
    const kernel = [
      -1, -1, -1,
      -1,  9, -1,
      -1, -1, -1
    ]

    const tempData = new Uint8ClampedArray(data)
    for (let y = 1; y < this.canvas.height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = (y * width + x) * 4
        
        for (let c = 0; c < 3; c++) {
          let val = 0
          for (let ky = -1; ky <= 1; ky++) {
            for (let kx = -1; kx <= 1; kx++) {
              const kidx = ((y + ky) * width + (x + kx)) * 4
              val += tempData[kidx + c] * kernel[(ky + 1) * 3 + (kx + 1)]
            }
          }
          // Apply sharpening with the specified strength
          data[idx + c] = Math.max(0, Math.min(255,
            tempData[idx + c] * (1 - strength) + val * strength
          ))
        }
      }
    }
  }

  private enhanceDetails(data: Uint8ClampedArray, strength: number) {
    const tempData = new Uint8ClampedArray(data)
    
    for (let i = 0; i < data.length; i += 4) {
      const neighborhood = this.getNeighborhoodAverage(tempData, i, this.canvas.width)
      
      // Calculate local contrast
      for (let j = 0; j < 3; j++) {
        const detail = tempData[i + j] - neighborhood[['r', 'g', 'b'][j] as keyof typeof neighborhood]
        data[i + j] = Math.max(0, Math.min(255,
          tempData[i + j] + detail * strength
        ))
      }
    }
  }

  private adjustColors(data: Uint8ClampedArray, intensity: number, saturation: number, balance: number) {
    for (let i = 0; i < data.length; i += 4) {
      // Convert to HSL
      const [h, s, l] = this.rgbToHsl(data[i], data[i + 1], data[i + 2])

      // Adjust saturation (conservatively)
      const newSat = s * (1 + saturation * 0.5)
      
      // Adjust luminance based on color balance
      const balancedLum = l * (1 + (balance - 0.5) * 0.2)
      
      // Convert back to RGB with intensity adjustment
      const [r, g, b] = this.hslToRgb(h, Math.min(1, newSat), Math.min(1, balancedLum))
      
      // Apply changes with intensity control
      data[i] = Math.round(data[i] * (1 - intensity) + r * intensity)
      data[i + 1] = Math.round(data[i + 1] * (1 - intensity) + g * intensity)
      data[i + 2] = Math.round(data[i + 2] * (1 - intensity) + b * intensity)
    }
  }

  private getNeighborhoodAverage(data: Uint8ClampedArray, index: number, width: number) {
    const x = (index / 4) % width
    const y = Math.floor((index / 4) / width)
    let r = 0, g = 0, b = 0, count = 0

    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const idx = ((y + i) * width + (x + j)) * 4
        if (idx >= 0 && idx < data.length) {
          r += data[idx]
          g += data[idx + 1]
          b += data[idx + 2]
          count++
        }
      }
    }

    return {
      r: r / count,
      g: g / count,
      b: b / count
    }
  }

  private getLocalVariance(data: Uint8ClampedArray, index: number, width: number): number {
    const neighborhood = this.getNeighborhoodAverage(data, index, width)
    let variance = 0
    const x = (index / 4) % width
    const y = Math.floor((index / 4) / width)

    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const idx = ((y + i) * width + (x + j)) * 4
        if (idx >= 0 && idx < data.length) {
          variance += Math.pow(data[idx] - neighborhood.r, 2)
          variance += Math.pow(data[idx + 1] - neighborhood.g, 2)
          variance += Math.pow(data[idx + 2] - neighborhood.b, 2)
        }
      }
    }

    return Math.sqrt(variance / 27) // 9 pixels * 3 channels
  }

  private rgbToHsl(r: number, g: number, b: number): [number, number, number] {
    r /= 255
    g /= 255
    b /= 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0
    let s = 0
    const l = (max + min) / 2

    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0)
          break
        case g:
          h = (b - r) / d + 2
          break
        case b:
          h = (r - g) / d + 4
          break
      }
      
      h /= 6
    }

    return [h, s, l]
  }

  private hslToRgb(h: number, s: number, l: number): [number, number, number] {
    let r, g, b

    if (s === 0) {
      r = g = b = l
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1
        if (t > 1) t -= 1
        if (t < 1/6) return p + (q - p) * 6 * t
        if (t < 1/2) return q
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
        return p
      }

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q

      r = hue2rgb(p, q, h + 1/3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1/3)
    }

    return [
      Math.round(r * 255),
      Math.round(g * 255),
      Math.round(b * 255)
    ]
  }

  async processImage(
    imageUrl: string, 
    mode: 'resolution' | 'color',
    settings: ProcessingSettings
  ): Promise<string> {
    const img = await this.loadImage(imageUrl)
    
    // Set canvas size to 2x for resolution enhancement
    const scale = mode === 'resolution' ? 2 : 1
    this.canvas.width = img.width * scale
    this.canvas.height = img.height * scale
    
    // Use better quality scaling
    this.ctx.imageSmoothingEnabled = true
    this.ctx.imageSmoothingQuality = 'high'
    
    // Draw the image scaled up
    this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)

    if (mode === 'resolution') {
      this.enhanceResolution(settings)
    } else {
      this.restoreColors(settings)
    }

    return this.canvas.toDataURL('image/jpeg', 0.95)
  }
}