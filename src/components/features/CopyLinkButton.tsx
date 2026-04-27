'use client';

import { useState } from 'react';
import { Link, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CopyLinkButtonProps {
  slug: string;
}

export function CopyLinkButton({ slug }: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleClick = async () => {
    const url = `${window.location.origin}/articles/${slug}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      aria-label="リンクをコピー"
    >
      {copied ? (
        <Check className="size-4 text-green-500" aria-hidden="true" />
      ) : (
        <Link className="size-4" aria-hidden="true" />
      )}
    </Button>
  );
}
