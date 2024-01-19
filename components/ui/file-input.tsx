import Image from 'next/image';
import * as React from 'react';

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
      />
      <label htmlFor={id} className="cursor-pointer">
      <Image 
        src={selectedImage ? URL.createObjectURL(selectedImage) : (currentUserImageUrl ?? "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.murrayglass.com%2Fwp-content%2Fuploads%2F2020%2F10%2Favatar-scaled.jpeg&f=1&nofb=1&ipt=2d0c052bfc773e1a6cfa9363c777cf9b5fe6898b058f5b2cfd32cadccae5b6db&ipo=images")} 
        alt="Profile" 
        title="This will be your new image"
        className="h-40 w-40 rounded-full object-cover" 
      />
      </label>
    </div>
  );
}