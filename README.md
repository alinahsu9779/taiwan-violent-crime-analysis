# 台灣真的不安全嗎？——近十年暴力犯罪與故意殺人數據分析專題

本專案透過整理內政部警政署近十年（民國 104–114 年 / 西元 2015–2025 年）官方犯罪統計數據，結合 Google Trends 搜尋熱度趨勢，從「總量趨勢、結構比重（分母縮小效應）、兩造人際關係、性別與案發地點」四個維度，系統性檢視大眾對「隨機殺人」的治安焦慮與客觀犯罪數據之間的真實樣貌。

---

## 📊 資料來源（Data Sources）

1. **內政部警政署《警政統計查詢網》**（2015–2025 年暴力犯罪與故意殺人發生數、破獲數、嫌疑犯與被害人數）
2. **內政部警政署《犯罪被害概況》報告書**（2019–2023 年故意殺人被害人之兩造關係、性別與案發地點分布）
3. **Google Trends 搜尋趨勢**（2014–2025 年「隨機殺人」關鍵字搜尋熱度指數）

---

## 📂 專案檔案架構一覽（Directory Structure）

```text
專案資料夾/
├── README.md                                 # 本專案說明文件
│
├── 【1. 原始資料（Raw Data）】
│   ├── violent_crime_all.csv                 # 警政署暴力犯罪原始統計明細
│   ├── homicide_all.csv                      # 警政署故意殺人原始統計明細
│   ├── 2-2犯罪被害概況.pdf                    # 警政署《犯罪被害概況》官方報告書
│   └── google搜尋-隨機殺人(大眾.csv           # Google Trends 搜尋熱度原始數據
│
├── 【2. Python 資料清洗與整合腳本（ETL Scripts）】
│   ├── clean_violent_crime.py                # 清洗暴力犯罪原始資料並產出全國彙總表
│   ├── clean_homicide.py                     # 清洗故意殺人原始資料並產出全國彙總表
│   ├── clean_data.py                         # 整合兩大犯罪類別並計算年度佔比與變動率
│   ├── create_relationship_csv.py            # 建立 2019–2023 年「兩造關係」結構化統計表
│   ├── create_gender_location_csv.py         # 建立 2019–2023 年「性別與案發地點」統計表
│   └── merge_crime_db.py                     # 將清洗後的資料表寫入 SQLite 資料庫
│
├── 【3. 清洗後數據與資料庫（Cleaned Data & Database）】
│   ├── crime_data.db                         # 整合後的 SQLite 核心資料庫（含 homicide 與 violent_crime 表）
│   ├── violent_crime_national.csv            # 2015–2025 年全國暴力犯罪彙總數據
│   ├── homicide_national.csv                 # 2015–2025 年全國故意殺人彙總數據
│   ├── national_summary_104_114.csv          # 民國 104–114 年暴力犯罪與故意殺人對照總表
│   ├── homicide_relationship_2019_2023.csv   # 2019–2023 年故意殺人兩造關係分布數據
│   └── homicide_gender_location_2019_2023.csv# 2019–2023 年故意殺人性別與地點分布數據
│
├── 【4. 視覺化探索檔案（Tableau）】
│   ├── 十年犯罪趨勢圖.twb                    # Tableau 視覺化工作簿
│   └── 十年犯罪趨勢圖.twbx                   # Tableau 封裝工作簿（內含資料源，可直接開啟）
│
└── 【5. 互動式網頁簡報（Web Presentation）】
    ├── index.html                            # 簡報主頁面與結構
    ├── style.css                             # 簡報視覺樣式與響應式排版
    └── charts.js                             # SVG 互動式統計圖表繪製邏輯
```

---

## ⚙️ Python 資料處理執行順序（Data Pipeline）

若需從原始資料重新執行清洗與資料庫建置，請依下列順序執行 Python 腳本（需具備 Python 3 環境與 `pandas`、`sqlite3` 套件）：

1. **清洗原始犯罪統計資料：**
   ```bash
   python clean_violent_crime.py
   python clean_homicide.py
   python clean_data.py
   ```
2. **建構兩造關係與性別地點明細表：**
   ```bash
   python create_relationship_csv.py
   python create_gender_location_csv.py
   ```
3. **彙整寫入 SQLite 資料庫：**
   ```bash
   python merge_crime_db.py
   ```

---

## 🖥️ 簡報與視覺化檢視方式

* **互動式網頁簡報：** 直接使用瀏覽器（Chrome / Safari / Edge）開啟 `index.html` 即可進行簡報播放；支援鍵盤左右方向鍵切換頁面，滑鼠懸停於圖表可檢視各年度精確數據。
* **SQLite 資料庫檢視：** 可使用 DB Browser for SQLite 開啟 `crime_data.db` 瀏覽完整資料表。
* **Tableau 專案檢視：** 使用 Tableau Desktop 或免費版 Tableau Reader 開啟 `十年犯罪趨勢圖.twbx`。

---

## 📌 核心研究發現摘要

1. **總量大幅下降：** 近十年（2015–2025）台灣暴力犯罪發生數下降 **74.3%**、故意殺人發生數下降 **64.3%**，整體客觀治安趨勢持續改善。
2. **結構濃縮效應（分母縮小效應）：** 故意殺人佔整體暴力犯罪比重由 2015 年的 **22.60%** 升至 2024 年峰值 **36.40%**（2025 年為 **31.40%**），主因是其他六類暴力犯罪大幅減少使分母縮小；此外解讀 2025 年數據須留意警政署於 **2024 年 9 月起實施「一被害人計一件」之統計改制**。
3. **關係高度集中於熟人：** 近五年（2019–2023）故意殺人被害人與嫌犯「彼此認識」之比例高達 **7～8 成**（2023 年達 **79.17%**），大眾最恐慌之陌生人隨機殺人僅屬極少數。
4. **性別與私領域風險分化：** 女性被害者高度集中於「住宅內」（2023 年達 **82.8%**）且逾 9 成為熟人或親密伴侶；男性被害者亦從早期以外部非住宅空間為主，於 2022–2023 年明顯轉向住宅內熟人衝突（2023 年住宅佔比達 **65.67%**）。
