import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '../lib/types';
import { CategoryCard } from './CategoryCard';
import { Button } from './ui/button';

interface ProductCarouselProps {
  children: React.ReactNode[];
  itemsPerView?: number;
}

export function ProductCarousel({ children, itemsPerView = 4 }: ProductCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  
  const totalItems = children.length;
  const maxIndex = Math.max(0, totalItems - itemsPerView);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX);
    setScrollLeft(currentIndex);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    
    const x = e.pageX;
    const walk = (startX - x) / 200; // Sensibilidad del arrastre
    const newIndex = Math.round(scrollLeft + walk);
    
    // Limitar el índice entre 0 y maxIndex
    const boundedIndex = Math.max(0, Math.min(maxIndex, newIndex));
    setCurrentIndex(boundedIndex);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };
    
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < maxIndex;

  return (
    <div className="relative">
      {/* Navigation Buttons */}
      {canGoPrev && (
        <Button
          variant="outline"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 -translate-x-1/2 bg-card shadow-lg hover:bg-primary hover:text-primary-foreground"
          onClick={handlePrev}
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
      )}
      
      {canGoNext && (
        <Button
          variant="outline"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 translate-x-1/2 bg-card shadow-lg hover:bg-primary hover:text-primary-foreground"
          onClick={handleNext}
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      )}

      {/* Carousel Content */}
      <div 
        className="overflow-hidden"
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <div
          ref={carouselRef}
          className="flex transition-transform duration-300 ease-in-out gap-6 select-none"
          style={{
            transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          {children.map((child, index) => (
            <div
              key={index}
              className="flex-shrink-0"
              style={{ width: `calc(${100 / itemsPerView}% - ${(itemsPerView - 1) * 24 / itemsPerView}px)` }}
            >
              {child}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
