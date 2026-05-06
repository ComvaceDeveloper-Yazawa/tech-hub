export function CafeCh1ReadDesign() {
  return (
    <article className="prose prose-slate max-w-none">
      <span className="mb-4 inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 no-underline">
        第1章 レッスン1
      </span>
      <h1 className="text-3xl font-bold text-slate-800">
        デザインを読み解こう
      </h1>

      <section className="mt-4">
        <h2 className="text-xl font-bold text-slate-800">
          このレッスンのゴール
        </h2>
        <ul>
          <li>Figma でファイルを開いて全体を見渡せる</li>
          <li>要素をクリックして色・フォント・サイズを調べられる</li>
          <li>必要な画像を SVG / PNG でエクスポートできる</li>
        </ul>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-bold text-slate-800">
          なぜ先にデザインを読むのか
        </h2>
        <p>
          実装に入る前に、まず全体の構成・色・フォントを把握しておくと、後からの手戻りが
          減ります。とくにコーポレートサイトや EC
          サイトのような「デザインファースト」 な案件では、デザイナーが用意した
          Figma をきちんと読み解く力が、そのまま実装品質に 直結します。
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold text-slate-800">
          Step 1. ホーム画面のフレームを開く
        </h2>
        <ol>
          <li>講師から共有された Figma のリンクを開く。</li>
          <li>
            ファイルが開くと、いくつかのフレーム（画面の単位）が並んでいます。
            今回は<strong>「home-pc」</strong>と<strong>「home-sp」</strong>の 2
            つに注目してください。
          </li>
          <li>
            スクロール（あるいは <code>Ctrl/Cmd + 0</code>{' '}
            で全体表示）で両方を確認し、 上から下まで何があるかを把握します。
          </li>
        </ol>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold text-slate-800">
          Step 2. 各ブロックの役割を確認する
        </h2>
        <p>ホーム画面は次のブロックで構成されています。</p>
        <ol>
          <li>
            <strong>ヘッダー</strong>: ロゴとナビゲーション。SP
            では右端がハンバーガー。
          </li>
          <li>
            <strong>MainView</strong>:
            背景写真の上に白い見出しボックスが重なる導入エリア。
          </li>
          <li>
            <strong>ButtonBar</strong>:
            黒い帯に「商品一覧」見出しと並び替えのセレクトボックス。
          </li>
          <li>
            <strong>ProductLists</strong>: 商品カードのグリッド。PC は 4 列、SP
            は 1 列。
          </li>
          <li>
            <strong>CTA ブロック</strong>:
            濃いグレーの背景に、カート一覧へ誘導するボタン。
          </li>
          <li>
            <strong>フッター</strong>: オレンジ背景のテキストブロック。
          </li>
        </ol>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold text-slate-800">
          Step 3. 色・フォント・サイズを読み取る
        </h2>
        <p>
          要素をクリックすると、Figma の右サイドバーに詳細が表示されます。
          具体的には次のような情報が取れます。
        </p>
        <ul>
          <li>
            <strong>色</strong>: Fill セクションの <code>#FFFFFF</code>
            のような 16 進数カラーコード。
          </li>
          <li>
            <strong>フォント</strong>: Text セクションの Font family と Font
            size。
          </li>
          <li>
            <strong>サイズ・余白</strong>: 要素を選択したまま、別の要素に
            <code>Alt</code>（Mac は <code>Option</code>）キーを押しながら
            マウスオーバーすると、距離が表示されます。
          </li>
          <li>
            <strong>角丸</strong>: Corner radius の値。
          </li>
        </ul>
        <p className="text-sm text-slate-500">
          数値を暗記する必要はありません。実装中にまた Figma を見に戻れば OK。
          「どこにあるか」だけ押さえましょう。
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold text-slate-800">
          Step 4. 画像をエクスポートする
        </h2>
        <p>
          ヒーロー画像・ロゴ・商品写真など、必要な画像はこの段階でエクスポートしておくと後が楽です。
        </p>
        <ol>
          <li>エクスポートしたい画像レイヤーをクリックで選択。</li>
          <li>
            右サイドバーの一番下にある<strong>「Export」</strong>
            セクションを開く。
          </li>
          <li>
            「+」ボタンで出力項目を追加。形式を
            <strong>写真なら PNG、アイコンなら SVG</strong>に設定。
          </li>
          <li>「Export」ボタンを押すとファイルがダウンロードされます。</li>
          <li>
            ダウンロードしたファイルをプロジェクトの
            <code>assets/images/</code> フォルダに置きます。
          </li>
        </ol>
        <p className="text-sm text-slate-500">
          エクスポートは各章のはじめに「この章で必要な分だけ」行います。1
          回でまとめてやらず、 都度やる方が管理しやすいです。
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold text-slate-800">
          カラーパレット（目安）
        </h2>
        <ul>
          <li>メインオレンジ（ヘッダー・フッター）</li>
          <li>ベージュ（ページ背景）</li>
          <li>黒（ButtonBar）</li>
          <li>ダークグレー（CTA ブロック）</li>
          <li>白（カード背景）</li>
        </ul>
        <p>
          正確な色は Figma
          で都度クリックして確認。このレッスンでは「雰囲気として
          このトーンで作る」くらいの把握で OK です。
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold text-slate-800">
          よくあるつまずきポイント
        </h2>
        <ul>
          <li>
            <strong>要素がうまく選べない</strong>: Figma
            はレイヤーが重なっていることが多く、 1
            回目のクリックではグループが選ばれることがあります。もう一度クリックすると
            1 階層深く選べます。
          </li>
          <li>
            <strong>画像を写真で保存したいのにボケる</strong>: Export で
            「2x」や「3x」の倍率指定ができます。綺麗に出力したい画像は倍率を上げましょう。
          </li>
          <li>
            <strong>見る場所が多すぎて疲れる</strong>:
            一度に全部覚えようとせず、
            「今から作るブロック」だけに集中してください。実装と並行して見る方が頭に残ります。
          </li>
        </ul>
      </section>
    </article>
  );
}
