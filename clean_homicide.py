
import pandas as pd

raw = pd.read_csv("/Users/alina/Desktop/data/homicide_all.csv",
                  encoding="utf-8-sig", header=None, dtype=str)

# print(raw.shape)
# print(raw.iloc[ :3, :4])
df = raw.copy()
df.columns = ["民國年", "發生數", "破獲數", "嫌疑犯", "被害人"]

# 只留下「104年」這種年度資料列，表頭和說明文字都丟掉
df = df[df["民國年"].str.match(r"^\d+年$", na=False)]

#print(df)

# 1. 把「104年」的「年」字去掉，轉成整數
df["民國年"] = df["民國年"].str.replace("年", "").astype(int)

# 2. 四欄從文字轉成整數
for col in ["發生數", "破獲數", "嫌疑犯", "被害人"]:
    df[col] = df[col].astype(int)

# 3. 重新編號
df = df.reset_index(drop=True)

# 4. 核對：跟官方查詢網畫面上的發生數對照
expected = [442, 405, 399, 323, 302, 238, 212, 174, 123, 136, 158]
print("發生數核對是否一致：", df["發生數"].tolist() == expected)

# 5. 加兩個欄位
df["西元年"] = df["民國年"] + 1911
df["被害人/發生數"] = (df["被害人"] / df["發生數"]).round(2)

print(df)

# 6. 存檔
df.to_csv("/Users/alina/Desktop/data/homicide_national.csv",
          index=False, encoding="utf-8-sig")
print("已存檔")
