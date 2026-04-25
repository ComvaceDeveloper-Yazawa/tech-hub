'use client';

import { useState, useEffect, useCallback, useTransition } from 'react';
import {
  ImageIcon,
  FolderIcon,
  ArrowLeftIcon,
  UploadIcon,
  Trash2Icon,
  CopyIcon,
  XIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { listMedia, type MediaItem } from '@/presentation/actions/listMedia';
import { uploadMedia } from '@/presentation/actions/uploadMedia';
import { deleteMedia } from '@/presentation/actions/deleteMedia';

interface MediaLibraryProps {
  onSelect?: (url: string) => void;
  onClose?: () => void;
}

export function MediaLibrary({ onSelect, onClose }: MediaLibraryProps) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [currentFolder, setCurrentFolder] = useState<string>('');
  const [newFolder, setNewFolder] = useState('');
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isPending, startTransition] = useTransition();

  const load = useCallback((folder: string) => {
    startTransition(async () => {
      try {
        const data = await listMedia(folder || undefined);
        setItems(data);
      } catch (e) {
        toast.error(e instanceof Error ? e.message : '読み込みに失敗しました');
      }
    });
  }, []);

  useEffect(() => {
    load(currentFolder);
  }, [currentFolder, load]);

  const handleUpload = useCallback(
    async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', currentFolder);
      try {
        await uploadMedia(formData);
        toast.success('アップロードしました');
        load(currentFolder);
      } catch (e) {
        toast.error(
          e instanceof Error ? e.message : 'アップロードに失敗しました'
        );
      }
    },
    [currentFolder, load]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith('image/')) handleUpload(file);
  };

  const handleDelete = async (item: MediaItem) => {
    if (!confirm(`「${item.name}」を削除しますか？`)) return;
    try {
      await deleteMedia(item.path);
      toast.success('削除しました');
      if (selectedItem?.path === item.path) setSelectedItem(null);
      load(currentFolder);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : '削除に失敗しました');
    }
  };

  const handleCreateFolder = () => {
    if (!newFolder.trim()) return;
    // Supabase Storage はフォルダを .gitkeep で作成
    const formData = new FormData();
    const placeholder = new File([''], '.gitkeep', { type: 'text/plain' });
    formData.append('file', placeholder);
    formData.append(
      'folder',
      currentFolder ? `${currentFolder}/${newFolder.trim()}` : newFolder.trim()
    );
    startTransition(async () => {
      try {
        await uploadMedia(formData);
        toast.success('フォルダを作成しました');
        setNewFolder('');
        load(currentFolder);
      } catch (e) {
        toast.error(
          e instanceof Error ? e.message : 'フォルダ作成に失敗しました'
        );
      }
    });
  };

  const breadcrumbs = currentFolder ? currentFolder.split('/') : [];

  const folders = items.filter((i) => i.isFolder);
  const files = items.filter((i) => !i.isFolder && i.name !== '.gitkeep');

  return (
    <div className="flex h-full flex-col">
      {/* ヘッダー */}
      <div className="border-border flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2 text-sm">
          <button
            onClick={() => {
              setCurrentFolder('');
              setSelectedItem(null);
            }}
            className="text-muted-foreground hover:text-foreground font-medium"
          >
            メディア
          </button>
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-2">
              <span className="text-muted-foreground">/</span>
              <button
                onClick={() => {
                  setCurrentFolder(breadcrumbs.slice(0, i + 1).join('/'));
                  setSelectedItem(null);
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                {crumb}
              </button>
            </span>
          ))}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <XIcon className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* メインエリア */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* ツールバー */}
          <div className="border-border flex items-center gap-2 border-b px-4 py-2">
            {currentFolder && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const parts = currentFolder.split('/');
                  parts.pop();
                  setCurrentFolder(parts.join('/'));
                  setSelectedItem(null);
                }}
              >
                <ArrowLeftIcon className="mr-1 h-4 w-4" />
                戻る
              </Button>
            )}
            <label className="cursor-pointer">
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={(e) => {
                  const label = (e.currentTarget as HTMLElement).closest(
                    'label'
                  );
                  label?.querySelector('input')?.click();
                }}
              >
                <UploadIcon className="mr-1 h-4 w-4" />
                アップロード
              </Button>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileInput}
              />
            </label>
            <div className="flex items-center gap-1">
              <Input
                value={newFolder}
                onChange={(e) => setNewFolder(e.target.value)}
                placeholder="新しいフォルダ名"
                className="h-8 w-36 text-sm"
                onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleCreateFolder}
                disabled={!newFolder.trim()}
              >
                <FolderIcon className="mr-1 h-4 w-4" />
                作成
              </Button>
            </div>
          </div>

          {/* ファイルグリッド */}
          <div
            className={`flex-1 overflow-y-auto p-4 ${isDragging ? 'bg-primary/5 ring-primary ring-2 ring-inset' : ''}`}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
          >
            {isPending ? (
              <p className="text-muted-foreground py-8 text-center text-sm">
                読み込み中...
              </p>
            ) : folders.length === 0 && files.length === 0 ? (
              <p className="text-muted-foreground py-8 text-center text-sm">
                ファイルをドラッグ＆ドロップしてアップロード
              </p>
            ) : (
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
                {folders.map((folder) => (
                  <button
                    key={folder.path}
                    className="hover:bg-accent flex flex-col items-center gap-1 rounded-lg p-2 text-center"
                    onDoubleClick={() => {
                      setCurrentFolder(folder.path);
                      setSelectedItem(null);
                    }}
                    onClick={() => setSelectedItem(folder)}
                  >
                    <FolderIcon className="text-primary h-10 w-10" />
                    <span className="w-full truncate text-xs">
                      {folder.name}
                    </span>
                  </button>
                ))}
                {files.map((file) => (
                  <button
                    key={file.path}
                    onClick={() => setSelectedItem(file)}
                    className={`hover:bg-accent flex flex-col items-center gap-1 rounded-lg p-2 text-center ${selectedItem?.path === file.path ? 'bg-accent ring-primary ring-2' : ''}`}
                  >
                    <div className="bg-muted flex h-16 w-full items-center justify-center overflow-hidden rounded">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={file.url}
                        alt={file.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <span className="w-full truncate text-xs">{file.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* サイドパネル（選択中ファイルの詳細） */}
        {selectedItem && !selectedItem.isFolder && (
          <div className="border-border w-56 shrink-0 overflow-y-auto border-l p-4">
            <div className="bg-muted mb-3 flex h-32 items-center justify-center overflow-hidden rounded">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedItem.url}
                alt={selectedItem.name}
                className="h-full w-full object-contain"
              />
            </div>
            <p className="mb-1 text-sm font-medium break-all">
              {selectedItem.name}
            </p>
            <p className="text-muted-foreground mb-3 text-xs">
              {selectedItem.size > 0
                ? `${Math.round(selectedItem.size / 1024)} KB`
                : ''}
            </p>
            <div className="space-y-2">
              <Button
                size="sm"
                className="w-full"
                onClick={() => {
                  navigator.clipboard.writeText(selectedItem.url);
                  toast.success('URLをコピーしました');
                }}
              >
                <CopyIcon className="mr-1 h-4 w-4" />
                URLをコピー
              </Button>
              {onSelect && (
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    onSelect(selectedItem.url);
                    onClose?.();
                  }}
                >
                  <ImageIcon className="mr-1 h-4 w-4" />
                  記事に挿入
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                className="text-destructive hover:text-destructive w-full"
                onClick={() => handleDelete(selectedItem)}
              >
                <Trash2Icon className="mr-1 h-4 w-4" />
                削除
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
