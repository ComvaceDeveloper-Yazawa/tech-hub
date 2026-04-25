import { MediaLibrary } from '@/components/features/MediaLibrary';

export default function MediaPage() {
  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      <h1 className="mb-4 text-2xl font-bold">メディアライブラリ</h1>
      <div className="border-border flex-1 overflow-hidden rounded-lg border">
        <MediaLibrary />
      </div>
    </div>
  );
}
