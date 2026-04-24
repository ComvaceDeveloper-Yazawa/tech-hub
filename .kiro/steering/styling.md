# スタイリング規約

## Tailwind CSS v4 専用

### 使用可能なスタイリング手法

**OK**: Tailwind CSS v4 のみ

**NG**: 以下は禁止

- SCSS / Sass
- CSS Modules
- CSS-in-JS (styled-components, emotion, etc.)
- inline style (緊急時以外)

**理由**: スタイリング手法を統一し、保守性を向上

## デザイントークン管理

### 集約場所

**方法1: tailwind.config.ts**

```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          500: "#0ea5e9",
          600: "#0284c7",
          900: "#0c4a6e",
        },
        secondary: {
          500: "#8b5cf6",
          600: "#7c3aed",
        },
      },
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
```

**方法2: @theme (CSS)**

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  --color-primary-50: #f0f9ff;
  --color-primary-100: #e0f2fe;
  --color-primary-500: #0ea5e9;
  --color-primary-600: #0284c7;
  --color-primary-900: #0c4a6e;

  --spacing-18: 4.5rem;
  --spacing-88: 22rem;
}
```

### 使用例

```tsx
// ✅ デザイントークンを使用
export function Button() {
  return (
    <button className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded">
      クリック
    </button>
  );
}
```

**NG例**:

```tsx
// ❌ ハードコードされた色
export function Button() {
  return <button className="bg-[#0ea5e9] hover:bg-[#0284c7]">クリック</button>;
}
```

## class 結合ヘルパー

### cn() ヘルパーの使用

**src/lib/cn.ts**:

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**理由**:

- `clsx`: 条件付き class の結合
- `tailwind-merge`: 競合する Tailwind class の解決

**OK例**:

```tsx
import { cn } from "@/lib/cn";

interface ButtonProps {
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
}: ButtonProps) {
  return (
    <button
      className={cn(
        "rounded font-medium transition-colors",
        {
          "bg-primary-500 hover:bg-primary-600 text-white":
            variant === "primary",
          "bg-secondary-500 hover:bg-secondary-600 text-white":
            variant === "secondary",
        },
        {
          "px-3 py-1.5 text-sm": size === "sm",
          "px-4 py-2 text-base": size === "md",
          "px-6 py-3 text-lg": size === "lg",
        },
        className,
      )}
    >
      ボタン
    </button>
  );
}
```

**NG例**:

```tsx
// ❌ 文字列結合 (競合する class が解決されない)
export function Button({ variant, className }: ButtonProps) {
  return (
    <button
      className={`px-4 py-2 ${variant === "primary" ? "bg-blue-500" : "bg-gray-500"} ${className}`}
    >
      ボタン
    </button>
  );
}
```

## コンポーネント化のルール

### 3回以上使う class 群はコンポーネント化

**NG例**:

```tsx
// ❌ 同じ class 群を複数箇所で使用
export function Page() {
  return (
    <div>
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        カード1
      </div>
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        カード2
      </div>
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        カード3
      </div>
    </div>
  );
}
```

**OK例**:

```tsx
// ✅ コンポーネント化
export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border border-gray-200 bg-white p-6 shadow-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Page() {
  return (
    <div>
      <Card>カード1</Card>
      <Card>カード2</Card>
      <Card>カード3</Card>
    </div>
  );
}
```

### @apply は最終手段

**使用条件**: コンポーネント化が不可能な場合のみ

**OK例** (最終手段):

```css
/* app/globals.css */
@layer components {
  .btn-primary {
    @apply rounded bg-primary-500 px-4 py-2 font-medium text-white transition-colors hover:bg-primary-600;
  }
}
```

**理由**: `@apply` は Tailwind の利点 (検索性、削除容易性) を損なうため、極力避ける

## 記事本文のスタイリング

### @tailwindcss/typography の使用

**インストール**:

```bash
npm install @tailwindcss/typography
```

**tailwind.config.ts**:

```typescript
export default {
  plugins: [require("@tailwindcss/typography")],
};
```

**使用例**:

```tsx
// src/components/features/ArticleContent.tsx
export function ArticleContent({ content }: { content: string }) {
  return (
    <article className="prose prose-lg prose-slate max-w-none">
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </article>
  );
}
```

**カスタマイズ**:

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "none",
            color: "#334155",
            a: {
              color: "#0ea5e9",
              "&:hover": {
                color: "#0284c7",
              },
            },
            "code::before": {
              content: '""',
            },
            "code::after": {
              content: '""',
            },
          },
        },
      },
    },
  },
};
```

## shadcn/ui の使用

