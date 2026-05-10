import pandas as pd
from supabase import create_client

# =========================
# CONFIG
# =========================

GOOGLE_SHEET_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRwVsLSRADS6bCY1x_NgfxzTg2M7EZm13GNFpzgbZhj2D-aIpS3mJ7uM21QLoyRFJ1V-vuClWtokmbg/pub?output=csv"

SUPABASE_URL = "https://mzwtopynefadhqmdmmjl.supabase.co"

SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16d3RvcHluZWZhZGhxbWRtbWpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5NDgwMjcsImV4cCI6MjA5MjUyNDAyN30.uRLWcZMWLg_GLydshQ9qdUJUiK_TeyWmncGPtdjmJB4"

TABLE_NAME = "devices"

# =========================
# LOAD CSV
# =========================

print("Loading Google Sheet...")

df = pd.read_csv(
    GOOGLE_SHEET_CSV,
    dtype=str
)

# =========================
# CLEAN
# =========================

for col in df.columns:

    df[col] = (
        df[col]
        .fillna("")
        .astype(str)
        .str.strip()
    )

# normalize kks
df["kks"] = df["kks"].str.upper()

# =========================
# CONNECT SUPABASE
# =========================

supabase = create_client(
    SUPABASE_URL,
    SUPABASE_KEY
)

# =========================
# CLEAR TABLE
# =========================

print("Clearing old data...")

supabase.table(TABLE_NAME)\
    .delete()\
    .neq("id", 0)\
    .execute()

# =========================
# INSERT DATA
# =========================

records = df.to_dict(orient="records")

BATCH_SIZE = 500

print("Uploading...")

for i in range(0, len(records), BATCH_SIZE):

    batch = records[i:i+BATCH_SIZE]

    supabase.table(TABLE_NAME)\
        .insert(batch)\
        .execute()

    print(f"Uploaded {i + len(batch)} / {len(records)}")

# =========================
# DONE
# =========================

print("\n===================")
print("SYNC COMPLETED")
print("===================")

print(f"Total rows: {len(records)}")