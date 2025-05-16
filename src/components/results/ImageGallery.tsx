import React, { useState, useEffect } from 'react';
import { XMarkIcon, ArrowsPointingOutIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

export interface ImageItem {
  url: string;
  title?: string;
  alt?: string;
  sourceUrl?: string;
  metadata?: Record<string, any>;
}

interface ImageGalleryProps {
  images: ImageItem[];
  columns?: number;
  gap?: number;
  className?: string;
  onImageClick?: (image: ImageItem, index: number) => void;
  loading?: boolean;
  emptyMessage?: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  columns = 3,
  gap = 4,
  className = '',
  onImageClick,
  loading = false,
  emptyMessage = 'No images available'
}) => {
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  // Reset loaded images when the image list changes
  useEffect(() => {
    setLoadedImages(new Set());
  }, [images]);

  // Handle image click
  const handleImageClick = (image: ImageItem, index: number) => {
    if (onImageClick) {
      onImageClick(image, index);
    } else {
      setSelectedImage(image);
      setSelectedIndex(index);
    }
  };

  // Close lightbox
  const closeLightbox = () => {
    setSelectedImage(null);
    setSelectedIndex(-1);
  };

  // Navigate to previous/next image in lightbox
  const navigateImage = (direction: 'prev' | 'next') => {
    if (selectedIndex === -1 || images.length <= 1) return;
    
    const newIndex = direction === 'next'
      ? (selectedIndex + 1) % images.length
      : (selectedIndex - 1 + images.length) % images.length;
      
    setSelectedImage(images[newIndex]);
    setSelectedIndex(newIndex);
  };

  // Handle keyboard navigation in lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedImage) return;
      
      switch (e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowLeft':
          navigateImage('prev');
          break;
        case 'ArrowRight':
          navigateImage('next');
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, selectedIndex]);

  // Download image
  const downloadImage = (image: ImageItem, e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      const link = document.createElement('a');
      link.href = image.url;
      link.download = image.title || 
        image.url.split('/').pop() || 
        `image-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  // Handle image load
  const handleImageLoad = (url: string) => {
    setLoadedImages(prev => new Set(prev).add(url));
  };

  // Calculate column styles based on number of columns and gap
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
    gap: `${gap * 0.25}rem`,
  };

  return (
    <div className={`${className}`}>
      {loading ? (
        <div className="flex justify-center items-center p-16">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : images.length === 0 ? (
        <div className="flex justify-center items-center p-8 text-gray-500">
          {emptyMessage}
        </div>
      ) : (
        <div style={gridStyle} className="w-full">
          {images.map((image, index) => (
            <div 
              key={`${image.url}-${index}`}
              className="relative group aspect-square overflow-hidden bg-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleImageClick(image, index)}
            >
              <div 
                className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                  loadedImages.has(image.url) ? 'opacity-0' : 'opacity-100'
                }`}
              >
                <div className="w-8 h-8 border-t-2 border-blue-500 border-solid rounded-full animate-spin"></div>
              </div>
              
              <img
                src={image.url}
                alt={image.alt || image.title || 'Scraped image'}
                className={`object-contain h-full w-full transition-opacity duration-300 ${
                  loadedImages.has(image.url) ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => handleImageLoad(image.url)}
                onError={() => handleImageLoad(image.url)} // Mark as "loaded" even on error
              />
              
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300">
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  {image.title && (
                    <p className="text-white text-sm truncate">{image.title}</p>
                  )}
                  
                  <div className="flex justify-end mt-1">
                    <button 
                      onClick={(e) => downloadImage(image, e)}
                      className="text-white hover:text-blue-200 p-1"
                      title="Download image"
                    >
                      <ArrowDownTrayIcon className="h-4 w-4" />
                    </button>
                    <button 
                      className="text-white hover:text-blue-200 p-1 ml-1"
                      title="View full size"
                    >
                      <ArrowsPointingOutIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Lightbox for full-size image view */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex justify-center items-center"
          onClick={closeLightbox}
        >
          <div 
            className="relative max-w-4xl max-h-screen p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="absolute top-2 right-2 text-white hover:text-gray-300 z-10"
              onClick={closeLightbox}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
            
            <img
              src={selectedImage.url}
              alt={selectedImage.alt || selectedImage.title || 'Scraped image'}
              className="max-h-[80vh] max-w-full object-contain"
            />
            
            {selectedImage.title && (
              <p className="text-white text-center mt-2">{selectedImage.title}</p>
            )}
            
            {selectedImage.sourceUrl && (
              <p className="text-gray-400 text-center text-sm mt-1">
                Source: <a 
                  href={selectedImage.sourceUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-blue-300"
                >
                  {selectedImage.sourceUrl.substring(0, 50)}
                  {selectedImage.sourceUrl.length > 50 ? '...' : ''}
                </a>
              </p>
            )}
            
            {/* Navigation buttons */}
            {images.length > 1 && (
              <>
                <button
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateImage('prev');
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateImage('next');
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <div className="absolute bottom-4 left-0 right-0 text-center text-white">
                  {selectedIndex + 1} / {images.length}
                </div>
              </>
            )}
            
            {/* Download button */}
            <button
              className="absolute bottom-4 right-4 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full"
              onClick={(e) => downloadImage(selectedImage, e)}
              title="Download image"
            >
              <ArrowDownTrayIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
