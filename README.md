# 🗑️ 垃圾分類辨識 Web App

使用 TensorFlow.js 和 Teachable Machine 建立的即時垃圾分類辨識應用程式。

## 🎯 功能特色

- ✅ 即時攝影機預覽
- ✅ 拍照辨識垃圾類型
- ✅ 顯示各分類的信心分數
- ✅ 響應式設計（支援手機、平板、電腦）
- ✅ 完全基於瀏覽器，無需後端伺服器
- ✅ 支援 GitHub Pages 部署

## 📁 檔案結構

```
trash-identify/
├── index.html          # 網頁主結構
├── style.css           # 樣式美化
├── script.js           # 核心程式碼（TensorFlow.js + Teachable Machine）
├── models/
│   ├── model.json      # 模型定義檔案
│   ├── metadata.json   # 模型中繼資料（分類標籤等）
│   └── weights.bin     # 模型權重檔案
└── README.md           # 本說明文檔
```

## 🚀 使用方式

### 本地運行

1. **使用 VS Code 內建伺服器**
   - 安裝 Live Server 擴充套件
   - 在 `index.html` 上按滑鼠右鍵 → "Open with Live Server"

2. **使用 Python 簡易伺服器**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # 然後在瀏覽器開啟：http://localhost:8000
   ```

3. **使用 Node.js http-server**
   ```bash
   npx http-server
   ```

### GitHub Pages 部署

1. 推送至 GitHub repository
   ```bash
   git add .
   git commit -m "Add trash classifier web app"
   git push origin main
   ```

2. 在 GitHub 設定中啟用 Pages
   - Settings → Pages → Source: main branch
   - 網站將在 `https://your-username.github.io/trash-identify/` 上線

## 🎓 分類標籤

本模型支援以下 4 種垃圾分類：

- 🗑️ **trash** - 其他垃圾
- 🥛 **glass** - 玻璃類
- 🎒 **plastic** - 塑膠類
- 👟 **shoes** - 鞋類

## 📖 程式碼說明

### HTML (index.html)
- 定義網頁結構：攝影機容器、按鈕群組、結果顯示區
- 載入必要的 JavaScript 函式庫：
  - TensorFlow.js（深度學習框架）
  - Teachable Machine Image Library（模型管理）

### CSS (style.css)
- 現代化的漸層設計
- Flexbox / Grid 響應式佈局
- 結果視覺化（顏色進度條表示信心分數）

### JavaScript (script.js)
核心功能分為幾個主要函式：

| 函式 | 功能 |
|------|------|
| `init()` | 初始化，載入 Teachable Machine 模型 |
| `startCamera()` | 開啟設備攝影機 |
| `stopCamera()` | 關閉攝影機 |
| `capturePhoto()` | 拍照並執行辨識 |
| `startPrediction()` | 實時預測（持續更新結果） |
| `displayPredictions()` | 在頁面上顯示預測結果 |

## 🔧 技術堆疊

- **TensorFlow.js** - JavaScript 神經網路框架
- **Teachable Machine** - Google 的簡易模型訓練工具
- **HTML5 Media API** - 攝影機訪問
- **CSS3** - 現代網頁樣式

## ⚠️ 常見問題

### Q: 為什麼看不到攝影機？
A: 檢查瀏覽器是否被阻止訪問攝影機。在設定中允許網站使用攝影機。

### Q: 模型載入很慢？
A: 第一次載入時會下載 model.json 和 weights.bin（約 10-50MB）。可以開啟瀏覽器開發者工具查看下載進度。

### Q: 可以對同一張照片進行多次辨識嗎？
A: 是的，拍照後可以再按「拍照辨識」按鈕重新辨識。

### Q: 支援多語言嗎？
A: 目前為繁體中文 (zh-TW)。可自行編輯 HTML 修改文字。

## 📱 瀏覽器相容性

| 瀏覽器 | 支援 |
|--------|------|
| Chrome | ✅ 完全支援 |
| Firefox | ✅ 完全支援 |
| Safari | ✅ 支援（iOS 15+） |
| Edge | ✅ 完全支援 |
| IE 11 | ❌ 不支援 |

## 📄 授權

本專案使用 Teachable Machine 生成的模型，遵循 Google 的使用條款。

## 👨‍🎓 課堂作業提示

這個 Web App 適合用於：
- 展示深度學習在實際應用中的使用
- 示範 JavaScript 和瀏覽器 API 的整合
- 教授模型訓練（使用 Teachable Machine）
- 討論圖像分類和機器學習的原理

祝你課堂展示順利！🎉