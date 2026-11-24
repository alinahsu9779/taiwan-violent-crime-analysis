import pandas as pd

raw = pd.read_csv("/Users/alina/Desktop/data/violent_crime_all.csv",encoding="utf-8-sig",header=None,dtype=str)

# print(raw.shape)
# print(raw.iloc[:3, :6])
# print(raw.iloc[:, 0].tolist())

# 只挑出需要的 5 欄：年度、發生數、破獲數、嫌疑犯、被害人（都是「全國」）
df = raw[[0, 1, 25, 49, 73]].copy()
df.columns = ["民國年", "發生數", "破獲數", "嫌疑犯", "被害人"]

# 只留下「104年」這種年度資料列，說明文字丟掉
df = df[df["民國年"].str.match(r"^\d+年$", na=False)]

# 驗證：每組指標從哪一欄開始
# print(raw.iloc[0].dropna())
# print(raw.iloc[1, [1, 25, 49, 73]])

#print(df)

# 1. 把「104年」的「年」字去掉，再轉成整數
df["民國年"] = df["民國年"].str.replace("年", "").astype(int)

# 2. 四欄資料從文字轉成整數
for col in ["發生數", "破獲數", "嫌疑犯", "被害人"]:
    df[col] = df[col].astype(int)

# 3. 重新編號（原本左邊的 2、3、4… 是舊的列號）
df = df.reset_index(drop=True)

#print(df)
#print(df.dtypes)

print(df)

# 4. 核對並加欄位
counties = raw.iloc[2:13, 2:25].replace("－", "0").astype(int)
county_sum = counties.sum(axis=1).reset_index(drop=True)
print("加總核對是否全部一致：", (county_sum == df["發生數"]).all())

df["西元年"] = df["民國年"] + 1911
df["被害人/發生數"] = (df["被害人"] / df["發生數"]).round(2)

print(df)

# 5. 存檔
df.to_csv("/Users/alina/Desktop/data/violent_crime_national.csv",
          index=False, encoding="utf-8-sig")
print("已存檔")