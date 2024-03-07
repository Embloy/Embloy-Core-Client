import Image from 'next/image';
import * as React from 'react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Icons } from '../icons';

interface FileInputProps {
  id: string
  className?: string
  onFileChange: (file: File | null) => void
  currentUserImageUrl: string | null
}

export function FileInput({ id, className, onFileChange, currentUserImageUrl }: FileInputProps) {
  const [selectedImage, setSelectedImage] = React.useState<File | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedImage(file);
    onFileChange(file);
  }

  return (
    <div className={`flex items-center ${className}`}>
      <input
        type="file"
        id={id}
        className="hidden"
        onChange={handleChange}
        accept=".png, .jpg, .jpeg" // Only accept PNGs and JPGs
      />
      <label htmlFor={id} className="cursor-pointer">
        {(selectedImage || currentUserImageUrl) ? 
             <Image 
            src={selectedImage ? URL.createObjectURL(selectedImage) : (currentUserImageUrl!)} 
            alt="Profile" 
            title={selectedImage ? "This will be your new image" : "Click here to update your image"}
            className="size-40 rounded-full object-cover" 
            width={160}
            height={160}
          />
          :
          <Avatar className="size-40">
          <AvatarFallback className="size-40">
            <span className="sr-only"></span>
            <Icons.user className="size-40" />
          </AvatarFallback>
          </Avatar>
        }
      </label>
    </div>
  );
}