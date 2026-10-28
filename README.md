# Prep! — Playful Geometric 版

依照精簡後的 sitemap 重做的前端原型：純 HTML + 原生 JavaScript + Tailwind CSS，用一個很小的 Node.js 伺服器在 localhost 提供網頁。頁面之間都用相對路徑連結，所以 `/setup` 與 `/setup.html` 兩種網址都能開。

## 執行

需要 Node.js 18 以上。

```bash
npm install      # 第一次執行；會自動把字型與圖示複製到 public/
npm run dev      # Tailwind 監看 + 伺服器，開 http://localhost:5173
```

其他指令：

- `npm start`：先建置 CSS 再啟動伺服器（不監看）
- `npm run build`：只建置 `public/css/styles.css`
- 換埠號：`PORT=3000 npm run dev`（PowerShell：`$env:PORT=3000; npm run dev`）

## 頁面（對應 sitemap）

| 網址 | 檔案 | 內容 |
| --- | --- | --- |
| `/`（或 `/index.html`） | `public/index.html` | Home：主要按鈕、6 種情境、快速練習（每日挑戰 + 6 張練習卡） |
| `/setup` | `public/setup.html` | 3 步驟設定：場合與觀眾 → 素材（可略過）→ 重點與時間 |
| `/room` | `public/room.html` | 練習室：模擬觀眾、即時提示、提問、自己的錄影畫面 |
| `/review` | `public/review.html` | 分析中 → 報告（同一頁）：回放、分數、時間軸回饋、觀眾理解度 |
| `/prep-note` | `public/prep-note.html` | 上場前小卡：複製、儲存、再練一次、完成 |

## 結構

```
server.js              靜態伺服器（含乾淨網址）
tailwind.config.js     設計 tokens 對應到 Tailwind
src/input.css          Playful Geometric tokens、字型、元件樣式
public/js/i18n.js      中英文文案（沿用原版）
public/js/data.js      模擬資料（沿用原版）
public/js/store.js     頁面間狀態：設定存 sessionStorage，錄影存 IndexedDB
public/js/ui.js        header、語言切換、圖示
public/js/*.js         各頁邏輯
```

## 仍是模擬的部分

AI 評分、觀眾反應、觀眾理解度、備忘卡內容與檔案上傳都是假資料；只有攝影機錄影與回放是真的，而且影片只存在這個瀏覽器裡。
