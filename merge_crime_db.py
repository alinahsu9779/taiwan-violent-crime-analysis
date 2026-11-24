import sqlite3
import pandas as pd

# 1. 建立並連線到 SQLite 資料庫檔案
conn = sqlite3.connect("crime_data.db")

# 2. 讀取現有 CSV 並存入資料庫的兩張資料表中
pd.read_csv("violent_crime_national.csv", encoding="utf-8-sig").to_sql("violent_crime", conn, if_exists="replace", index=False)
pd.read_csv("homicide_national.csv", encoding="utf-8-sig").to_sql("homicide", conn, if_exists="replace", index=False)

# 3. 透過 Python 執行 SQL 查詢進行關聯（JOIN）與百分比運算
sql_query = """
SELECT 
    v.民國年,
    v.西元年,
    v.發生數 AS 暴力_發生數,
    v.破獲數 AS 暴力_破獲數,
    ROUND(v.破獲數 * 100.0 / v.發生數, 1) AS "暴力_破獲率(%)",
    h.發生數 AS 殺人_發生數,
    h.破獲數 AS 殺人_破獲數,
    ROUND(h.破獲數 * 100.0 / h.發生數, 1) AS "殺人_破獲率(%)",
    ROUND(h.發生數 * 100.0 / v.發生數, 1) AS "殺人佔暴力比重(%)"
FROM violent_crime v
JOIN homicide h ON v.西元年 = h.西元年
ORDER BY v.西元年;
"""

# 4. 將 SQL 查詢結果轉回 DataFrame 並匯出成 CSV
df_result = pd.read_sql_query(sql_query, conn)
df_result.to_csv("national_summary_104_114.csv", index=False, encoding="utf-8-sig")
conn.close()

print("已透過 SQLite 資料庫與 SQL 查詢完成整合，並成功匯出 national_summary_104_114.csv！")


