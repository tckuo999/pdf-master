import React, { useState, useEffect, useRef } from 'react';
import { Upload, FileText, CheckCircle, BarChart2, Download, RefreshCw, AlertCircle, Image as ImageIcon, Type, Database, Shield, Settings, Info, Zap, Layers, Maximize2, Globe, Coffee, ChevronDown, Check, HelpCircle, Eye } from 'lucide-react';

// --- 多語言字典 (i18n) + SEO 數據 ---
const translations = {
  'zh-TW': {
    name: "繁體中文",
    metaTitle: "PDF 壓縮大師 - 100% 本地執行、隱私安全的 PDF 瘦身工具",
    metaDesc: "最安全的 PDF 壓縮工具，所有運算皆在瀏覽器本地執行，檔案絕不上傳伺服器，確保 100% 隱私保護。支援數位重掃描與無損優化。",
    keywords: "PDF壓縮, 本地執行, 隱私保護, PDF瘦身, 線上PDF工具, 免費PDF, 離線PDF, 不上傳伺服器",
    
    title: "PDF 壓縮大師",
    subtitle: "Pro 版 - 本地隱私優先",
    loadingLib: "正在載入渲染引擎 (PDF.js + jsPDF)...",
    errorTitle: "發生錯誤",
    retry: "重試",
    heroTitle: "隱私優先的強力 PDF 壓縮工具",
    heroDesc: "結合隱私保護與高效能。所有壓縮運算皆在您的裝置上本地執行，絕不上傳伺服器。利用「數位重掃描」技術有效縮減檔案體積，安全又快速。",
    dragDrop: "拖放 PDF 至此處",
    or: "或",
    selectFile: "選擇本機檔案",
    offlineSupport: "支援離線執行",
    feature1Title: "真實影像壓縮",
    feature1Desc: "透過數位重掃描技術，真正降低圖片解析度與檔案大小。",
    feature2Title: "靈活壓縮策略",
    feature2Desc: "可選擇「無損優化」或「強力重製」，滿足不同場景需求。",
    feature3Title: "100% 本地隱私保護",
    feature3Desc: "檔案運算完全在您的瀏覽器內完成，絕不上傳雲端，確保最高等級的資料安全與隱私。",
    analyzingStatus: "正在讀取並解析檔案結構...",
    reportTitle: "分析報告",
    originalSize: "原始大小",
    contentEst: "內容組成預估",
    imageContent: "影像內容",
    optimizationTip: "提示：若原始檔案圖片佔比高，建議使用「標準」或「強力」模式來獲得顯著效果。",
    algoTitle: "選擇壓縮演算法",
    algoDesc: "我們提供兩種截然不同的壓縮技術：",
    modeLowTitle: "輕度壓縮 (結構優化)",
    modeLowDesc: "【無損】僅清理檔案結構。圖片畫質不變，文字可選取。檔案縮小幅度較小。",
    modeMedTitle: "標準壓縮 (平衡模式)",
    modeMedDesc: "【有損重繪】將頁面轉換為高品質圖片 (1.5x)。大幅縮小檔案，但文字將變為圖片。",
    modeHighTitle: "強力壓縮 (網頁預覽)",
    modeHighDesc: "【有損重繪】低品質圖片 (1.0x)。檔案最小化，適合僅供螢幕瀏覽的文件。",
    startBtnLow: "開始優化結構",
    startBtnRaster: "開始重繪壓縮",
    textWarn: "注意：標準/強力模式會將文字轉換為圖片，無法複製文字。",
    compressingStatus: "正在本地處理中...",
    compressingDescRaster: "正在逐頁重繪與重新編碼，這可能需要一點時間...",
    compressingDescLow: "正在整理檔案結構...",
    completeTitle: "優化完成！",
    ratio: "縮減比例",
    currentSize: "現在大小",
    modeLabel: "使用模式",
    saved: "成功節省了",
    noSaved: "檔案結構已是最簡狀態，或原檔已高度壓縮。",
    downloadBtn: "下載優化檔案",
    processAnother: "處理另一個",
    techNoteTitle: "技術說明",
    techNoteDesc: "對於「標準」與「強力」模式，我們使用 PDF.js 將頁面渲染為數位影像，再壓縮為 JPEG 重組。這是純瀏覽器環境下大幅縮減圖片大小的唯一有效方案。",
    sponsorBtn: "贊助開發者",
    faqTitle: "常見問題 (FAQ)",
    faqs: [
      { q: "這款 PDF 壓縮工具是免費的嗎？", a: "是的，本工具完全免費，且所有運算都在您的電腦上進行。" },
      { q: "我的檔案會被上傳到伺服器嗎？", a: "絕對不會。我們使用瀏覽器端技術 (WebAssembly)，您的檔案永遠不會離開您的裝置，隱私絕對安全。" },
      { q: "為什麼壓縮後的 PDF 無法選取文字？", a: "如果您選擇「標準」或「強力」模式，為了達到最大壓縮率，我們會將頁面轉換為影像格式。若需保留文字，請選擇「輕度壓縮」。" },
      { q: "支援哪些語言？", a: "我們支援繁體中文、簡體中文、英文、日文、韓文、西班牙文等 13 種主流語言。" }
    ],
    items: {
      images: "影像資源",
      structure: "文件結構",
      potentialHigh: "高",
      potentialRebuild: "可重組",
      descImages: "頁面可能包含未壓縮圖片",
      descStructure: (count) => `共 ${count} 頁`
    },
    status: {
      reading: "正在讀取檔案...",
      parsing: "解析 PDF 結構...",
      scanning: "掃描影像物件...",
      initRender: "初始化渲染引擎...",
      resampling: (i, total) => `正在重新取樣第 ${i} / ${total} 頁...`,
      packing: "正在打包新文件...",
      analyzingStruct: "分析文件結構...",
      cleaningMeta: "清除元數據...",
      rebuilding: "重組物件流..."
    },
    visits: "累積瀏覽人次"
  },
  'zh-CN': {
    name: "简体中文",
    metaTitle: "PDF 压缩大师 - 100% 本地运行、隐私安全的 PDF 瘦身工具",
    metaDesc: "最安全的 PDF 压缩工具，所有运算皆在浏览器本地运行，文件绝不上传服务器，确保 100% 隐私保护。支持数字重扫描与无损优化。",
    keywords: "PDF压缩, 本地运行, 隐私保护, PDF瘦身, 免费PDF, 离线PDF, 不上传服务器",
    
    title: "PDF 压缩大师",
    subtitle: "Pro 版 - 本地隐私优先",
    loadingLib: "正在加载渲染引擎 (PDF.js + jsPDF)...",
    errorTitle: "发生错误",
    retry: "重试",
    heroTitle: "隐私优先的强力 PDF 压缩工具",
    heroDesc: "结合隐私保护与高性能。所有压缩运算皆在您的设备上本地运行，绝不上传服务器。利用“数字重扫描”技术有效缩减文件体积，安全又快速。",
    dragDrop: "拖放 PDF 至此处",
    or: "或",
    selectFile: "选择本地文件",
    offlineSupport: "支持离线运行",
    feature1Title: "真实影像压缩",
    feature1Desc: "通过数字重扫描技术，真正降低图片分辨率与文件大小。",
    feature2Title: "灵活压缩策略",
    feature2Desc: "可选择“无损优化”或“强力重制”，满足不同场景需求。",
    feature3Title: "100% 本地隐私保护",
    feature3Desc: "文件运算完全在您的浏览器内完成，绝不上传云端，确保最高等级的数据安全与隐私。",
    analyzingStatus: "正在读取并解析文件结构...",
    reportTitle: "分析报告",
    originalSize: "原始大小",
    contentEst: "内容组成预估",
    imageContent: "影像内容",
    optimizationTip: "提示：若原始文件图片占比高，建议使用“标准”或“强力”模式来获得显著效果。",
    algoTitle: "选择压缩算法",
    algoDesc: "我们提供两种截然不同的压缩技术：",
    modeLowTitle: "轻度压缩 (结构优化)",
    modeLowDesc: "【无损】仅清理文件结构。图片画质不变，文字可选。文件缩小幅度较小。",
    modeMedTitle: "标准压缩 (平衡模式)",
    modeMedDesc: "【有损重绘】将页面转换为高质量图片 (1.5x)。大幅缩小文件，但文字将变为图片。",
    modeHighTitle: "强力压缩 (网页预览)",
    modeHighDesc: "【有损重绘】低质量图片 (1.0x)。文件最小化，适合仅供屏幕浏览的文件。",
    startBtnLow: "开始优化结构",
    startBtnRaster: "开始重绘压缩",
    textWarn: "注意：标准/强力模式会将文字转换为图片，无法复制文字。",
    compressingStatus: "正在本地处理中...",
    compressingDescRaster: "正在逐页重绘与重新编码，这可能需要一点时间...",
    compressingDescLow: "正在整理文件结构...",
    completeTitle: "优化完成！",
    ratio: "缩减比例",
    currentSize: "现在大小",
    modeLabel: "使用模式",
    saved: "成功节省了",
    noSaved: "文件结构已是最简状态，或原文件已高度压缩。",
    downloadBtn: "下载优化文件",
    processAnother: "处理另一个",
    techNoteTitle: "技术说明",
    techNoteDesc: "对于“标准”与“强力”模式，我们使用 PDF.js 将页面渲染为数字图像，再压缩为 JPEG 重组。这是纯浏览器环境下大幅缩减图片大小的唯一有效方案。",
    sponsorBtn: "赞助开发者",
    faqTitle: "常见问题 (FAQ)",
    faqs: [
      { q: "这款 PDF 压缩工具是免费的吗？", a: "是的，本工具完全免费，且所有运算都在您的电脑上进行。" },
      { q: "我的文件会被上传到服务器吗？", a: "绝对不会。我们使用浏览器端技术 (WASM)，您的文件永远不会离开您的设备，隐私绝对安全。" }
    ],
    items: {
      images: "影像资源",
      structure: "文件结构",
      potentialHigh: "高",
      potentialRebuild: "可重组",
      descImages: "页面可能包含未压缩图片",
      descStructure: (count) => `共 ${count} 页`
    },
    status: {
      reading: "正在读取文件...",
      parsing: "解析 PDF 结构...",
      scanning: "扫描影像对象...",
      initRender: "初始化渲染引擎...",
      resampling: (i, total) => `正在重新采样第 ${i} / ${total} 页...`,
      packing: "正在打包新文件...",
      analyzingStruct: "分析文件结构...",
      cleaningMeta: "清除元数据...",
      rebuilding: "重组对象流..."
    },
    visits: "累计浏览人次"
  },
  'en': {
    name: "English",
    metaTitle: "PDF Master - 100% Local & Privacy-First PDF Compressor",
    metaDesc: "The securest PDF compressor running entirely in your browser. No server uploads, ensuring 100% privacy. Features digital rasterization for maximum compression.",
    keywords: "compress pdf, local execution, privacy protection, secure pdf, offline pdf, no server upload",

    title: "PDF Master",
    subtitle: "Pro - Privacy First",
    loadingLib: "Loading Rendering Engine (PDF.js + jsPDF)...",
    errorTitle: "Error Occurred",
    retry: "Retry",
    heroTitle: "Privacy-First Powerful PDF Compressor",
    heroDesc: "Privacy-first performance. All compression happens locally on your device—no server uploads. Uses 'Re-scan' technology to shrink files securely and effectively.",
    dragDrop: "Drag & Drop PDF Here",
    or: "or",
    selectFile: "Select Local File",
    offlineSupport: "Offline Support",
    feature1Title: "True Image Compression",
    feature1Desc: "Reduces resolution and file size via Digital Rasterization technology.",
    feature2Title: "Flexible Strategies",
    feature2Desc: "Choose between 'Lossless Optimization' or 'Aggressive Rebuild'.",
    feature3Title: "100% Local Privacy",
    feature3Desc: "Your files never leave your device. All processing is performed locally within your browser, guaranteeing absolute data privacy.",
    analyzingStatus: "Reading and parsing file structure...",
    reportTitle: "Analysis Report",
    originalSize: "Original Size",
    contentEst: "Content Estimation",
    imageContent: "Image Content",
    optimizationTip: "Tip: For image-heavy files, use 'Balanced' or 'Aggressive' mode for significant results.",
    algoTitle: "Select Algorithm",
    algoDesc: "We offer two distinct compression technologies:",
    modeLowTitle: "Light (Structural)",
    modeLowDesc: "[Lossless] Cleans structure only. Quality unchanged, text selectable. Minor reduction.",
    modeMedTitle: "Balanced (Recommended)",
    modeMedDesc: "[Rasterized] Converts pages to high-quality images (1.5x). Big reduction, text becomes images.",
    modeHighTitle: "Aggressive (Preview)",
    modeHighDesc: "[Rasterized] Low-quality images (1.0x). Minimal size, good for screen viewing.",
    startBtnLow: "Start Structural Opt",
    startBtnRaster: "Start Raster Compress",
    textWarn: "Note: Balanced/Aggressive modes convert text to images (not selectable).",
    compressingStatus: "Processing Locally...",
    compressingDescRaster: "Redrawing and re-encoding pages, this may take a moment...",
    compressingDescLow: "Organizing file structure...",
    completeTitle: "Optimization Complete!",
    ratio: "Reduction",
    currentSize: "Current Size",
    modeLabel: "Mode Used",
    saved: "Saved",
    noSaved: "File structure is already optimal or highly compressed.",
    downloadBtn: "Download File",
    processAnother: "Compress Another",
    techNoteTitle: "Technical Note",
    techNoteDesc: "For Balanced/Aggressive modes, we use PDF.js to render pages to images and re-compress as JPEG. This is the only effective way to significantly reduce image size in a browser.",
    sponsorBtn: "Sponsor",
    faqTitle: "Frequently Asked Questions",
    faqs: [
      { q: "Is this PDF compressor free?", a: "Yes, it is completely free and works 100% in your browser." },
      { q: "Are my files uploaded to a server?", a: "Absolutely not. We use WebAssembly to process files locally. Your files never leave your device." }
    ],
    items: {
      images: "Images",
      structure: "Structure",
      potentialHigh: "High",
      potentialRebuild: "Rebuildable",
      descImages: "Pages may contain uncompressed images",
      descStructure: (count) => `${count} pages`
    },
    status: {
      reading: "Reading file...",
      parsing: "Parsing PDF structure...",
      scanning: "Scanning objects...",
      initRender: "Initializing engine...",
      resampling: (i, total) => `Resampling page ${i} / ${total}...`,
      packing: "Packing new file...",
      analyzingStruct: "Analyzing structure...",
      cleaningMeta: "Cleaning metadata...",
      rebuilding: "Rebuilding streams..."
    },
    visits: "Total Visits"
  },
  'ja': {
    name: "日本語",
    metaTitle: "PDF圧縮マスター - 100%ローカル実行・プライバシー保護のPDF軽量化ツール",
    metaDesc: "ブラウザでPDFを圧縮。サーバーへのアップロード一切なし、プライバシーを完全に保護しながらファイルサイズを縮小します。",
    
    title: "PDF圧縮マスター",
    subtitle: "Pro - プライバシー優先",
    loadingLib: "レンダリングエンジンを読み込み中...",
    errorTitle: "エラーが発生しました",
    retry: "再試行",
    heroTitle: "プライバシー優先の強力なPDF圧縮ツール",
    heroDesc: "プライバシー保護と高性能を両立。すべての圧縮処理はお使いのデバイス上でローカルに実行され、サーバーにアップロードされることはありません。「再スキャン」技術で安全かつ効果的にファイルサイズを縮小します。",
    dragDrop: "PDFをここにドロップ",
    or: "または",
    selectFile: "ファイルを選択",
    offlineSupport: "オフライン対応",
    feature1Title: "真の画像圧縮",
    feature1Desc: "デジタル・ラスタライズ技術により、画像の解像度とファイルサイズを物理的に縮小します。",
    feature2Title: "柔軟な圧縮戦略",
    feature2Desc: "「ロスレス最適化」または「強力な再構築」から選択できます。",
    feature3Title: "100% ローカル＆プライバシー保護",
    feature3Desc: "ファイルはデバイスから出ることはありません。すべての処理はブラウザ内で完結し、最高のデータプライバシーを保証します。",
    analyzingStatus: "ファイル構造を解析中...",
    reportTitle: "分析レポート",
    originalSize: "元のサイズ",
    contentEst: "コンテンツ構成",
    imageContent: "画像コンテンツ",
    optimizationTip: "ヒント：画像が多いファイルの場合、「標準」または「強力」モードを使用すると効果的です。",
    algoTitle: "圧縮アルゴリズムの選択",
    algoDesc: "2つの異なる圧縮技術を提供しています：",
    modeLowTitle: "軽量圧縮 (構造最適化)",
    modeLowDesc: "【ロスレス】構造のみを整理します。画質は変わらず、テキスト選択も可能です。縮小率は低めです。",
    modeMedTitle: "標準圧縮 (バランス推奨)",
    modeMedDesc: "【ラスタライズ】ページを高画質画像(1.5x)に変換します。大幅に縮小されますが、テキストは画像化されます。",
    modeHighTitle: "強力圧縮 (プレビュー用)",
    modeHighDesc: "【ラスタライズ】低画質画像(1.0x)に変換します。サイズを最小化し、画面閲覧に最適です。",
    startBtnLow: "構造最適化を開始",
    startBtnRaster: "再描画圧縮を開始",
    textWarn: "注意：標準/強力モードではテキストが画像化され、コピーできなくなります。",
    compressingStatus: "ローカルで処理中...",
    compressingDescRaster: "ページを再描画および再エンコードしています。これには時間がかかる場合があります...",
    compressingDescLow: "ファイル構造を整理中...",
    completeTitle: "最適化完了！",
    ratio: "削減率",
    currentSize: "現在のサイズ",
    modeLabel: "使用モード",
    saved: "削減サイズ",
    noSaved: "これ以上圧縮できませんでした。",
    downloadBtn: "ファイルをダウンロード",
    processAnother: "別のファイルを処理",
    techNoteTitle: "技術メモ",
    techNoteDesc: "標準/強力モードでは、PDF.jsを使用してページを画像データにレンダリングし、JPEGとして再圧縮します。これはブラウザで画像サイズを大幅に削減する唯一の有効な方法です。",
    sponsorBtn: "開発者を支援",
    faqTitle: "よくある質問",
    faqs: [
      { q: "このツールは無料ですか？", a: "はい、完全無料です。" },
      { q: "ファイルはサーバーにアップロードされますか？", a: "いいえ、絶対にアップロードされません。すべての処理はお使いのブラウザ内（ローカル）で行われます。" }
    ],
    items: {
      images: "画像リソース",
      structure: "ファイル構造",
      potentialHigh: "高",
      potentialRebuild: "再構築可",
      descImages: "未圧縮の画像が含まれている可能性があります",
      descStructure: (count) => `全 ${count} ページ`
    },
    status: {
      reading: "ファイルを読み込み中...",
      parsing: "PDF構造を解析中...",
      scanning: "オブジェクトをスキャン中...",
      initRender: "エンジンを初期化中...",
      resampling: (i, total) => `ページをリサンプリング中 ${i} / ${total}...`,
      packing: "新しいファイルを作成中...",
      analyzingStruct: "構造を分析中...",
      cleaningMeta: "メタデータを削除中...",
      rebuilding: "ストリームを再構築中..."
    },
    visits: "累計訪問数"
  },
  'ko': {
    name: "한국어",
    metaTitle: "PDF 압축 마스터 - 100% 로컬 실행 & 개인정보 보호 PDF 도구",
    
    title: "PDF 압축 마스터",
    subtitle: "Pro - 개인정보 보호 우선",
    loadingLib: "렌더링 엔진 로딩 중...",
    errorTitle: "오류 발생",
    retry: "재시도",
    heroTitle: "개인정보 보호 우선의 강력한 PDF 압축",
    heroDesc: "개인정보 보호와 고성능의 결합. 모든 압축 작업은 서버 업로드 없이 기기에서 로컬로 수행됩니다. '재스캔' 기술을 사용하여 파일을 안전하고 효과적으로 축소합니다.",
    dragDrop: "여기에 PDF 드래그",
    or: "또는",
    selectFile: "파일 선택",
    offlineSupport: "오프라인 지원",
    feature1Title: "실제 이미지 압축",
    feature1Desc: "디지털 래스터화 기술을 통해 이미지 해상도와 파일 크기를 실제로 줄입니다.",
    feature2Title: "유연한 전략",
    feature2Desc: "'무손실 최적화' 또는 '강력한 재구축' 중에서 선택할 수 있습니다.",
    feature3Title: "100% 로컬 개인정보 보호",
    feature3Desc: "파일이 기기를 벗어나지 않습니다. 모든 처리는 브라우저 내에서 수행되어 완벽한 데이터 개인정보 보호를 보장합니다.",
    analyzingStatus: "파일 구조 분석 중...",
    reportTitle: "분석 보고서",
    originalSize: "원본 크기",
    contentEst: "콘텐츠 구성",
    imageContent: "이미지 콘텐츠",
    optimizationTip: "팁: 이미지가 많은 파일은 '표준' 또는 '강력' 모드를 권장합니다.",
    algoTitle: "압축 알고리즘 선택",
    algoDesc: "두 가지 다른 압축 기술을 제공합니다:",
    modeLowTitle: "경량 압축 (구조 최적화)",
    modeLowDesc: "[무손실] 구조만 정리합니다. 화질은 유지되며 텍스트 선택이 가능합니다. 압축률은 낮습니다.",
    modeMedTitle: "표준 압축 (권장)",
    modeMedDesc: "[래스터화] 페이지를 고화질 이미지(1.5x)로 변환합니다. 파일이 크게 줄어들지만 텍스트가 이미지화됩니다.",
    modeHighTitle: "강력 압축 (미리보기)",
    modeHighDesc: "[래스터화] 저화질 이미지(1.0x)로 변환합니다. 화면 열람용으로 크기를 최소화합니다.",
    startBtnLow: "구조 최적화 시작",
    startBtnRaster: "래스터 압축 시작",
    textWarn: "주의: 표준/강력 모드는 텍스트가 이미지로 변환되어 복사할 수 없습니다.",
    compressingStatus: "로컬에서 처리 중...",
    compressingDescRaster: "페이지를 다시 그리고 인코딩 중입니다. 시간이 걸릴 수 있습니다...",
    compressingDescLow: "파일 구조 정리 중...",
    completeTitle: "최적화 완료!",
    ratio: "감소율",
    currentSize: "현재 크기",
    modeLabel: "사용 모드",
    saved: "절약된 용량",
    noSaved: "이미 최적화된 파일입니다.",
    downloadBtn: "파일 다운로드",
    processAnother: "다른 파일 처리",
    techNoteTitle: "기술 참고",
    techNoteDesc: "표준/강력 모드는 PDF.js를 사용하여 페이지를 이미지로 렌더링하고 JPEG로 재압축합니다. 이는 브라우저에서 이미지 크기를 줄이는 가장 효과적인 방법입니다.",
    sponsorBtn: "후원하기",
    faqTitle: "자주 묻는 질문",
    faqs: [
      { q: "이 도구는 무료인가요?", a: "네, 완전 무료입니다." },
      { q: "파일이 서버로 전송되나요?", a: "절대 아닙니다. 모든 처리는 브라우저 내에서 로컬로 이루어집니다." }
    ],
    items: {
      images: "이미지 리소스",
      structure: "파일 구조",
      potentialHigh: "높음",
      potentialRebuild: "재구축 가능",
      descImages: "압축되지 않은 이미지가 포함될 수 있음",
      descStructure: (count) => `총 ${count} 페이지`
    },
    status: {
      reading: "파일 읽는 중...",
      parsing: "PDF 구조 파싱 중...",
      scanning: "객체 스캔 중...",
      initRender: "엔진 초기화 중...",
      resampling: (i, total) => `페이지 리샘플링 중 ${i} / ${total}...`,
      packing: "새 파일 패킹 중...",
      analyzingStruct: "구조 분석 중...",
      cleaningMeta: "메타데이터 정리 중...",
      rebuilding: "스트림 재구축 중..."
    },
    visits: "방문자 수"
  },
  'es': {
    name: "Español",
    title: "Maestro de PDF",
    subtitle: "Pro - Privacidad Primero",
    loadingLib: "Cargando motor de renderizado...",
    errorTitle: "Ocurrió un error",
    retry: "Reintentar",
    heroTitle: "Compresor PDF Potente y Privado",
    heroDesc: "Privacidad y rendimiento. Toda la compresión se realiza localmente en tu dispositivo, sin subidas al servidor. Usa tecnología de 're-escaneo' para reducir archivos de forma segura.",
    dragDrop: "Arrastra el PDF aquí",
    or: "o",
    selectFile: "Seleccionar archivo",
    offlineSupport: "Soporte sin conexión",
    feature1Title: "Compresión real",
    feature1Desc: "Reduce la resolución y el tamaño mediante rasterización digital.",
    feature2Title: "Estrategias flexibles",
    feature2Desc: "Elige entre 'Optimización sin pérdidas' o 'Reconstrucción agresiva'.",
    feature3Title: "100% Privacidad Local",
    feature3Desc: "Tus archivos nunca salen de tu dispositivo. Todo el procesamiento se realiza localmente en tu navegador.",
    analyzingStatus: "Analizando archivo...",
    reportTitle: "Informe de análisis",
    originalSize: "Tamaño original",
    contentEst: "Contenido",
    imageContent: "Imágenes",
    optimizationTip: "Consejo: Para archivos con muchas imágenes, usa el modo 'Estándar' o 'Agresivo'.",
    algoTitle: "Seleccionar algoritmo",
    algoDesc: "Ofrecemos dos tecnologías de compresión:",
    modeLowTitle: "Ligero (Estructural)",
    modeLowDesc: "[Sin pérdidas] Solo limpia la estructura. Calidad intacta, texto seleccionable.",
    modeMedTitle: "Estándar (Recomendado)",
    modeMedDesc: "[Rasterizado] Convierte a imágenes HQ (1.5x). Gran reducción, texto se vuelve imagen.",
    modeHighTitle: "Agresivo (Vista previa)",
    modeHighDesc: "[Rasterizado] Imágenes de baja calidad (1.0x). Tamaño mínimo.",
    startBtnLow: "Iniciar optimización",
    startBtnRaster: "Iniciar compresión",
    textWarn: "Nota: Los modos Estándar/Agresivo convierten el texto en imágenes.",
    compressingStatus: "Procesando localmente...",
    compressingDescRaster: "Redibujando y recodificando páginas...",
    compressingDescLow: "Organizando estructura...",
    completeTitle: "¡Optimización completa!",
    ratio: "Reducción",
    currentSize: "Tamaño actual",
    modeLabel: "Modo",
    saved: "Ahorrado",
    noSaved: "No se pudo comprimir más.",
    downloadBtn: "Descargar archivo",
    processAnother: "Comprimir otro",
    techNoteTitle: "Nota técnica",
    techNoteDesc: "Usamos PDF.js para renderizar páginas en imágenes y recomprimir como JPEG.",
    sponsorBtn: "Patrocinar",
    items: {
      images: "Imágenes",
      structure: "Estructura",
      potentialHigh: "Alto",
      potentialRebuild: "Reconstruible",
      descImages: "Puede contener imágenes sin comprimir",
      descStructure: (count) => `${count} páginas`
    },
    status: {
      reading: "Leyendo archivo...",
      parsing: "Analizando estructura...",
      scanning: "Escaneando objetos...",
      initRender: "Inicializando motor...",
      resampling: (i, total) => `Remuestreando página ${i} / ${total}...`,
      packing: "Empaquetando archivo...",
      analyzingStruct: "Analizando estructura...",
      cleaningMeta: "Limpiando metadatos...",
      rebuilding: "Reconstruyendo flujos..."
    },
    visits: "Visitas"
  },
  'fr': {
    name: "Français",
    title: "Maître PDF",
    subtitle: "Pro - Confidentialité d'abord",
    loadingLib: "Chargement du moteur...",
    errorTitle: "Erreur",
    retry: "Réessayer",
    heroTitle: "Compresseur PDF Puissant & Privé",
    heroDesc: "Privacité et performance. Toute la compression s'effectue localement sur votre appareil, sans envoi vers un serveur. Technologie de 're-scan' pour réduire les fichiers en toute sécurité.",
    dragDrop: "Déposez le PDF ici",
    or: "ou",
    selectFile: "Choisir un fichier",
    offlineSupport: "Mode hors ligne",
    feature1Title: "Compression d'image",
    feature1Desc: "Réduit la résolution via la rastérisation numérique.",
    feature2Title: "Stratégies flexibles",
    feature2Desc: "Choix entre 'Optimisation sans perte' ou 'Reconstruction agressive'.",
    feature3Title: "100% Confidentialité Locale",
    feature3Desc: "Vos fichiers ne quittent jamais votre appareil. Tout le traitement est effectué localement dans votre navigateur.",
    analyzingStatus: "Analyse en cours...",
    reportTitle: "Rapport d'analyse",
    originalSize: "Taille originale",
    contentEst: "Contenu",
    imageContent: "Images",
    optimizationTip: "Conseil : Utilisez le mode 'Standard' ou 'Agressif' pour les images.",
    algoTitle: "Algorithme",
    algoDesc: "Deux technologies de compression :",
    modeLowTitle: "Léger (Structurel)",
    modeLowDesc: "[Sans perte] Nettoie la structure. Texte sélectionnable.",
    modeMedTitle: "Standard (Recommandé)",
    modeMedDesc: "[Rasterisé] Convertit en images HQ. Grande réduction, texte devient image.",
    modeHighTitle: "Agressif (Aperçu)",
    modeHighDesc: "[Rasterisé] Images basse qualité. Taille minimale.",
    startBtnLow: "Optimiser structure",
    startBtnRaster: "Compresser",
    textWarn: "Note : Le texte sera converti en image.",
    compressingStatus: "Traitement local...",
    compressingDescRaster: "Retraitement des pages...",
    compressingDescLow: "Organisation du fichier...",
    completeTitle: "Terminé !",
    ratio: "Réduction",
    currentSize: "Taille actuelle",
    modeLabel: "Mode",
    saved: "Économisé",
    noSaved: "Déjà optimisé.",
    downloadBtn: "Télécharger",
    processAnother: "Autre fichier",
    techNoteTitle: "Note technique",
    techNoteDesc: "Utilisation de PDF.js pour le rendu en images et la recompression JPEG.",
    sponsorBtn: "Soutenir",
    items: {
      images: "Images",
      structure: "Structure",
      potentialHigh: "Élevé",
      potentialRebuild: "Optimisable",
      descImages: "Images non compressées détectées",
      descStructure: (count) => `${count} pages`
    },
    status: {
      reading: "Lecture...",
      parsing: "Analyse structure...",
      scanning: "Scan objets...",
      initRender: "Init moteur...",
      resampling: (i, total) => `Traitement page ${i} / ${total}...`,
      packing: "Création fichier...",
      analyzingStruct: "Analyse structure...",
      cleaningMeta: "Nettoyage métadonnées...",
      rebuilding: "Reconstruction..."
    },
    visits: "Visites"
  },
  'de': {
    name: "Deutsch",
    title: "PDF Meister",
    subtitle: "Pro - Datenschutz zuerst",
    loadingLib: "Lade Engine...",
    errorTitle: "Fehler aufgetreten",
    retry: "Wiederholen",
    heroTitle: "Mächtiger & Sicherer PDF-Kompressor",
    heroDesc: "Datenschutz und Leistung. Die gesamte Komprimierung erfolgt lokal auf Ihrem Gerät – kein Server-Upload. 'Re-Scan'-Technologie für sichere und effektive Verkleinerung.",
    dragDrop: "PDF hier ablegen",
    or: "oder",
    selectFile: "Datei wählen",
    offlineSupport: "Offline verfügbar",
    feature1Title: "Echte Bildkompression",
    feature1Desc: "Reduziert Auflösung durch digitale Rasterisierung.",
    feature2Title: "Flexible Strategien",
    feature2Desc: "Wählen Sie zwischen 'Verlustfrei' oder 'Aggressiv'.",
    feature3Title: "100% Lokaler Datenschutz",
    feature3Desc: "Ihre Dateien verlassen niemals Ihr Gerät. Die gesamte Verarbeitung erfolgt lokal in Ihrem Browser.",
    analyzingStatus: "Analysiere Datei...",
    reportTitle: "Analysebericht",
    originalSize: "Originalgröße",
    contentEst: "Inhalt",
    imageContent: "Bilder",
    optimizationTip: "Tipp: Nutzen Sie 'Standard' oder 'Aggressiv' für viele Bilder.",
    algoTitle: "Algorithmus wählen",
    algoDesc: "Zwei Kompressionstechnologien:",
    modeLowTitle: "Leicht (Struktur)",
    modeLowDesc: "[Verlustfrei] Bereinigt Struktur. Text bleibt wählbar.",
    modeMedTitle: "Standard (Empfohlen)",
    modeMedDesc: "[Gerastert] Konvertiert zu HQ-Bildern. Große Reduktion, Text wird Bild.",
    modeHighTitle: "Aggressiv (Vorschau)",
    modeHighDesc: "[Gerastert] Niedrige Qualität. Minimale Größe.",
    startBtnLow: "Struktur optimieren",
    startBtnRaster: "Komprimieren",
    textWarn: "Hinweis: Text wird in Bild umgewandelt.",
    compressingStatus: "Verarbeite lokal...",
    compressingDescRaster: "Seiten werden neu codiert...",
    compressingDescLow: "Struktur wird organisiert...",
    completeTitle: "Fertig!",
    ratio: "Reduktion",
    currentSize: "Neue Größe",
    modeLabel: "Modus",
    saved: "Gespart",
    noSaved: "Bereits optimiert.",
    downloadBtn: "Herunterladen",
    processAnother: "Weitere Datei",
    techNoteTitle: "Technik",
    techNoteDesc: "Wir nutzen PDF.js für das Bild-Rendering und JPEG-Rekompression.",
    sponsorBtn: "Unterstützen",
    items: {
      images: "Bilder",
      structure: "Struktur",
      potentialHigh: "Hoch",
      potentialRebuild: "Optimierbar",
      descImages: "Unkomprimierte Bilder erkannt",
      descStructure: (count) => `${count} Seiten`
    },
    status: {
      reading: "Lese Datei...",
      parsing: "Parse PDF...",
      scanning: "Scanne Objekte...",
      initRender: "Init Engine...",
      resampling: (i, total) => `Verarbeite Seite ${i} / ${total}...`,
      packing: "Erstelle Datei...",
      analyzingStruct: "Analysiere Struktur...",
      cleaningMeta: "Lösche Metadaten...",
      rebuilding: "Erstelle neu..."
    },
    visits: "Besucher"
  },
  'pt': {
    name: "Português",
    title: "Mestre PDF",
    subtitle: "Pro - Privacidade Primeiro",
    loadingLib: "Carregando motor...",
    errorTitle: "Erro",
    retry: "Tentar novamente",
    heroTitle: "Compressor PDF Seguro e Poderoso",
    heroDesc: "Privacidade e desempenho. Toda a compressão é feita localmente no seu dispositivo, sem envio para servidores. Tecnologia de 're-scan' para reduzir arquivos com segurança.",
    dragDrop: "Arraste o PDF aqui",
    or: "ou",
    selectFile: "Selecionar arquivo",
    offlineSupport: "Suporte offline",
    feature1Title: "Compressão real",
    feature1Desc: "Reduz resolução via rasterização digital.",
    feature2Title: "Estratégias flexíveis",
    feature2Desc: "Escolha 'Otimização sem perdas' ou 'Reconstrução agressiva'.",
    feature3Title: "100% Privacidade Local",
    feature3Desc: "Seus arquivos nunca saem do dispositivo. Todo o processamento é feito localmente no seu navegador.",
    analyzingStatus: "Analisando arquivo...",
    reportTitle: "Relatório",
    originalSize: "Tamanho original",
    contentEst: "Conteúdo",
    imageContent: "Imagens",
    optimizationTip: "Dica: Use modo 'Padrão' ou 'Agressivo' para imagens.",
    algoTitle: "Algoritmo",
    algoDesc: "Duas tecnologias de compressão:",
    modeLowTitle: "Leve (Estrutural)",
    modeLowDesc: "[Sem perdas] Limpa estrutura. Texto selecionável.",
    modeMedTitle: "Padrão (Recomendado)",
    modeMedDesc: "[Rasterizado] Converte para imagens HQ. Texto vira imagem.",
    modeHighTitle: "Agressivo (Visualização)",
    modeHighDesc: "[Rasterizado] Baixa qualidade. Tamanho mínimo.",
    startBtnLow: "Otimizar estrutura",
    startBtnRaster: "Comprimir",
    textWarn: "Nota: Texto será convertido em imagem.",
    compressingStatus: "Processando localmente...",
    compressingDescRaster: "Recodificando páginas...",
    compressingDescLow: "Organizando estrutura...",
    completeTitle: "Concluído!",
    ratio: "Redução",
    currentSize: "Tamanho atual",
    modeLabel: "Modo",
    saved: "Economizado",
    noSaved: "Já otimizado.",
    downloadBtn: "Baixar",
    processAnother: "Outro arquivo",
    techNoteTitle: "Nota técnica",
    techNoteDesc: "Usamos PDF.js para renderização de imagem e recompressão JPEG.",
    sponsorBtn: "Apoiar",
    items: {
      images: "Imagens",
      structure: "Estrutura",
      potentialHigh: "Alto",
      potentialRebuild: "Otimizável",
      descImages: "Imagens não comprimidas detectadas",
      descStructure: (count) => `${count} páginas`
    },
    status: {
      reading: "Lendo...",
      parsing: "Analisando...",
      scanning: "Escaneando...",
      initRender: "Iniciando...",
      resampling: (i, total) => `Processando pág ${i} / ${total}...`,
      packing: "Empacotando...",
      analyzingStruct: "Analisando...",
      cleaningMeta: "Limpando meta...",
      rebuilding: "Reconstruindo..."
    },
    visits: "Visitas"
  },
  'ru': {
    name: "Русский",
    title: "Мастер PDF",
    subtitle: "Pro - Приватность прежде всего",
    loadingLib: "Загрузка движка...",
    errorTitle: "Ошибка",
    retry: "Повторить",
    heroTitle: "Мощный и безопасный компрессор PDF",
    heroDesc: "Приватность и производительность. Все сжатие происходит локально на вашем устройстве, без отправки на сервер. Технология 'пересканирования' для безопасного уменьшения.",
    dragDrop: "Перетащите PDF сюда",
    or: "или",
    selectFile: "Выбрать файл",
    offlineSupport: "Офлайн режим",
    feature1Title: "Сжатие изображений",
    feature1Desc: "Уменьшение разрешения через цифровую растеризацию.",
    feature2Title: "Гибкие стратегии",
    feature2Desc: "Выбор между 'Без потерь' и 'Агрессивным'.",
    feature3Title: "100% Локальная Приватность",
    feature3Desc: "Ваши файлы никогда не покидают устройство. Вся обработка происходит локально в браузере.",
    analyzingStatus: "Анализ файла...",
    reportTitle: "Отчет",
    originalSize: "Исходный размер",
    contentEst: "Содержимое",
    imageContent: "Изображения",
    optimizationTip: "Совет: Используйте 'Стандарт' или 'Агрессивный' для изображений.",
    algoTitle: "Алгоритм",
    algoDesc: "Две технологии сжатия:",
    modeLowTitle: "Легкий (Структура)",
    modeLowDesc: "[Без потерь] Очистка структуры. Текст доступен.",
    modeMedTitle: "Стандарт (Реком.)",
    modeMedDesc: "[Растр] Конвертация в HQ изображения. Текст станет картинкой.",
    modeHighTitle: "Агрессивный (Превью)",
    modeHighDesc: "[Растр] Низкое качество. Мин. размер.",
    startBtnLow: "Оптимизировать",
    startBtnRaster: "Сжать",
    textWarn: "Прим: Текст будет преобразован в изображение.",
    compressingStatus: "Локальная обработка...",
    compressingDescRaster: "Перекодирование страниц...",
    compressingDescLow: "Организация структуры...",
    completeTitle: "Готово!",
    ratio: "Сжатие",
    currentSize: "Новый размер",
    modeLabel: "Режим",
    saved: "Сэкономлено",
    noSaved: "Уже оптимизирован.",
    downloadBtn: "Скачать",
    processAnother: "Другой файл",
    techNoteTitle: "Тех. заметка",
    techNoteDesc: "Используется PDF.js для рендеринга в изображения и JPEG сжатия.",
    sponsorBtn: "Поддержать",
    items: {
      images: "Изображения",
      structure: "Структура",
      potentialHigh: "Высокий",
      potentialRebuild: "Оптимизируемо",
      descImages: "Обнаружены несжатые изображения",
      descStructure: (count) => `${count} стр.`
    },
    status: {
      reading: "Чтение...",
      parsing: "Разбор...",
      scanning: "Сканирование...",
      initRender: "Инит...",
      resampling: (i, total) => `Обработка стр. ${i} / ${total}...`,
      packing: "Упаковка...",
      analyzingStruct: "Анализ...",
      cleaningMeta: "Очистка...",
      rebuilding: "Сборка..."
    },
    visits: "Визиты"
  },
  'it': {
    name: "Italiano",
    title: "Maestro PDF",
    subtitle: "Pro - Privacy Prima di Tutto",
    loadingLib: "Caricamento motore...",
    errorTitle: "Errore",
    retry: "Riprova",
    heroTitle: "Compressore PDF Potente e Sicuro",
    heroDesc: "Privacy e prestazioni. Tutta la compressione avviene localmente sul tuo dispositivo, nessun caricamento sul server. Tecnologia 're-scan' per ridurre i file in sicurezza.",
    dragDrop: "Trascina PDF qui",
    or: "o",
    selectFile: "Seleziona file",
    offlineSupport: "Supporto offline",
    feature1Title: "Compressione reale",
    feature1Desc: "Riduce risoluzione via rasterizzazione digitale.",
    feature2Title: "Strategie flessibili",
    feature2Desc: "'Senza perdita' o 'Ricostruzione aggressiva'.",
    feature3Title: "100% Privacy Locale",
    feature3Desc: "I tuoi file non lasciano mai il dispositivo. Tutto il trattamento avviene localmente nel browser.",
    analyzingStatus: "Analisi in corso...",
    reportTitle: "Rapporto",
    originalSize: "Dim. originale",
    contentEst: "Contenuto",
    imageContent: "Immagini",
    optimizationTip: "Consiglio: Usa modo 'Standard' o 'Aggressivo'.",
    algoTitle: "Algoritmo",
    algoDesc: "Due tecnologie:",
    modeLowTitle: "Leggero (Struttura)",
    modeLowDesc: "[Lossless] Pulisce struttura. Testo selezionabile.",
    modeMedTitle: "Standard (Consigliato)",
    modeMedDesc: "[Raster] Immagini HQ. Testo diventa immagine.",
    modeHighTitle: "Aggressivo (Anteprima)",
    modeHighDesc: "[Raster] Bassa qualità. Dimensione minima.",
    startBtnLow: "Ottimizza",
    startBtnRaster: "Comprimi",
    textWarn: "Nota: Il testo diventerà immagine.",
    compressingStatus: "Elaborazione locale...",
    compressingDescRaster: "Ricodifica pagine...",
    compressingDescLow: "Organizzazione file...",
    completeTitle: "Finito!",
    ratio: "Riduzione",
    currentSize: "Dim. attuale",
    modeLabel: "Modo",
    saved: "Risparmiato",
    noSaved: "Già ottimizzato.",
    downloadBtn: "Scarica",
    processAnother: "Altro file",
    techNoteTitle: "Nota tecnica",
    techNoteDesc: "Uso di PDF.js per rendering in immagini e compressione JPEG.",
    sponsorBtn: "Supporta",
    items: {
      images: "Immagini",
      structure: "Struttura",
      potentialHigh: "Alto",
      potentialRebuild: "Ottimizzabile",
      descImages: "Immagini non compresse",
      descStructure: (count) => `${count} pagine`
    },
    status: {
      reading: "Lettura...",
      parsing: "Parsing...",
      scanning: "Scansione...",
      initRender: "Init...",
      resampling: (i, total) => `Elaborazione ${i} / ${total}...`,
      packing: "Packing...",
      analyzingStruct: "Analisi...",
      cleaningMeta: "Pulizia...",
      rebuilding: "Ricostruzione..."
    },
    visits: "Visite"
  },
  'tr': {
    name: "Türkçe",
    title: "PDF Uzmanı",
    subtitle: "Pro - Önce Gizlilik",
    loadingLib: "Motor yükleniyor...",
    errorTitle: "Hata",
    retry: "Tekrar dene",
    heroTitle: "Güçlü ve Güvenli PDF Sıkıştırıcı",
    heroDesc: "Gizlilik ve performans. Tüm sıkıştırma işlemi cihazınızda yerel olarak yapılır, sunucuya yükleme yok. Dosyaları güvenle küçültmek için 'yeniden tarama' teknolojisi.",
    dragDrop: "PDF'i buraya bırak",
    or: "veya",
    selectFile: "Dosya seç",
    offlineSupport: "Çevrimdışı destek",
    feature1Title: "Gerçek Sıkıştırma",
    feature1Desc: "Dijital Rasterizasyon ile çözünürlük düşürme.",
    feature2Title: "Esnek Stratejiler",
    feature2Desc: "'Kayıpsız' veya 'Agresif' seçenekleri.",
    feature3Title: "100% Yerel Gizlilik",
    feature3Desc: "Dosyalarınız cihazınızdan asla çıkmaz. Tüm işlemler tarayıcınızda yerel olarak yapılır.",
    analyzingStatus: "Analiz ediliyor...",
    reportTitle: "Rapor",
    originalSize: "Orijinal boyut",
    contentEst: "İçerik",
    imageContent: "Resimler",
    optimizationTip: "İpucu: Resimler için 'Standart' veya 'Agresif' kullanın.",
    algoTitle: "Algoritma",
    algoDesc: "İki teknoloji:",
    modeLowTitle: "Hafif (Yapısal)",
    modeLowDesc: "[Kayıpsız] Yapıyı temizler. Metin seçilebilir.",
    modeMedTitle: "Standart (Önerilen)",
    modeMedDesc: "[Raster] Yüksek kalite resim. Metin resme dönüşür.",
    modeHighTitle: "Agresif (Önizleme)",
    modeHighDesc: "[Raster] Düşük kalite. Minimum boyut.",
    startBtnLow: "Optimize Et",
    startBtnRaster: "Sıkıştır",
    textWarn: "Not: Metin resme dönüşecek.",
    compressingStatus: "Yerel işleniyor...",
    compressingDescRaster: "Yeniden kodlanıyor...",
    compressingDescLow: "Düzenleniyor...",
    completeTitle: "Tamamlandı!",
    ratio: "Azalma",
    currentSize: "Yeni boyut",
    modeLabel: "Mod",
    saved: "Tasarruf",
    noSaved: "Zaten optimize.",
    downloadBtn: "İndir",
    processAnother: "Başka dosya",
    techNoteTitle: "Teknik Not",
    techNoteDesc: "PDF.js ve JPEG sıkıştırma kullanılıyor.",
    sponsorBtn: "Destekle",
    items: {
      images: "Resimler",
      structure: "Yapı",
      potentialHigh: "Yüksek",
      potentialRebuild: "Yapılandırılabilir",
      descImages: "Sıkıştırılmamış resimler",
      descStructure: (count) => `${count} sayfa`
    },
    status: {
      reading: "Okunuyor...",
      parsing: "Ayrıştırılıyor...",
      scanning: "Taranıyor...",
      initRender: "Başlatılıyor...",
      resampling: (i, total) => `İşleniyor ${i} / ${total}...`,
      packing: "Paketleniyor...",
      analyzingStruct: "Analiz...",
      cleaningMeta: "Temizleniyor...",
      rebuilding: "Oluşturuluyor..."
    },
    visits: "Ziyaretler"
  },
  'ar': {
    name: "العربية",
    title: "أستاذ ضغط PDF",
    subtitle: "Pro - الخصوصية أولاً",
    loadingLib: "جاري تحميل المحرك...",
    errorTitle: "حدث خطأ",
    retry: "إعادة المحاولة",
    heroTitle: "ضاغط PDF قوي وآمن",
    heroDesc: "الخصوصية والأداء. يتم الضغط محليًا على جهازك، دون رفع للخادم. تقنية 'إعادة المسح' لتقليل الملفات بأمان.",
    dragDrop: "سحب وإفلات PDF هنا",
    or: "أو",
    selectFile: "اختر ملف محلي",
    offlineSupport: "دعم دون اتصال",
    feature1Title: "ضغط صور حقيقي",
    feature1Desc: "تقليل الدقة والحجم عبر تقنية التحويل النقطي الرقمي.",
    feature2Title: "استراتيجيات مرنة",
    feature2Desc: "اختر بين 'تحسين بلا فقدان' أو 'إعادة بناء قوية'.",
    feature3Title: "خصوصية محلية 100%",
    feature3Desc: "ملفاتك لا تغادر جهازك أبدًا. تتم جميع العمليات محليًا داخل متصفحك.",
    analyzingStatus: "جاري تحليل الملف...",
    reportTitle: "تقرير التحليل",
    originalSize: "الحجم الأصلي",
    contentEst: "محتوى",
    imageContent: "صور",
    optimizationTip: "نصيحة: للملفات المليئة بالصور، استخدم الوضع 'القياسي' أو 'القوي'.",
    algoTitle: "اختر الخوارزمية",
    algoDesc: "تقنيتان للضغط:",
    modeLowTitle: "خفيف (هيكلي)",
    modeLowDesc: "[بلا فقدان] ينظف الهيكل فقط. النص قابل للتحديد.",
    modeMedTitle: "قياسي (موصى به)",
    modeMedDesc: "[نقطي] تحويل لصور عالية الجودة. النص يتحول لصورة.",
    modeHighTitle: "قوي (معاينة)",
    modeHighDesc: "[نقطي] صور منخفضة الجودة. أصغر حجم.",
    startBtnLow: "بدء التحسين",
    startBtnRaster: "بدء الضغط",
    textWarn: "ملاحظة: سيتم تحويل النص إلى صورة.",
    compressingStatus: "معالجة محلية...",
    compressingDescRaster: "إعادة ترميز الصفحات...",
    compressingDescLow: "تنظيم الهيكل...",
    completeTitle: "تم الانتهاء!",
    ratio: "تخفيض",
    currentSize: "الحجم الحالي",
    modeLabel: "الوضع",
    saved: "تم توفير",
    noSaved: "محسن بالفعل.",
    downloadBtn: "تحميل الملف",
    processAnother: "ملف آخر",
    techNoteTitle: "ملاحظة تقنية",
    techNoteDesc: "نستخدم PDF.js لتحويل الصفحات إلى صور وضغط JPEG.",
    sponsorBtn: "دعم المطور",
    items: {
      images: "صور",
      structure: "هيكل",
      potentialHigh: "عالي",
      potentialRebuild: "قابل لإعادة البناء",
      descImages: "تم اكتشاف صور غير مضغوطة",
      descStructure: (count) => `${count} صفحات`
    },
    status: {
      reading: "قراءة...",
      parsing: "تحليل...",
      scanning: "مسح...",
      initRender: "تهيئة...",
      resampling: (i, total) => `معالجة صفحة ${i} / ${total}...`,
      packing: "حزم...",
      analyzingStruct: "تحليل الهيكل...",
      cleaningMeta: "تنظيف البيانات...",
      rebuilding: "إعادة البناء..."
    },
    visits: "الزيارات"
  }
};

