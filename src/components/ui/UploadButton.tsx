// src/components/ui/UploadButton.tsx
import React from 'react';
import { PhotoIcon, TrashIcon } from '@heroicons/react/24/outline';

interface UploadButtonProps {
  currentImage?: string;
  onUpload: (file: File) => void;
  onRemove: () => void;
}

export const UploadButton: React.FC<UploadButtonProps> = ({
  currentImage,
  onUpload,
  onRemove
}) => {
  return (
    <div>
      {currentImage ? (
        <div className="relative rounded-lg overflow-hidden">
          <img
            src={currentImage}
            alt="Uploaded image"
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity">
            <div className="absolute top-2 right-2 flex space-x-2">
              <label className="p-2 bg-white rounded-full cursor-pointer hover:bg-gray-100">
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) onUpload(file);
                  }}
                />
                <PhotoIcon className="w-5 h-5 text-gray-600" />
              </label>
              <button
                onClick={onRemove}
                className="p-2 bg-white rounded-full hover:bg-gray-100"
              >
                <TrashIcon className="w-5 h-5 text-red-500" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 cursor-pointer">
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onUpload(file);
            }}
          />
          <PhotoIcon className="w-12 h-12 text-gray-400" />
          <span className="mt-2 text-sm text-gray-500">
            Klik om een afbeelding te uploaden
          </span>
        </label>
      )}
    </div>
  );
};