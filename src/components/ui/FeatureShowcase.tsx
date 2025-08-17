'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

type Feature = {
  id: string;
  title: string;
  description: string;
  image: string;
};

type FeatureShowcaseProps = {
  features: Feature[];
  className?: string;
};

export function FeatureShowcase({
  features,
  className,
}: FeatureShowcaseProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const goToFeature = (index: number) => {
    setActiveIndex(index);
  };

  const nextFeature = () => {
    setActiveIndex((prev) => (prev + 1) % features.length);
  };

  const prevFeature = () => {
    setActiveIndex((prev) => (prev - 1 + features.length) % features.length);
  };

  return (
    <div className={cn("flex flex-col md:flex-row gap-8 w-full", className)}>
      {/* Feature List */}
      <div className="w-full md:w-1/3 space-y-4">
        {features.map((feature, index) => (
          <div
            key={feature.id}
            className={cn(
              "p-4 rounded-lg cursor-pointer transition-all duration-300",
              activeIndex === index 
                ? "bg-blue-50 border-l-4 border-blue-500" 
                : "hover:bg-gray-50 border-l-4 border-transparent"
            )}
            onClick={() => goToFeature(index)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                goToFeature(index);
              }
            }}
            role="button"
            tabIndex={0}
            aria-label={`View ${feature.title} feature`}
            aria-current={activeIndex === index ? 'step' : undefined}
          >
            <h3 className="font-semibold text-lg">{feature.title}</h3>
            <p className="text-gray-600 mt-1">{feature.description}</p>
          </div>
        ))}
        
        {/* Navigation Dots */}
        <div className="flex justify-center gap-2 pt-4">
          {features.map((_, index) => (
            <button
              key={index}
              onClick={() => goToFeature(index)}
              className={cn(
                "w-3 h-3 rounded-full transition-all",
                activeIndex === index ? "bg-blue-500 w-6" : "bg-gray-300"
              )}
              aria-label={`Go to feature ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Image Display */}
      <div className="w-full md:w-2/3 relative">
        <div className="relative aspect-video bg-gray-100 rounded-xl overflow-hidden">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className={cn(
                "absolute inset-0 transition-opacity duration-500 flex items-center justify-center",
                activeIndex === index ? 'opacity-100' : 'opacity-0 pointer-events-none'
              )}
              aria-hidden={activeIndex !== index}
            >
              <Image
                src={feature.image}
                alt={feature.title}
                width={800}
                height={450}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
        
        {/* Navigation Arrows */}
        <button
          onClick={prevFeature}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md transition-all"
          aria-label="Previous feature"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={nextFeature}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md transition-all"
          aria-label="Next feature"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
