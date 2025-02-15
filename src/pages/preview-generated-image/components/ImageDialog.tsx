
import { Dialog, DialogContent, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { X } from "lucide-react";

interface ImageDialogProps {
  imageUrl: string;
  index: number;
  totalSubmissions: number;
}

export const ImageDialog = ({ imageUrl, index, totalSubmissions }: ImageDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <img
          src={imageUrl}
          alt={`Generated organism ${totalSubmissions - index}`}
          className="w-full h-auto cursor-zoom-in"
        />
      </DialogTrigger>
      <DialogContent className="max-w-screen-lg p-0 border-0 bg-transparent">
        <DialogClose className="absolute right-4 top-4 rounded-full bg-white/90 p-2 shadow-lg hover:bg-white transition-colors">
          <X className="h-4 w-4 text-gray-900" />
          <span className="sr-only">Close</span>
        </DialogClose>
        <img
          src={imageUrl}
          alt={`Generated organism ${totalSubmissions - index}`}
          className="w-full h-auto"
        />
      </DialogContent>
    </Dialog>
  );
};