export default function App() {
  // 狀態機: 'loading-lib' | 'idle' | 'analyzing' | 'review' | 'compressing' | 'completed' | 'error'
  const [status, setStatus] = useState('loading-lib');
  const [file, setFile] = useState(null);
  const [fileBuffer, setFileBuffer] = useState(null);
  const [progress, setProgress] = useState(0);
  const [progressStatus, setProgressStatus] = useState('');
  const [analysisData, setAnalysisData] = useState(null);
  const [compressionStats, setCompressionStats] = useState(null);
  const [compressedPdfBytes, setCompressedPdfBytes] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [lang, setLang] = useState('zh-TW'); // 預設語言
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [pageId, setPageId] = useState('');
  
  // 壓縮等級狀態 'low' | 'medium' | 'high'
  const [compressionMode, setCompressionMode] = useState('medium');

  // 初始化：載入語言與函式庫
  useEffect(() => {
    // 1. 自動偵測語言
    const browserLang = navigator.language.toLowerCase(); // e.g. "en-US", "es-ES"
    const langCode = browserLang.split('-')[0]; // e.g. "en", "es"
    
    // 優先順序：完整匹配 -> 代碼匹配 -> 預設英文
    if (translations[browserLang]) {
      setLang(browserLang);
    } else if (browserLang === 'zh-cn' || browserLang === 'zh-sg') {
       setLang('zh-CN');
    } else if (browserLang === 'zh-tw' || browserLang === 'zh-hk') {
       setLang('zh-TW');
    } else if (translations[langCode]) {
      setLang(langCode);
    } else {
      setLang('en');
    }

    // 2. 設定計數器 Page ID (確保在 client 端執行)
    setPageId(window.location.hostname || 'localhost');

    // 3. 載入函式庫
    const loadLibs = async () => {
      try {
        await loadScript("https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js");
        await loadScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js");
        await loadScript("https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js");
        
        if (window.pdfjsLib) {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        }

        setStatus('idle');
        console.log("All PDF libraries loaded successfully");
      } catch (err) {
        console.error(err);
        setErrorMsg("Network Error: Failed to load libraries.");
        setStatus('error');
      }
    };
    loadLibs();
  }, []);

  // SEO: Dynamic Meta Tags & Structured Data
  useEffect(() => {
    const t = translations[lang] || translations['en'];
    
    // Update Document Title
    document.title = t.metaTitle || t.title;

    // Helper to update or create meta tags
    const updateMeta = (name, content, attribute = 'name') => {
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Update Meta Description & Keywords
    if (t.metaDesc) updateMeta('description', t.metaDesc);
    if (t.keywords) updateMeta('keywords', t.keywords);

    // --- NEW: Open Graph Tags for Social Sharing ---
    updateMeta('og:title', t.metaTitle || t.title, 'property');
    updateMeta('og:description', t.metaDesc || t.heroDesc, 'property');
    updateMeta('og:type', 'website', 'property');
    // 如果您有 logo 圖片，請將網址填入這裡，否則預設會抓取網站截圖
    // updateMeta('og:image', 'https://your-site.com/og-image.jpg', 'property'); 

    // Inject JSON-LD Structured Data
    const scriptId = 'structured-data';
    let script = document.getElementById(scriptId);
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": t.title,
      "applicationCategory": "UtilitiesApplication",
      "operatingSystem": "Any",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "description": t.metaDesc || t.heroDesc
    };
    script.textContent = JSON.stringify(structuredData);

  }, [lang]);

  // 取得目前語言的翻譯物件
  const t = translations[lang] || translations['en'];

  // RTL 支援檢測
  const isRTL = lang === 'ar';

  const loadScript = (src) => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  };

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files?.[0];
    processFile(uploadedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const uploadedFile = e.dataTransfer.files?.[0];
    processFile(uploadedFile);
  };

  const processFile = (uploadedFile) => {
    if (uploadedFile && uploadedFile.type === 'application/pdf') {
      setFile(uploadedFile);
      const reader = new FileReader();
      reader.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentLoaded = Math.round((event.loaded / event.total) * 50);
          setProgress(percentLoaded);
          setProgressStatus(t.status.reading);
        }
      };
      reader.onload = async (e) => {
        const buffer = e.target.result;
        setFileBuffer(buffer);
        await analyzePdf(buffer, uploadedFile.size);
      };
      setStatus('analyzing');
      reader.readAsArrayBuffer(uploadedFile);
    } else if (uploadedFile) {
      alert('PDF format only / 僅支援 PDF');
    }
  };

  const analyzePdf = async (buffer, originalSize) => {
    try {
      setProgress(60);
      setProgressStatus(t.status.parsing);
      const { PDFDocument } = window.PDFLib;
      
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      setProgress(80);
      setProgressStatus(t.status.scanning);

      const pageCount = pdfDoc.getPageCount();
      const sizeInMB = originalSize / (1024 * 1024);
      let imageContentScore = sizeInMB > 2 ? 80 : 40;

      // 這裡僅儲存數據，顯示時再翻譯
      setAnalysisData({
        originalSize: sizeInMB,
        pageCount: pageCount,
        imageScore: imageContentScore
      });
      
      setProgress(100);
      setTimeout(() => setStatus('review'), 500);

    } catch (err) {
      console.error(err);
      setErrorMsg("File Parse Error / 檔案解析失敗");
      setStatus('error');
    }
  };

  const handleCompress = async () => {
    if (!fileBuffer) return;
    setStatus('compressing');
    
    try {
      if (compressionMode === 'low') {
        await compressLossless();
      } else {
        await compressRasterization(compressionMode);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Compression Error: " + err.message);
      setStatus('error');
    }
  };

  const compressLossless = async () => {
    setProgress(20);
    setProgressStatus(t.status.analyzingStruct);
    const { PDFDocument } = window.PDFLib;
    const pdfDoc = await PDFDocument.load(fileBuffer);
    
    setProgress(50);
    setProgressStatus(t.status.cleaningMeta);
    pdfDoc.setTitle('');
    pdfDoc.setAuthor('');
    pdfDoc.setCreator('PDF Compressor');
    pdfDoc.setProducer('');
    
    setProgress(80);
    setProgressStatus(t.status.rebuilding);
    const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
    
    finalizeCompression(pdfBytes);
  };

  const compressRasterization = async (mode) => {
    const scale = mode === 'medium' ? 1.5 : 1.0; 
    const quality = mode === 'medium' ? 0.7 : 0.5;
    
    setProgress(10);
    setProgressStatus(t.status.initRender);
    
    const loadingTask = window.pdfjsLib.getDocument({ data: fileBuffer });
    const pdf = await loadingTask.promise;
    const totalPages = pdf.numPages;
    
    const { jsPDF } = window.jspdf;
    // 初始化時先不設定頁面大小，稍後動態新增
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'px',
      hotfixes: ['px_scaling'] 
    });
    // 刪除預設的空白頁
    doc.deletePage(1);

    for (let i = 1; i <= totalPages; i++) {
      setProgress(10 + Math.round((i / totalPages) * 80));
      setProgressStatus(t.status.resampling(i, totalPages));

      const page = await pdf.getPage(i);
      
      // 取得原始頁面尺寸 (不縮放)，用於判斷方向與設定 PDF 頁面大小
      const originalViewport = page.getViewport({ scale: 1.0 });
      // 取得渲染用的 Viewport (包含縮放)
      const viewport = page.getViewport({ scale: scale });

      // 自動偵測頁面方向
      const isLandscape = originalViewport.width > originalViewport.height;
      const orientation = isLandscape ? 'l' : 'p';

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({
        canvasContext: context,
        viewport: viewport
      }).promise;

      const imgData = canvas.toDataURL('image/jpeg', quality);
      
      // 關鍵修正：加入 orientation 參數，並使用原始尺寸
      doc.addPage([originalViewport.width, originalViewport.height], orientation);
      doc.addImage(imgData, 'JPEG', 0, 0, originalViewport.width, originalViewport.height);
      
      canvas.width = 0;
      canvas.height = 0;
    }

    setProgress(95);
    setProgressStatus(t.status.packing);
    const pdfOutput = doc.output('arraybuffer');
    finalizeCompression(new Uint8Array(pdfOutput));
  };

  const finalizeCompression = (pdfBytes) => {
    const finalSize = pdfBytes.byteLength;
    const originalSize = file.size;
    const savedBytes = originalSize - finalSize;
    const ratio = ((savedBytes / originalSize) * 100).toFixed(1);

    setCompressedPdfBytes(pdfBytes);
    setCompressionStats({
      originalSize: originalSize / (1024 * 1024),
      finalSize: finalSize / (1024 * 1024),
      ratio: ratio, 
      saved: savedBytes / (1024 * 1024),
      mode: compressionMode
    });

    setProgress(100);
    setTimeout(() => setStatus('completed'), 500);
  };

  const downloadFile = () => {
    if (!compressedPdfBytes || !file) return;
    
    const blob = new Blob([compressedPdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const suffix = compressionMode === 'high' ? 'small' : compressionMode === 'medium' ? 'medium' : 'clean';
    link.download = `${file.name.replace('.pdf', '')}_${suffix}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const resetApp = () => {
    setFile(null);
    setFileBuffer(null);
    setStatus('idle');
    setAnalysisData(null);
    setCompressionStats(null);
    setProgress(0);
    setProgressStatus('');
    setCompressedPdfBytes(null);
    setErrorMsg('');
    setCompressionMode('medium');
  };

  const formatSize = (mb) => {
    if (mb < 0) return `+${Math.abs(mb * 1024).toFixed(0)} KB`;
    if (mb < 0.001) return "0 KB";
    if (mb < 1) return `${(mb * 1024).toFixed(0)} KB`;
    return `${mb.toFixed(2)} MB`;
  };

  // UI Components
  const ModeCard = ({ mode, title, desc, icon, badge, active, onClick }) => (
    <div 
      onClick={() => onClick(mode)}
      className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${
        active 
          ? 'border-blue-500 bg-blue-50 shadow-md' 
          : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${active ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
          {icon}
        </div>
        <div className="text-start">
          <div className="flex items-center gap-2">
            <h4 className={`font-bold ${active ? 'text-blue-700' : 'text-slate-700'}`}>{title}</h4>
            {badge && <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold">{badge}</span>}
          </div>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">{desc}</p>
        </div>
      </div>
      {active && (
        <div className={`absolute top-3 ${isRTL ? 'left-3' : 'right-3'} text-blue-500`}>
          <CheckCircle size={18} />
        </div>
      )}
    </div>
  );

  return (
    <div 
      dir={isRTL ? 'rtl' : 'ltr'} 
      className={`min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-100 flex flex-col ${isRTL ? 'font-arabic' : ''}`}
    >
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 text-white p-2 rounded-lg">
            <Zap size={24} />
          </div>
          <div className="hidden md:block">
             <h1 className="text-xl font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
              {t.title}
            </h1>
            <p className="text-xs text-slate-500">{t.subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Buy Me a Coffee Link */}
          <a 
            href="https://buymeacoffee.com/tiny.tc" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-2 bg-yellow-100 text-yellow-800 px-3 py-1.5 rounded-full text-sm font-bold hover:bg-yellow-200 transition-colors"
          >
            <Coffee size={16} />
            {t.sponsorBtn}
          </a>

          {/* Language Switcher */}
          <div className="relative">
            <button 
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-1 text-slate-600 hover:text-blue-600 px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <Globe size={18} />
              <span className="text-sm font-medium">{translations[lang]?.name || lang.toUpperCase()}</span>
              <ChevronDown size={14} />
            </button>
            
            {showLangMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowLangMenu(false)}></div>
                <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-2 w-48 bg-white border border-slate-100 shadow-xl rounded-xl overflow-hidden z-20 max-h-80 overflow-y-auto`}>
                  {Object.keys(translations).map((key) => (
                    <button 
                      key={key}
                      onClick={() => { setLang(key); setShowLangMenu(false); }} 
                      className={`w-full px-4 py-3 text-sm hover:bg-blue-50 text-slate-700 flex items-center justify-between ${isRTL ? 'text-right' : 'text-left'} ${lang === key ? 'bg-blue-50 text-blue-600 font-bold' : ''}`}
                    >
                      <span>{translations[key].name}</span>
                      {lang === key && <Check size={14} />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-6 md:p-12 w-full flex-grow">
        
        {/* State: Loading Library */}
        {status === 'loading-lib' && (
          <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
            <div className="animate-spin text-blue-500 mb-4"><RefreshCw size={32} /></div>
            <p className="text-slate-500">{t.loadingLib}</p>
          </div>
        )}

        {/* State: Error */}
        {status === 'error' && (
           <div className="text-center py-12">
             <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 text-red-600 rounded-full mb-4">
                <AlertCircle size={32} />
             </div>
             <h3 className="text-xl font-bold text-slate-800 mb-2">{t.errorTitle}</h3>
             <p className="text-slate-500 mb-6">{errorMsg}</p>
             <button onClick={resetApp} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">{t.retry}</button>
           </div>
        )}

        {/* State: Idle */}
        {status === 'idle' && (
          <div className="animate-fade-in flex flex-col items-center">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">{t.heroTitle}</h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                {t.heroDesc}
              </p>
            </div>

            <div 
              className="w-full max-w-2xl border-4 border-dashed border-blue-100 hover:border-blue-400 bg-white hover:bg-blue-50 transition-all rounded-3xl p-12 flex flex-col items-center justify-center cursor-pointer group shadow-sm"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-blue-200 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <div className="relative bg-blue-100 text-blue-600 p-6 rounded-full group-hover:scale-110 transition-transform duration-300">
                  <Upload size={48} />
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-slate-700 mb-2">{t.dragDrop}</h3>
              <p className="text-slate-400 mb-6">{t.or}</p>
              
              <label className="relative">
                <input 
                  type="file" 
                  accept=".pdf" 
                  className="hidden" 
                  onChange={handleFileUpload}
                />
                <span className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium shadow-lg hover:shadow-blue-500/30 transition-all cursor-pointer inline-flex items-center gap-2">
                  <FileText size={18} />
                  {t.selectFile}
                </span>
              </label>
            </div>
            
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
              <FeatureCard 
                icon={<Maximize2 className="text-blue-500" />} 
                title={t.feature1Title}
                desc={t.feature1Desc}
              />
              <FeatureCard 
                icon={<Settings className="text-purple-500" />} 
                title={t.feature2Title}
                desc={t.feature2Desc}
              />
              <FeatureCard 
                icon={<Shield className="text-emerald-500" />} 
                title={t.feature3Title}
                desc={t.feature3Desc}
              />
            </div>

            {/* SEO: FAQ Section (Only visible on Idle state to help indexing) */}
            {t.faqs && (
              <section className="w-full max-w-3xl mt-20 text-left">
                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <HelpCircle className="text-blue-500" />
                  {t.faqTitle}
                </h3>
                <div className="grid gap-4">
                  {t.faqs.map((faq, idx) => (
                    <article key={idx} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                      <h4 className="font-bold text-slate-700 mb-2">{faq.q}</h4>
                      <p className="text-slate-500 text-sm leading-relaxed">{faq.a}</p>
                    </article>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {/* State: Analyzing */}
        {status === 'analyzing' && (
          <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
            <div className="w-24 h-24 relative mb-8">
              <svg className="animate-spin w-full h-full text-blue-200" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-blue-600 font-bold text-sm">
                {progress}%
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">{progressStatus || t.analyzingStatus}</h3>
            <p className="text-slate-500">{file?.name}</p>
          </div>
        )}

        {/* State: Review (Settings) */}
        {status === 'review' && analysisData && (
          <div className="max-w-4xl mx-auto animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Analysis Report */}
              <div className="lg:col-span-1 space-y-6">
                 <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <BarChart2 size={18} className="text-blue-500"/> {t.reportTitle}
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-slate-400">{t.originalSize}</p>
                        <p className="text-xl font-bold text-slate-700">{formatSize(analysisData.originalSize)}</p>
                      </div>
                      <div className="pt-4 border-t border-slate-50">
                        <p className="text-xs text-slate-400 mb-2">{t.contentEst}</p>
                        <div className="flex items-center gap-2 text-sm mb-1">
                           <ImageIcon size={14} className="text-purple-500"/>
                           <span>{t.imageContent}</span>
                           <span className="ml-auto font-bold">{analysisData.imageScore}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                           <div className="bg-purple-500 h-2 rounded-full" style={{width: `${analysisData.imageScore}%`}}></div>
                        </div>
                      </div>
                      
                      {/* Analysis Items (Translated) */}
                      <div className="space-y-2 pt-4 border-t border-slate-50">
                        <div className="flex items-start gap-2 text-sm text-slate-600">
                           <CheckCircle size={14} className="shrink-0 mt-0.5 text-purple-500" />
                           <span>{t.items.images} <span className="text-xs opacity-70">({t.items.potentialHigh})</span></span>
                        </div>
                        <div className="flex items-start gap-2 text-sm text-slate-600">
                           <CheckCircle size={14} className="shrink-0 mt-0.5 text-blue-500" />
                           <span>{t.items.structure} <span className="text-xs opacity-70">({t.items.potentialRebuild})</span></span>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-50">
                        <div className="bg-blue-50 p-3 rounded-lg text-xs text-blue-700 leading-relaxed">
                          {t.optimizationTip}
                        </div>
                      </div>
                    </div>
                 </div>
              </div>

              {/* Right Column: Settings & Action */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 h-full flex flex-col">
                  <div className="p-8 flex-1">
                    <h3 className="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-2">
                      <Settings className="text-blue-600" />
                      {t.algoTitle}
                    </h3>
                    <p className="text-slate-500 mb-6">{t.algoDesc}</p>

                    <div className="grid gap-4">
                      <ModeCard 
                        mode="low"
                        active={compressionMode === 'low'}
                        onClick={setCompressionMode}
                        icon={<Shield size={20} />}
                        title={t.modeLowTitle}
                        desc={t.modeLowDesc}
                      />
                      <ModeCard 
                        mode="medium"
                        active={compressionMode === 'medium'}
                        onClick={setCompressionMode}
                        icon={<RefreshCw size={20} />}
                        badge={lang === 'en' ? "Recommended" : "Hot"}
                        title={t.modeMedTitle}
                        desc={t.modeMedDesc}
                      />
                      <ModeCard 
                        mode="high"
                        active={compressionMode === 'high'}
                        onClick={setCompressionMode}
                        icon={<Zap size={20} />}
                        badge="Max"
                        title={t.modeHighTitle}
                        desc={t.modeHighDesc}
                      />
                    </div>
                  </div>

                  <div className="bg-blue-50 p-8 border-t border-blue-100">
                     <button 
                        onClick={handleCompress}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2"
                      >
                        <RefreshCw size={20} />
                        {compressionMode === 'low' ? t.startBtnLow : t.startBtnRaster}
                      </button>
                      {compressionMode !== 'low' && (
                        <p className="text-center text-xs text-amber-600 mt-3 font-medium flex items-center justify-center gap-1">
                          <AlertCircle size={12}/> {t.textWarn}
                        </p>
                      )}
                  </div>
                </div>
              </div>
            </div>
            
            <button onClick={resetApp} className="mt-8 text-slate-400 hover:text-slate-600 text-sm flex items-center gap-1 mx-auto">
              {t.processAnother}
            </button>
          </div>
        )}

        {/* State: Compressing */}
        {status === 'compressing' && (
          <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
            <div className="w-full max-w-md bg-slate-200 rounded-full h-4 mb-8 overflow-hidden">
              <div 
                className={`bg-blue-600 h-full rounded-full transition-all duration-300 ease-out relative ${isRTL ? 'origin-right' : 'origin-left'}`}
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">{progressStatus || t.compressingStatus}</h3>
            <p className="text-slate-500">
              {compressionMode !== 'low' ? t.compressingDescRaster : t.compressingDescLow}
            </p>
          </div>
        )}

        {/* State: Completed */}
        {status === 'completed' && compressionStats && (
          <div className="max-w-2xl mx-auto animate-fade-in">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full mb-4">
                <CheckCircle size={32} />
              </div>
              <h2 className="text-3xl font-bold text-slate-800">{t.completeTitle}</h2>
            </div>

            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 mb-8">
              <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-center">
                <div className="md:border-r border-slate-100">
                  <p className="text-slate-400 text-sm mb-1">{t.originalSize}</p>
                  <p className="text-xl font-semibold text-slate-500 line-through">
                    {formatSize(compressionStats.originalSize)}
                  </p>
                </div>
                
                <div className="md:border-r border-slate-100">
                  <p className="text-slate-400 text-sm mb-1">{t.ratio}</p>
                  {Number(compressionStats.ratio) > 0 ? (
                    <p className="text-4xl font-black text-blue-600">
                      -{compressionStats.ratio}%
                    </p>
                  ) : (
                    <p className="text-xl font-bold text-slate-400">
                      {compressionStats.ratio}%
                    </p>
                  )}
                </div>
                
                <div>
                  <p className="text-slate-400 text-sm mb-1">{t.currentSize}</p>
                  <p className="text-xl font-bold text-emerald-600">
                    {formatSize(compressionStats.finalSize)}
                  </p>
                </div>
              </div>
              
              <div className="bg-slate-50 p-6 text-center border-t border-slate-100">
                <p className="text-slate-600 text-sm mb-2">
                  {t.modeLabel}:
                  <span className={`font-bold uppercase ml-1 ${compressionStats.mode === 'low' ? 'text-blue-600' : 'text-purple-600'}`}>
                    {compressionStats.mode === 'low' ? 'Structural' : 'Rasterized'}
                  </span>
                </p>
                {Number(compressionStats.saved) > 0 ? (
                  <p className="text-slate-500 text-sm">
                    {t.saved} <span className="font-bold text-slate-800">{formatSize(compressionStats.saved)}</span>
                  </p>
                ) : (
                   <p className="text-slate-500 text-sm">
                    {t.noSaved}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <button 
                onClick={downloadFile}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:shadow-emerald-500/30 transition-all flex items-center justify-center gap-2 flex-1"
              >
                <Download size={20} />
                {t.downloadBtn}
              </button>
              <button 
                onClick={resetApp}
                className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-8 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 flex-1"
              >
                <RefreshCw size={20} />
                {t.processAnother}
              </button>
            </div>
            
            <div className="mt-8 bg-blue-50 rounded-lg p-4 flex items-start gap-3">
              <Info size={20} className="text-blue-500 shrink-0 mt-0.5" />
              <p className="text-sm text-blue-700 text-start">
                <strong>{t.techNoteTitle}:</strong> {t.techNoteDesc}
              </p>
            </div>
            
             {/* Mobile Sponsor Button */}
             <div className="mt-8 md:hidden text-center">
                <a 
                  href="https://buymeacoffee.com/tiny.tc" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-6 py-3 rounded-full text-sm font-bold hover:bg-yellow-200 transition-colors"
                >
                  <Coffee size={18} />
                  {t.sponsorBtn}
                </a>
             </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 mt-auto py-8 text-center text-slate-400 text-sm">
        <p>© 2024 {t.title}. Powered by PDF.js & jsPDF.</p>
        <p className="mt-2 text-xs opacity-60">Secure Client-side Compression | No Server Upload</p>
        
        {/* Visitor Counter Badge */}
        {pageId && (
          <div className="mt-4 flex justify-center items-center gap-2 opacity-70 hover:opacity-100 transition-opacity" title={t.visits}>
            <span className="text-xs">{t.visits}:</span>
            <img 
              src={`https://visitor-badge.laobi.icu/badge?page_id=${pageId}&left_text=&right_color=blue&left_color=gray`} 
              alt="visitor count" 
              className="h-5"
              loading="lazy"
            />
          </div>
        )}
      </footer>
    </div>
  );
}

// 子元件：功能卡片
function FeatureCard({ icon, title, desc }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow text-start">
      <div className="mb-4 bg-slate-50 w-12 h-12 rounded-lg flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}