### ベースコンポーネントとして使用

**インストール**:

```bash
npx shadcn@latest init
```

**コンポーネント追加**:

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog
```

**配置**: `src/components/ui/`

**OK例**:

```tsx
// src/components/ui/button.tsx (shadcn/ui が生成)
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary-500 text-white hover:bg-primary-600",
        destructive: "bg-red-500 text-white hover:bg-red-600",
        outline: "border border-gray-300 bg-white hover:bg-gray-100",
        ghost: "hover:bg-gray-100",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
```

**使用例**:

```tsx
// app/(public)/page.tsx
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div>
      <Button variant="default">デフォルト</Button>
      <Button variant="outline">アウトライン</Button>
      <Button variant="ghost" size="sm">
        小さいゴースト
      </Button>
    </div>
  );
}
```

## Prettier 自動整列

### prettier-plugin-tailwindcss

**インストール**:

```bash
npm install -D prettier prettier-plugin-tailwindcss
```

**.prettierrc**:

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

**効果**:

```tsx
// Before
<div className="text-white px-4 bg-blue-500 py-2 rounded">

// After (自動整列)
<div className="rounded bg-blue-500 px-4 py-2 text-white">
```

**理由**: class の順序を統一し、diff を最小化

## レスポンシブデザイン

### モバイルファースト

**OK例**:

```tsx
export function Hero() {
  return (
    <div className="px-4 py-8 md:px-8 md:py-16 lg:px-16 lg:py-24">
      <h1 className="text-2xl font-bold md:text-4xl lg:text-6xl">タイトル</h1>
    </div>
  );
}
```

**NG例**:

```tsx
// ❌ デスクトップファースト
export function Hero() {
  return (
    <div className="px-16 py-24 md:px-8 md:py-16 sm:px-4 sm:py-8">
      <h1 className="text-6xl font-bold md:text-4xl sm:text-2xl">タイトル</h1>
    </div>
  );
}
```

### ブレークポイント

| プレフィックス | 最小幅 |
| -------------- | ------ |
| sm             | 640px  |
| md             | 768px  |
| lg             | 1024px |
| xl             | 1280px |
| 2xl            | 1536px |

## ダークモード対応 (将来)

### 準備

**tailwind.config.ts**:

```typescript
export default {
  darkMode: "class", // または 'media'
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
      },
    },
  },
};
```

**app/globals.css**:

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
  }
}
```

**使用例**:

```tsx
export function Card() {
  return (
    <div className="bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
      カード
    </div>
  );
}
```

## 禁止事項

### 1. !important の使用

**NG例**:

```tsx
// ❌ !important は禁止
<div className="!bg-red-500">
```

**理由**: 詳細度の問題は設計で解決すべき

### 2. 巨大な inline style

**NG例**:

```tsx
// ❌ 複雑な inline style
<div style={{
  backgroundColor: '#0ea5e9',
  padding: '1rem',
  borderRadius: '0.5rem',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
}}>
```

**OK例**:

```tsx
// ✅ Tailwind class を使用
<div className="rounded-lg bg-primary-500 p-4 shadow-sm">
```

### 3. styled-components / emotion

**NG例**:

```tsx
// ❌ CSS-in-JS は禁止
import styled from "styled-components";

const Button = styled.button`
  background-color: #0ea5e9;
  padding: 0.5rem 1rem;
`;
```

**理由**: Tailwind CSS v4 と競合し、バンドルサイズが増加

## アクセシビリティ

### 必須対応

```tsx
// ✅ アクセシビリティ対応
export function Button({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded bg-primary-500 px-4 py-2 text-white hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
      aria-label="ボタン"
    >
      {children}
    </button>
  );
}
```

**必須項目**:

- `focus:` 疑似クラスでフォーカス状態を明示
- `aria-label` または `aria-labelledby` で説明
- キーボード操作可能

## セルフチェックリスト

- [ ] Tailwind CSS v4 のみを使用しているか
- [ ] SCSS / CSS Modules / CSS-in-JS を使用していないか
- [ ] デザイントークンは `tailwind.config.ts` または `@theme` に集約されているか
- [ ] class 結合に `cn()` ヘルパーを使用しているか
- [ ] 3回以上使う class 群はコンポーネント化したか
- [ ] `@apply` は最終手段としてのみ使用しているか
- [ ] 記事本文に `@tailwindcss/typography` を使用しているか
- [ ] shadcn/ui をベースコンポーネントとして使用しているか
- [ ] Prettier で class 順を自動整列しているか
- [ ] `!important` を使用していないか
- [ ] フォーカス状態を明示しているか
