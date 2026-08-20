import React from 'react';
import { LucideIcon } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface CategoryCardProps {
  name: string;
  icon: LucideIcon;
  image: string;
  onClick: () => void;
  description?: string;
}

export function CategoryCard({ name, icon: Icon, image, onClick, description }: CategoryCardProps) {
  return (
    <button
      onClick={onClick}
      className="group relative overflow-hidden rounded-lg bg-card border border-border hover:shadow-xl transition-all duration-300 cursor-pointer"
    >
      <div className="aspect-[4/3] overflow-hidden">
        <ImageWithFallback
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      </div>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
        <div className="bg-primary/80 p-3 rounded-full mb-3 group-hover:bg-primary transition-colors">
          <Icon className="w-8 h-8" />
        </div>
        <h3 className="text-white mb-1">{name}</h3>
        {description && (
          <p className="text-sm text-white/90 text-center">{description}</p>
        )}
      </div>
    </button>
  );
}
