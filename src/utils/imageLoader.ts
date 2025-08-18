import type { ContractImage } from '@/types/pdf'

const IMAGE_CACHE = new Map<string, string>()

/**
 * Convert an image path to base64 data URL
 */
export async function toDataURL(path: string): Promise<string> {
  // Check cache first
  if (IMAGE_CACHE.has(path)) {
    return IMAGE_CACHE.get(path)!
  }

  return new Promise((resolve, reject) => {
    const img = new Image()
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    img.crossOrigin = 'anonymous'
    
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      
      if (ctx) {
        ctx.drawImage(img, 0, 0)
        const dataURL = canvas.toDataURL('image/png')
        
        // Cache the result
        IMAGE_CACHE.set(path, dataURL)
        resolve(dataURL)
      } else {
        reject(new Error('Unable to get canvas context'))
      }
    }

    img.onerror = () => {
      reject(new Error(`Failed to load image: ${path}`))
    }

    // Use the root path - images are in the project root
    img.src = `/${path.replace(/^.*\//, '')}`
  })
}

/**
 * Preload all contract page images
 */
export async function loadContractPages(): Promise<ContractImage[]> {
  const pages: ContractImage[] = []
  
  for (let i = 1; i <= 6; i++) {
    try {
      const imagePath = `mih2026_page-${i}.png`
      const dataUrl = await toDataURL(imagePath)
      
      pages.push({
        page: i,
        dataUrl,
        width: 595, // A4 width in points
        height: 842 // A4 height in points
      })
    } catch (error) {
      console.error(`Failed to load contract page ${i}:`, error)
      throw new Error(`Failed to load contract page ${i}`)
    }
  }

  return pages
}

/**
 * Clear the image cache
 */
export function clearImageCache(): void {
  IMAGE_CACHE.clear()
}

/**
 * Get cached image count
 */
export function getCacheSize(): number {
  return IMAGE_CACHE.size
}