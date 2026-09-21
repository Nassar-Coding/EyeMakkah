import math
from datetime import date, timedelta

import numpy as np
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import streamlit as st

st.set_page_config(
    page_title="EyeMakkah | منصة ذكاء الأعمال",
    page_icon="◈",
    layout="wide",
    initial_sidebar_state="expanded",
)

# -----------------------------
# Visual system
# -----------------------------
BG = "#F4EFE5"
PAPER = "#FFFCF6"
TEXT = "#211E19"
GREEN = "#17463A"
DEEP_GREEN = "#0E3129"
GOLD = "#B8944A"
SAND = "#E8DDC9"
MUTED = "#756E64"
CLAY = "#A65F45"
SOFT_GREEN = "#DCE8E1"
GRID = "#DDD4C4"

st.markdown(
    f"""
    <style>
    html, body, [class*="css"] {{
        font-family: "IBM Plex Sans Arabic", "Noto Sans Arabic", Tahoma, Arial, sans-serif;
    }}
    .stApp {{
        background: {BG};
        color: {TEXT};
        direction: rtl;
    }}
    [data-testid="stHeader"] {{
        background: rgba(244,239,229,0.92);
        border-bottom: 1px solid rgba(184,148,74,0.14);
    }}
    section[data-testid="stSidebar"] {{
        background: {DEEP_GREEN};
        border-left: 1px solid rgba(255,255,255,0.08);
    }}
    section[data-testid="stSidebar"] * {{
        direction: rtl;
    }}
    section[data-testid="stSidebar"] label,
    section[data-testid="stSidebar"] p,
    section[data-testid="stSidebar"] span {{
        color: #F6F0E6 !important;
    }}
    section[data-testid="stSidebar"] div[role="radiogroup"] label {{
        padding: 0.55rem 0.65rem;
        border-radius: 11px;
        margin-bottom: 0.15rem;
    }}
    section[data-testid="stSidebar"] div[role="radiogroup"] label:hover {{
        background: rgba(255,255,255,0.07);
    }}
    .block-container {{
        padding-top: 1.4rem;
        padding-bottom: 2.6rem;
        max-width: 1500px;
    }}
    h1, h2, h3, h4 {{ color: {TEXT}; letter-spacing: -0.02em; }}
    .eyebrow {{
        font-size: 0.76rem;
        color: {GOLD};
        font-weight: 700;
        letter-spacing: 0.08em;
        margin-bottom: 0.2rem;
    }}
    .page-title {{
        font-size: 2rem;
        font-weight: 800;
        line-height: 1.25;
        margin: 0;
        color: {DEEP_GREEN};
    }}
    .page-subtitle {{
        color: {MUTED};
        margin-top: 0.45rem;
        margin-bottom: 1rem;
        font-size: 0.96rem;
    }}
    .hero-rule {{
        height: 1px;
        background: linear-gradient(90deg, rgba(184,148,74,0), rgba(184,148,74,.62), rgba(184,148,74,0));
        margin: .3rem 0 1rem 0;
    }}
    .kpi-card {{
        background: {PAPER};
        border: 1px solid rgba(92,72,40,0.11);
        border-radius: 17px;
        padding: 1.05rem 1.05rem 0.9rem 1.05rem;
        min-height: 126px;
        box-shadow: 0 6px 24px rgba(60,48,30,0.035);
    }}
    .kpi-label {{ color: {MUTED}; font-size: .82rem; margin-bottom: .45rem; }}
    .kpi-value {{ color: {DEEP_GREEN}; font-size: 1.74rem; font-weight: 800; line-height: 1; }}
    .kpi-delta-up {{ color: {GREEN}; font-size: .78rem; margin-top: .55rem; font-weight: 700; }}
    .kpi-delta-down {{ color: {CLAY}; font-size: .78rem; margin-top: .55rem; font-weight: 700; }}
    .kpi-note {{ color: {MUTED}; font-size: .72rem; margin-top: .18rem; }}
    .section-card {{
        background: {PAPER};
        border: 1px solid rgba(92,72,40,0.10);
        border-radius: 18px;
        padding: 1.0rem 1.05rem;
        box-shadow: 0 6px 24px rgba(60,48,30,0.03);
        margin-bottom: .4rem;
    }}
    .section-title {{ color: {TEXT}; font-size: 1.02rem; font-weight: 800; margin-bottom: .18rem; }}
    .section-copy {{ color: {MUTED}; font-size: .82rem; }}
    .insight-box {{
        background: linear-gradient(135deg, rgba(23,70,58,.07), rgba(184,148,74,.09));
        border: 1px solid rgba(23,70,58,.12);
        border-right: 4px solid {GOLD};
        border-radius: 16px;
        padding: 1rem 1.1rem;
        margin: .2rem 0 1rem 0;
    }}
    .insight-label {{ color: {GOLD}; font-size: .76rem; font-weight: 800; margin-bottom: .25rem; }}
    .insight-text {{ color: {DEEP_GREEN}; font-size: 1rem; font-weight: 750; line-height: 1.7; }}
    .insight-reason {{ color: {MUTED}; font-size: .78rem; margin-top: .45rem; line-height: 1.7; }}
    .mini-pill {{
        display:inline-block;
        background: {SAND};
        color: {DEEP_GREEN};
        border-radius: 999px;
        padding: .25rem .55rem;
        font-size: .72rem;
        margin-left: .25rem;
        margin-top: .2rem;
    }}
    .data-note {{
        color: {MUTED};
        font-size: .72rem;
        text-align: center;
        padding-top: .7rem;
    }}
    div[data-testid="stSelectbox"] > label,
    div[data-testid="stMultiSelect"] > label {{
        color: {MUTED};
        font-size: .78rem;
        font-weight: 700;
    }}
    div[data-baseweb="select"] > div {{
        background: {PAPER};
        border-color: rgba(92,72,40,0.13);
        min-height: 42px;
    }}
    [data-testid="stDownloadButton"] button,
    [data-testid="stButton"] button {{
        border-radius: 10px;
        border: 1px solid rgba(23,70,58,.22);
        background: {PAPER};
        color: {DEEP_GREEN};
    }}
    [data-testid="stDownloadButton"] button:hover,
    [data-testid="stButton"] button:hover {{
        border-color: {GOLD};
        color: {DEEP_GREEN};
    }}
    div[data-testid="stDataFrame"] {{
        border-radius: 14px;
        overflow: hidden;
    }}
    .sidebar-brand {{
        padding: .9rem .65rem .8rem .65rem;
        margin-bottom: .7rem;
        border-bottom: 1px solid rgba(255,255,255,.12);
    }}
    .sidebar-brand-main {{
        color: #FFF8EB;
        font-weight: 900;
        font-size: 1.45rem;
        direction:ltr;
        text-align:right;
    }}
    .sidebar-brand-sub {{
        color: #D6C9B1;
        font-size: .82rem;
        margin-top: .1rem;
    }}
    .sidebar-meta {{
        color:#CFC4B0;
        font-size:.7rem;
        line-height:1.7;
        padding:.35rem .65rem;
    }}
    </style>
    """,
    unsafe_allow_html=True,
)

# -----------------------------
# Synthetic data
# -----------------------------
AREAS = ["العزيزية", "الشوقية", "العوالي", "النسيم", "الزاهر", "الشرائع", "بطحاء قريش"]
CATEGORIES = [
    "المطاعم والمقاهي",
    "التجارب والأنشطة",
    "التسوق",
    "الترفيه",
    "الثقافة",
    "الخدمات",
    "المجتمعات",
    "الضيافة",
]
AUDIENCES = ["سكان مكة", "الزوار"]

AREA_FACTOR = {
    "العزيزية": 1.23,
    "الشوقية": 0.92,
    "العوالي": 1.06,
    "النسيم": 0.84,
    "الزاهر": 0.79,
    "الشرائع": 0.72,
    "بطحاء قريش": 0.68,
}
CATEGORY_FACTOR = {
    "المطاعم والمقاهي": 1.28,
    "التجارب والأنشطة": 1.20,
    "التسوق": 0.98,
    "الترفيه": 0.91,
    "الثقافة": 0.83,
    "الخدمات": 0.77,
    "المجتمعات": 0.74,
    "الضيافة": 0.88,
}
CATEGORY_GROWTH = {
    "المطاعم والمقاهي": 0.10,
    "التجارب والأنشطة": 0.16,
    "التسوق": 0.05,
    "الترفيه": 0.13,
    "الثقافة": 0.09,
    "الخدمات": 0.03,
    "المجتمعات": 0.14,
    "الضيافة": 0.07,
}

@st.cache_data

def build_daily_data():
    rng = np.random.default_rng(42)
    end = pd.Timestamp("2026-09-21")
    dates = pd.date_range(end=end, periods=365, freq="D")
    rows = []
    for di, d in enumerate(dates):
        weekly = 1.12 if d.dayofweek in [4, 5] else 0.96 if d.dayofweek == 0 else 1.0
        season = 1 + 0.08 * math.sin((di / 365) * math.tau * 2)
        trend = 0.88 + 0.24 * (di / (len(dates) - 1))
        for area in AREAS:
            for cat in CATEGORIES:
                for aud in AUDIENCES:
                    audience_factor = 1.10 if aud == "الزوار" and cat in ["الضيافة", "الثقافة", "التجارب والأنشطة"] else 1.0
                    audience_factor *= 1.08 if aud == "سكان مكة" and cat in ["المجتمعات", "الخدمات", "المطاعم والمقاهي"] else 1.0
                    base = 44 * AREA_FACTOR[area] * CATEGORY_FACTOR[cat] * audience_factor * weekly * season * trend
                    noise = rng.normal(1.0, 0.08)
                    searches = max(3, int(base * 0.72 * noise))
                    views = max(searches, int(base * 2.7 * rng.normal(1.0, 0.06)))
                    saves = max(1, int(views * rng.uniform(0.09, 0.15)))
                    plans = max(1, int(saves * rng.uniform(0.42, 0.62)))
                    joins = max(0, int(plans * rng.uniform(0.30, 0.48)))
                    actions = max(0, int(plans * rng.uniform(0.25, 0.45)))
                    completes = max(0, int(actions * rng.uniform(0.45, 0.68)))
                    contributes = max(0, int(base * rng.uniform(0.025, 0.055)))
                    interactions = views + searches + saves + plans + joins + actions + contributes
                    active_users = max(2, int(interactions * rng.uniform(0.30, 0.42)))
                    rows.append(
                        [d, area, cat, aud, interactions, active_users, searches, views, saves, plans, joins, actions, completes, contributes]
                    )
    return pd.DataFrame(
        rows,
        columns=[
            "date", "area", "category", "audience", "interactions", "active_users", "searches", "views", "saves",
            "plans", "joins", "actions", "completes", "contributes"
        ],
    )

@st.cache_data

def build_activities():
    rng = np.random.default_rng(7)
    names = [
        "جولة ذاكرة مكة", "مساء الخط العربي", "تجربة القهوة السعودية", "مسار الأسواق القديمة",
        "مختبر الصغار الإبداعي", "جلسة تصوير معالم مكة", "ورشة الحرف المحلية", "ليلة القصص المكية",
        "مشي العوالي المسائي", "تجربة المذاقات الحجازية", "نادي القراءة الأسبوعي", "ورشة الفخار",
        "صباح العائلة في الحديقة", "جولة المتاحف", "لقاء المتطوعين", "أمسية التصوير",
        "جلسة تاريخ الأحياء", "تجربة المخبوزات", "نادي المشي", "مجلس رواد المشاريع"
    ]
    cats = ["الثقافة", "الثقافة", "المطاعم والمقاهي", "التجارب والأنشطة", "الترفيه", "الثقافة", "الثقافة", "المجتمعات",
            "التجارب والأنشطة", "المطاعم والمقاهي", "المجتمعات", "التجارب والأنشطة", "الترفيه", "الثقافة", "المجتمعات",
            "التجارب والأنشطة", "المجتمعات", "المطاعم والمقاهي", "التجارب والأنشطة", "المجتمعات"]
    rows = []
    for i, name in enumerate(names):
        views = int(rng.integers(1800, 16000))
        saves = int(views * rng.uniform(.08, .19))
        plans = int(saves * rng.uniform(.42, .68))
        joins = int(plans * rng.uniform(.25, .53))
        actions = int(plans * rng.uniform(.20, .47))
        complete = int(actions * rng.uniform(.38, .72))
        rows.append([name, cats[i], AREAS[i % len(AREAS)], views, saves, plans, joins, actions, complete, rng.uniform(-.03, .34)])
    return pd.DataFrame(rows, columns=["activity", "category", "area", "views", "saves", "plans", "joins", "actions", "complete", "growth"])

@st.cache_data

def build_communities():
    return pd.DataFrame([
        ["الأحياء", 18600, 4210, 0.18, "الخدمات المحلية، توصيات الأحياء", "توصيات"],
        ["زوار مكة", 24400, 5720, 0.24, "أماكن قريبة، تنظيم اليوم", "أسئلة"],
        ["الحج والعمرة", 19800, 4630, 0.15, "التجهيز، التنقل، التجربة", "تحديثات"],
        ["المطاعم والتجارب", 27900, 6840, 0.31, "مطاعم عائلية، قهوة، تجارب", "توصيات"],
        ["الثقافة والتاريخ", 14300, 3560, 0.27, "المعالم، الحكايات، المتاحف", "مساهمات"],
        ["التطوع والمبادرات", 9100, 2080, 0.12, "فرص التطوع، مبادرات الحي", "تحديثات"],
        ["التعليم والهوايات", 12100, 2990, 0.22, "ورش، تعلم، نوادٍ", "أسئلة"],
        ["الحياة في مكة", 17100, 4030, 0.20, "الخدمات اليومية، العائلة", "تقارير"],
    ], columns=["community", "members", "engagement", "discussion_growth", "themes", "top_contribution"])

@st.cache_data

def build_campaigns():
    return pd.DataFrame([
        ["عطلة نهاية الأسبوع", "الترفيه", "سكان مكة", 185000, 70400, 26100, 8200, 3900, 0.14],
        ["تجارب المساء", "التجارب والأنشطة", "الزوار", 214000, 88300, 34700, 11700, 5800, 0.19],
        ["نكهات مكة", "المطاعم والمقاهي", "الكل", 268000, 112000, 45600, 16100, 7900, 0.23],
        ["اكتشف الثقافة", "الثقافة", "الزوار", 149000, 61100, 23100, 7700, 3600, 0.17],
        ["قريب منك", "الخدمات", "سكان مكة", 132000, 49200, 17800, 5400, 2100, 0.08],
    ], columns=["campaign", "category", "audience", "impressions", "views", "details", "saves", "handoffs", "growth"])

@st.cache_data

def build_opportunities():
    rows = []
    rng = np.random.default_rng(111)
    for area in AREAS:
        for cat in CATEGORIES:
            demand = int(np.clip(55 + 26*(AREA_FACTOR[area]-0.7) + 18*(CATEGORY_FACTOR[cat]-0.7) + rng.normal(0,7), 35, 96))
            growth = CATEGORY_GROWTH[cat] + rng.normal(0.03, 0.055)
            supply = int(np.clip(72 - 0.55*demand + rng.normal(25,8), 18, 83))
            score = round(0.56*demand + 80*max(growth, 0) + 0.35*(100-supply), 1)
            reason = "طلب مرتفع مع عرض محدود" if demand > 74 and supply < 50 else (
                "اهتمام متزايد مع قلة الخيارات" if growth > .15 else (
                    "بحث متكرر مقابل نتائج محدودة" if demand > 65 and supply < 58 else "إشارة تستحق المتابعة"
                )
            )
            rows.append([area, cat, demand, growth, supply, score, reason])
    return pd.DataFrame(rows, columns=["area", "category", "demand_index", "growth", "supply_index", "score", "reason"])

DAILY = build_daily_data()
ACTIVITIES = build_activities()
COMMUNITIES = build_communities()
CAMPAIGNS = build_campaigns()
OPPORTUNITIES = build_opportunities()

SEARCH_TERMS = pd.DataFrame([
    ["مطاعم عائلية", "المطاعم والمقاهي", 92, .16],
    ["قهوة مختصة", "المطاعم والمقاهي", 88, .11],
    ["أنشطة للأطفال", "الترفيه", 84, .27],
    ["فعاليات نهاية الأسبوع", "التجارب والأنشطة", 81, .22],
    ["تجارب ثقافية", "الثقافة", 74, .31],
    ["أماكن هادئة", "التجارب والأنشطة", 72, .18],
    ["ورش فنية", "الثقافة", 66, .35],
    ["أماكن قريبة", "الخدمات", 64, .09],
    ["مطاعم بإطلالة", "المطاعم والمقاهي", 61, .14],
    ["أنشطة مسائية", "الترفيه", 59, .29],
    ["تجارب للعائلة", "التجارب والأنشطة", 57, .24],
    ["متاحف", "الثقافة", 49, .07],
], columns=["term", "category", "index", "growth"])

AREA_COORDS = pd.DataFrame([
    ["العزيزية", 6.4, 4.8], ["الشوقية", 3.1, 3.0], ["العوالي", 5.7, 1.9],
    ["النسيم", 7.8, 3.3], ["الزاهر", 3.8, 6.1], ["الشرائع", 9.2, 5.5], ["بطحاء قريش", 4.7, 0.8],
], columns=["area", "x", "y"])

# -----------------------------
# Formatting / chart helpers
# -----------------------------
def ar_num(value, decimals=0):
    if abs(value) >= 1_000_000:
        return f"{value/1_000_000:.1f}M"
    if abs(value) >= 1_000:
        return f"{value/1_000:.1f}K"
    if decimals:
        return f"{value:.{decimals}f}"
    return f"{int(value):,}"


def pct(v):
    return f"{v*100:+.0f}%"


def apply_chart_style(fig, height=350, showlegend=True):
    fig.update_layout(
        height=height,
        margin=dict(l=10, r=10, t=38, b=10),
        paper_bgcolor="rgba(0,0,0,0)",
        plot_bgcolor="rgba(0,0,0,0)",
        font=dict(family="Arial", color=TEXT, size=12),
        legend=dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1),
        showlegend=showlegend,
        hoverlabel=dict(bgcolor=PAPER, font_color=TEXT),
    )
    fig.update_xaxes(showgrid=False, zeroline=False, linecolor="rgba(0,0,0,0)")
    fig.update_yaxes(gridcolor="rgba(117,110,100,0.12)", zeroline=False, linecolor="rgba(0,0,0,0)")
    return fig


def kpi_card(label, value, delta, note="مقارنة بالفترة السابقة"):
    cls = "kpi-delta-up" if delta >= 0 else "kpi-delta-down"
    arrow = "↑" if delta >= 0 else "↓"
    return f"""
    <div class="kpi-card">
        <div class="kpi-label">{label}</div>
        <div class="kpi-value">{value}</div>
        <div class="{cls}">{arrow} {abs(delta)*100:.0f}%</div>
        <div class="kpi-note">{note}</div>
    </div>
    """


def section_header(title, copy=None):
    text = f'<div class="section-title">{title}</div>'
    if copy:
        text += f'<div class="section-copy">{copy}</div>'
    st.markdown(text, unsafe_allow_html=True)


def insight(text, reasons=None):
    r = ""
    if reasons:
        r = "<div class='insight-reason'><b>لماذا ظهرت هذه الرؤية؟</b> · " + " · ".join(reasons) + "</div>"
    st.markdown(
        f"<div class='insight-box'><div class='insight-label'>رؤية تحليلية · نموذج توضيحي</div><div class='insight-text'>{text}</div>{r}</div>",
        unsafe_allow_html=True,
    )


def page_header(title, subtitle):
    st.markdown(
        f"<div class='eyebrow'>EYEMAKKAH BUSINESS INTELLIGENCE</div><div class='page-title'>{title}</div><div class='page-subtitle'>{subtitle}</div><div class='hero-rule'></div>",
        unsafe_allow_html=True,
    )


def previous_period_delta(df, metric, days):
    if df.empty:
        return 0.0
    end = df["date"].max()
    current_start = end - pd.Timedelta(days=days-1)
    prev_start = current_start - pd.Timedelta(days=days)
    prev_end = current_start - pd.Timedelta(days=1)
    cur = df[(df.date >= current_start) & (df.date <= end)][metric].sum()
    prev = df[(df.date >= prev_start) & (df.date <= prev_end)][metric].sum()
    if prev <= 0:
        return 0.0
    return (cur - prev) / prev


def filtered_base(period_label, area, category, audience):
    days = {"آخر 7 أيام": 7, "آخر 30 يومًا": 30, "آخر 3 أشهر": 90, "آخر 12 شهرًا": 365}[period_label]
    cutoff = DAILY.date.max() - pd.Timedelta(days=days-1)
    df = DAILY[DAILY.date >= cutoff].copy()
    if area != "مكة المكرمة":
        df = df[df.area == area]
    if category != "الكل":
        df = df[df.category == category]
    if audience != "الكل":
        df = df[df.audience == audience]
    return df, days


def global_filters():
    cols = st.columns([1.05, 1.05, 1.25, 1.0])
    with cols[0]:
        period = st.selectbox("الفترة الزمنية", ["آخر 30 يومًا", "آخر 7 أيام", "آخر 3 أشهر", "آخر 12 شهرًا"], index=0)
    with cols[1]:
        area = st.selectbox("المنطقة", ["مكة المكرمة"] + AREAS, index=0)
    with cols[2]:
        category = st.selectbox("القطاع / الفئة", ["الكل"] + CATEGORIES, index=0)
    with cols[3]:
        audience = st.selectbox("نوع الجمهور", ["الكل"] + AUDIENCES, index=0)
    return period, area, category, audience

# -----------------------------
# Navigation
# -----------------------------
st.sidebar.markdown(
    "<div class='sidebar-brand'><div class='sidebar-brand-main'>EyeMakkah</div><div class='sidebar-brand-sub'>منصة ذكاء الأعمال</div></div>",
    unsafe_allow_html=True,
)
PAGES = [
    "لوحة المعلومات",
    "تحليل الطلب",
    "تحليل المناطق",
    "الأنشطة والتجارب",
    "المجتمعات والاهتمامات",
    "الحملات والعروض",
    "الفرص والفجوات",
    "التقارير",
]
page = st.sidebar.radio("", PAGES, label_visibility="collapsed")
st.sidebar.markdown("<div class='sidebar-meta'>الإعدادات<br>آخر تحديث للنموذج: 21 سبتمبر 2026<br>بيانات اصطناعية لأغراض العرض</div>", unsafe_allow_html=True)

period, area, category, audience = global_filters()
df, selected_days = filtered_base(period, area, category, audience)

# -----------------------------
# Screen 1 — Executive dashboard
# -----------------------------
if page == "لوحة المعلومات":
    page_header("لوحة المعلومات", "لقطة تنفيذية لما يحدث عبر تجربة EyeMakkah، من الاهتمام والاكتشاف إلى التخطيط والانتقال للإجراء.")

    totals = df[["interactions", "active_users", "searches", "plans", "actions"]].sum()
    delta_df = DAILY.copy()
    if area != "مكة المكرمة": delta_df = delta_df[delta_df.area == area]
    if category != "الكل": delta_df = delta_df[delta_df.category == category]
    if audience != "الكل": delta_df = delta_df[delta_df.audience == audience]
    metrics = [
        ("إجمالي التفاعلات", ar_num(totals.interactions), previous_period_delta(delta_df, "interactions", selected_days)),
        ("المستخدمون النشطون", ar_num(totals.active_users), previous_period_delta(delta_df, "active_users", selected_days)),
        ("عمليات البحث", ar_num(totals.searches), previous_period_delta(delta_df, "searches", selected_days)),
        ("الإضافات إلى «خطتي»", ar_num(totals.plans), previous_period_delta(delta_df, "plans", selected_days)),
        ("الانتقال إلى الإجراء", ar_num(totals.actions), previous_period_delta(delta_df, "actions", selected_days)),
    ]
    cols = st.columns(5)
    for c, item in zip(cols, metrics):
        with c:
            st.markdown(kpi_card(*item), unsafe_allow_html=True)

    st.markdown("<br>", unsafe_allow_html=True)
    c1, c2 = st.columns([1.55, 1])
    with c1:
        section_header("اتجاهات الطلب عبر الزمن", "يتتبع البحث والحفظ والإضافة إلى خطتي للفترة المحددة.")
        trend = df.groupby("date")[["searches", "saves", "plans"]].sum().reset_index()
        trend = trend.melt("date", var_name="metric", value_name="value")
        labels = {"searches": "بحث", "saves": "حفظ", "plans": "إضافة إلى خطتي"}
        trend["metric"] = trend.metric.map(labels)
        fig = px.line(trend, x="date", y="value", color="metric", color_discrete_sequence=[GREEN, GOLD, CLAY])
        fig.update_traces(line=dict(width=2.6))
        apply_chart_style(fig, 340)
        fig.update_layout(xaxis_title="", yaxis_title="")
        st.plotly_chart(fig, use_container_width=True, config={"displayModeBar": False})
    with c2:
        section_header("أكثر القطاعات جذبًا للاهتمام", "حصة التفاعلات حسب الفئة.")
        cat = df.groupby("category").interactions.sum().sort_values(ascending=True).tail(7).reset_index()
        fig = px.bar(cat, x="interactions", y="category", orientation="h", color_discrete_sequence=[GREEN])
        fig.update_traces(marker_line_width=0, hovertemplate="%{y}<br>%{x:,.0f} تفاعل<extra></extra>")
        apply_chart_style(fig, 340, False)
        fig.update_layout(xaxis_title="", yaxis_title="")
        st.plotly_chart(fig, use_container_width=True, config={"displayModeBar": False})

    area_growth = OPPORTUNITIES.groupby("area").growth.mean().sort_values(ascending=False)
    top_area = area_growth.index[0]
    top_growth = area_growth.iloc[0]
    opp = OPPORTUNITIES.sort_values("score", ascending=False).iloc[0]
    insight(
        f"يتسارع الاهتمام في <b>{top_area}</b> بالتزامن مع إشارات طلب مرتفعة في <b>{opp['category']}</b>. الإشارة مناسبة للاستكشاف واتخاذ القرار، وليست توقعًا تجاريًا مضمونًا.",
        [f"نمو متوسط {top_growth*100:.0f}%", "ارتفاع البحث والحفظ", "مقارنة مستوى العرض بالطلب"],
    )

    c3, c4 = st.columns([1.05, 1])
    with c3:
        section_header("المناطق الأعلى نموًا في الاهتمام", "متوسط اتجاه النمو في مؤشرات الفرص التجريبية.")
        adf = area_growth.reset_index().rename(columns={"growth": "growth"}).head(7)
        fig = px.bar(adf, x="area", y="growth", color="growth", color_continuous_scale=[[0, SAND], [1, GREEN]])
        fig.update_layout(coloraxis_showscale=False)
        fig.update_yaxes(tickformat=".0%")
        apply_chart_style(fig, 310, False)
        fig.update_layout(xaxis_title="", yaxis_title="")
        st.plotly_chart(fig, use_container_width=True, config={"displayModeBar": False})
    with c4:
        section_header("مختصر المجتمعات", "الموضوعات التي تجمع نمو النقاش مع نشاط مرتفع.")
        cm = COMMUNITIES.sort_values(["discussion_growth", "engagement"], ascending=False).head(5).copy()
        for _, r in cm.iterrows():
            st.markdown(
                f"<div style='padding:.62rem 0;border-bottom:1px solid rgba(117,110,100,.12)'><b>{r.community}</b><span style='float:left;color:{GREEN};font-weight:800'>{r.discussion_growth*100:.0f}% ↑</span><div style='color:{MUTED};font-size:.78rem;margin-top:.2rem'>{r.themes}</div></div>",
                unsafe_allow_html=True,
            )

# -----------------------------
# Screen 2 — Demand
# -----------------------------
elif page == "تحليل الطلب":
    page_header("تحليل الطلب", "فهم ما يبحث عنه المستخدمون، متى يرتفع الاهتمام، وكيف ينتقل الطلب من البحث إلى الإجراء.")

    c1, c2 = st.columns([1.45, 1])
    with c1:
        section_header("الطلب عبر الزمن", "عمليات البحث مقارنة بالإضافات إلى خطتي والانتقال للإجراء.")
        t = df.groupby("date")[["searches", "plans", "actions"]].sum().reset_index().melt("date", var_name="metric", value_name="value")
        t["metric"] = t.metric.map({"searches":"بحث", "plans":"إضافة إلى خطتي", "actions":"انتقال للإجراء"})
        fig = px.area(t, x="date", y="value", color="metric", color_discrete_sequence=[GREEN, GOLD, CLAY])
        apply_chart_style(fig, 340)
        fig.update_layout(xaxis_title="", yaxis_title="")
        st.plotly_chart(fig, use_container_width=True, config={"displayModeBar": False})
    with c2:
        section_header("أسرع عمليات البحث نموًا", "مؤشر تجريبي مبني على بيانات اصطناعية.")
        s = SEARCH_TERMS.copy()
        if category != "الكل": s = s[s.category == category]
        s = s.sort_values("growth", ascending=True).tail(7)
        fig = px.bar(s, x="growth", y="term", orientation="h", color_discrete_sequence=[GOLD])
        fig.update_xaxes(tickformat=".0%")
        apply_chart_style(fig, 340, False)
        fig.update_layout(xaxis_title="", yaxis_title="")
        st.plotly_chart(fig, use_container_width=True, config={"displayModeBar": False})

    c3, c4 = st.columns(2)
    with c3:
        section_header("أكثر مصطلحات البحث", "ترتيب نسبي للاهتمام في النموذج.")
        s = SEARCH_TERMS.copy()
        if category != "الكل": s = s[s.category == category]
        st.dataframe(
            s.sort_values("index", ascending=False).rename(columns={"term":"مصطلح البحث","category":"الفئة","index":"مؤشر الطلب","growth":"النمو"})[["مصطلح البحث","الفئة","مؤشر الطلب","النمو"]],
            use_container_width=True, hide_index=True,
            column_config={"النمو": st.column_config.ProgressColumn(format="%.0f%%", min_value=0, max_value=.4)},
        )
    with c4:
        section_header("سكان مكة مقابل الزوار", "مقارنة إجمالي الطلب حسب نوع الجمهور ضمن الفلاتر الحالية.")
        aud = df.groupby("audience")[["searches", "plans", "actions"]].sum().reset_index().melt("audience", var_name="metric", value_name="value")
        aud["metric"] = aud.metric.map({"searches":"بحث","plans":"خطتي","actions":"إجراء"})
        fig = px.bar(aud, x="audience", y="value", color="metric", barmode="group", color_discrete_sequence=[GREEN, GOLD, CLAY])
        apply_chart_style(fig, 325)
        fig.update_layout(xaxis_title="", yaxis_title="")
        st.plotly_chart(fig, use_container_width=True, config={"displayModeBar": False})

    section_header("رحلة الطلب", "كل مرحلة إشارة مستقلة؛ الحفظ لا يساوي الإضافة إلى خطتي، والإضافة لا تعني حجزًا أو إكمالًا.")
    funnel_vals = [df.searches.sum(), df.views.sum(), df.saves.sum(), df.plans.sum(), df.actions.sum()]
    funnel_names = ["بحث", "عرض التفاصيل", "حفظ", "إضافة إلى خطتي", "انتقال للإجراء"]
    fig = go.Figure(go.Funnel(y=funnel_names, x=funnel_vals, textinfo="value+percent initial", marker={"color":[GREEN,"#37695D",GOLD,"#C6AA72",CLAY]}))
    apply_chart_style(fig, 345, False)
    st.plotly_chart(fig, use_container_width=True, config={"displayModeBar": False})
    insight("تظهر البيانات التجريبية أن جزءًا مهمًا من الطلب يتوقف بعد الحفظ وقبل الإضافة إلى «خطتي»؛ هذه نقطة مناسبة لاختبار تحسينات تجربة التخطيط.", ["معدل حفظ مرتفع", "هبوط بين الحفظ والخطة", "تفاوت حسب الفئة"])

# -----------------------------
# Screen 3 — Areas
# -----------------------------
elif page == "تحليل المناطق":
    page_header("تحليل المناطق", "قراءة جغرافية مبسطة للاهتمام والطلب والفرص على مستوى أحياء ومناطق مكة.")
    selected_area = st.selectbox("المنطقة قيد التحليل", AREAS, index=AREAS.index(area) if area in AREAS else 0)
    area_df = DAILY[DAILY.area == selected_area].copy()
    cutoff = DAILY.date.max() - pd.Timedelta(days=selected_days-1)
    area_df = area_df[area_df.date >= cutoff]
    if category != "الكل": area_df = area_df[area_df.category == category]
    if audience != "الكل": area_df = area_df[area_df.audience == audience]

    opp_area = OPPORTUNITIES[OPPORTUNITIES.area == selected_area]
    demand_index = round(opp_area.demand_index.mean())
    growth = opp_area.growth.mean()
    top_cat = opp_area.sort_values("demand_index", ascending=False).iloc[0].category
    peak = "المساء 7–10 م" if selected_area in ["العوالي", "العزيزية", "الشوقية"] else "العصر 4–7 م"
    cols = st.columns(4)
    items = [
        ("مستوى الاهتمام", f"{demand_index}/100", growth),
        ("نمو الطلب", f"{growth*100:.0f}%", growth),
        ("الفئة الأبرز", top_cat, CATEGORY_GROWTH[top_cat]),
        ("وقت الذروة", peak, .06),
    ]
    for c, i in zip(cols, items):
        with c: st.markdown(kpi_card(*i), unsafe_allow_html=True)

    c1, c2 = st.columns([1.05, 1])
    with c1:
        section_header("خريطة اهتمام مبسطة", "تمثيل بصري تجريبي وليس نظام GIS تشغيليًا.")
        mapdf = AREA_COORDS.merge(OPPORTUNITIES.groupby("area").agg(demand=("demand_index","mean"), growth=("growth","mean")).reset_index(), on="area")
        mapdf["selected"] = np.where(mapdf.area == selected_area, "المنطقة المحددة", "مناطق أخرى")
        fig = px.scatter(mapdf, x="x", y="y", size="demand", color="selected", text="area", size_max=34,
                         color_discrete_map={"المنطقة المحددة":GOLD,"مناطق أخرى":GREEN})
        fig.update_traces(textposition="top center", marker=dict(line=dict(width=1,color=PAPER)))
        apply_chart_style(fig, 390, False)
        fig.update_xaxes(visible=False); fig.update_yaxes(visible=False)
        fig.update_layout(showlegend=False)
        st.plotly_chart(fig, use_container_width=True, config={"displayModeBar": False})
    with c2:
        section_header("الفئات الأعلى طلبًا", f"داخل {selected_area} للفترة الحالية.")
        cat = area_df.groupby("category").interactions.sum().sort_values(ascending=True).tail(7).reset_index()
        fig = px.bar(cat, x="interactions", y="category", orientation="h", color_discrete_sequence=[GREEN])
        apply_chart_style(fig, 390, False)
        fig.update_layout(xaxis_title="", yaxis_title="")
        st.plotly_chart(fig, use_container_width=True, config={"displayModeBar": False})

    top_opp = opp_area.sort_values("score", ascending=False).iloc[0]
    insight(
        f"شهدت <b>{selected_area}</b> نموًا في الاهتمام بـ <b>{top_opp.category}</b>، بينما يظل مؤشر العرض التجريبي أقل من مؤشر الطلب. هذه إشارة لدراسة الاحتياج، وليست ضمانًا لفرصة تجارية.",
        [f"مؤشر طلب {top_opp.demand_index}/100", f"نمو {top_opp.growth*100:.0f}%", f"مؤشر عرض {top_opp.supply_index}/100"],
    )

# -----------------------------
# Screen 4 — Activities
# -----------------------------
elif page == "الأنشطة والتجارب":
    page_header("الأنشطة والتجارب", "تحليل سلوك المشاركة مع الحفاظ على الفرق بين العرض، الحفظ، التخطيط، الانضمام، الانتقال للإجراء، والإكمال.")
    adf = ACTIVITIES.copy()
    if area != "مكة المكرمة": adf = adf[adf.area == area]
    if category != "الكل": adf = adf[adf.category == category]
    if adf.empty:
        st.info("لا توجد أنشطة تجريبية مطابقة لهذه الفلاتر. جرّب توسيع المنطقة أو الفئة.")
    else:
        best = adf.sort_values("plans", ascending=False).iloc[0]
        cols = st.columns(5)
        metrics = [
            ("الأكثر مشاهدة", adf.loc[adf.views.idxmax(),"activity"], .12),
            ("الأكثر حفظًا", adf.loc[adf.saves.idxmax(),"activity"], .16),
            ("الأكثر إضافة إلى خطتي", best.activity, best.growth),
            ("الأعلى في نية الحضور", adf.loc[adf.joins.idxmax(),"activity"], .09),
            ("الأعلى انتقالًا للإجراء", adf.loc[adf.actions.idxmax(),"activity"], .11),
        ]
        for c, m in zip(cols, metrics):
            with c: st.markdown(kpi_card(*m, note="ضمن بيانات النموذج"), unsafe_allow_html=True)

        c1, c2 = st.columns([1.15, 1])
        with c1:
            section_header("قمع التفاعل", "المراحل منفصلة ولا يتم دمجها في «تحويل» واحد.")
            sums = adf[["views","saves","plans","joins","actions","complete"]].sum()
            fig = go.Figure(go.Funnel(
                y=["عرض", "حفظ", "إضافة إلى خطتي", "انضمام / نية حضور", "انتقال للإجراء", "إكمال"],
                x=sums.values,
                textinfo="value+percent initial",
                marker={"color":[GREEN,"#37695D",GOLD,"#C6AA72",CLAY,"#7B6C5B"]},
            ))
            apply_chart_style(fig, 390, False)
            st.plotly_chart(fig, use_container_width=True, config={"displayModeBar": False})
        with c2:
            section_header("مقارنة الفئات", "الحفظ والخطة والإجراء حسب فئة النشاط.")
            cdf = adf.groupby("category")[["saves","plans","actions"]].sum().reset_index().melt("category", var_name="metric", value_name="value")
            cdf["metric"] = cdf.metric.map({"saves":"حفظ","plans":"خطتي","actions":"إجراء"})
            fig = px.bar(cdf, x="category", y="value", color="metric", barmode="group", color_discrete_sequence=[GREEN,GOLD,CLAY])
            apply_chart_style(fig, 390)
            fig.update_layout(xaxis_title="", yaxis_title="")
            st.plotly_chart(fig, use_container_width=True, config={"displayModeBar": False})

        section_header("أداء الأنشطة", "ترتيب تفاعلي للأنشطة مع مؤشرات كل مرحلة.")
        table = adf.sort_values("plans", ascending=False).rename(columns={
            "activity":"النشاط","category":"الفئة","area":"المنطقة","views":"عرض","saves":"حفظ","plans":"خطتي","joins":"انضمام","actions":"إجراء","complete":"إكمال","growth":"النمو"
        })
        st.dataframe(table[["النشاط","الفئة","المنطقة","عرض","حفظ","خطتي","انضمام","إجراء","إكمال","النمو"]], use_container_width=True, hide_index=True,
                     column_config={"النمو": st.column_config.ProgressColumn(format="%.0f%%", min_value=-.05, max_value=.35)})

# -----------------------------
# Screen 5 — Communities
# -----------------------------
elif page == "المجتمعات والاهتمامات":
    page_header("المجتمعات والاهتمامات", "ذكاء مجتمعي يركز على أنماط الموضوعات والمشاركة، دون ملفات نفسية أو تعرّف على الأفراد.")
    c1, c2 = st.columns([1.2, 1])
    with c1:
        section_header("المجتمعات الأكثر نشاطًا", "حجم التفاعل ونمو النقاش.")
        fig = px.scatter(COMMUNITIES, x="engagement", y="discussion_growth", size="members", text="community",
                         color="discussion_growth", color_continuous_scale=[[0,SAND],[1,GREEN]], size_max=46)
        fig.update_traces(textposition="top center")
        fig.update_xaxes(title="التفاعل"); fig.update_yaxes(title="نمو النقاش", tickformat=".0%")
        apply_chart_style(fig, 390, False); fig.update_layout(coloraxis_showscale=False)
        st.plotly_chart(fig, use_container_width=True, config={"displayModeBar": False})
    with c2:
        section_header("أنماط المساهمة", "نوع المساهمة الأكثر ظهورًا في كل مجتمع.")
        contribution = COMMUNITIES.groupby("top_contribution").engagement.sum().sort_values(ascending=False).reset_index()
        fig = px.pie(contribution, values="engagement", names="top_contribution", hole=.62,
                     color_discrete_sequence=[GREEN,GOLD,CLAY,"#7A8F83","#B7A98F"])
        fig.update_traces(textinfo="percent+label")
        apply_chart_style(fig, 390, False)
        st.plotly_chart(fig, use_container_width=True, config={"displayModeBar": False})

    section_header("موضوعات تكتسب زخمًا", "ملخص نوعي للنقاشات التجريبية وليس تحليلًا نفسيًا للمستخدمين.")
    cols = st.columns(4)
    topics = [
        ("أنشطة الأطفال", "+34%", "أسئلة وتوصيات نهاية الأسبوع"),
        ("تجارب المساء", "+29%", "اقتراحات لأنشطة اجتماعية"),
        ("الورش الإبداعية", "+27%", "بحث عن تجارب قصيرة"),
        ("أماكن قريبة", "+18%", "طلب خيارات حسب الحي"),
    ]
    for c,(t,g,d) in zip(cols,topics):
        with c:
            st.markdown(f"<div class='kpi-card'><div class='kpi-label'>{d}</div><div class='kpi-value' style='font-size:1.12rem'>{t}</div><div class='kpi-delta-up'>↑ {g}</div></div>", unsafe_allow_html=True)
    insight("أعلى نمو للنقاش التجريبي يظهر حول الأنشطة المناسبة للعائلة والخيارات المسائية، مع تكرار أسئلة «ما القريب مني؟» و«ماذا يمكن أن نفعل هذا الأسبوع؟». ", ["نمو الأسئلة", "زيادة التوصيات", "ارتفاع الحفظ المرتبط بالموضوع"])

# -----------------------------
# Screen 6 — Campaigns
# -----------------------------
elif page == "الحملات والعروض":
    page_header("الحملات والعروض", "قراءة أداء حملات تجريبية للشركاء والعلامات التجارية من الظهور حتى الانتقال إلى العرض أو الإجراء.")
    cdf = CAMPAIGNS.copy()
    if category != "الكل": cdf = cdf[cdf.category == category]
    if audience != "الكل": cdf = cdf[(cdf.audience == audience) | (cdf.audience == "الكل")]
    if cdf.empty:
        st.info("لا توجد حملات تجريبية مطابقة للفلاتر المحددة.")
    else:
        campaign = st.selectbox("اختر حملة", cdf.campaign.tolist())
        row = cdf[cdf.campaign == campaign].iloc[0]
        cols = st.columns(5)
        vals = [
            ("الظهور", ar_num(row.impressions), row.growth),
            ("المشاهدة", ar_num(row.views), .12),
            ("فتح التفاصيل", ar_num(row.details), .09),
            ("الحفظ", ar_num(row.saves), .16),
            ("الانتقال للعرض", ar_num(row.handoffs), .13),
        ]
        for c,m in zip(cols,vals):
            with c: st.markdown(kpi_card(*m), unsafe_allow_html=True)
        c1,c2=st.columns([1.2,1])
        with c1:
            section_header("قمع الحملة", f"أداء «{campaign}» عبر مراحل التفاعل.")
            values=[row.impressions,row.views,row.details,row.saves,int(row.saves*.44),row.handoffs]
            names=["ظهور","مشاهدة","فتح التفاصيل","حفظ","إضافة إلى الخطة","انتقال إلى العرض"]
            fig=go.Figure(go.Funnel(y=names,x=values,textinfo="value+percent initial",marker={"color":[GREEN,"#37695D",GOLD,"#C6AA72",CLAY,"#7B6C5B"]}))
            apply_chart_style(fig,385,False)
            st.plotly_chart(fig,use_container_width=True,config={"displayModeBar":False})
        with c2:
            section_header("الأداء الجغرافي", "توزيع تجريبي للاستجابة حسب المنطقة.")
            tmp=pd.DataFrame({"area":AREAS,"value":[1.18,1.02,.94,.82,.78,.69,.63]})
            tmp["value"]=tmp.value*row.handoffs/6
            fig=px.bar(tmp.sort_values("value"),x="value",y="area",orientation="h",color_discrete_sequence=[GREEN])
            apply_chart_style(fig,385,False); fig.update_layout(xaxis_title="",yaxis_title="")
            st.plotly_chart(fig,use_container_width=True,config={"displayModeBar":False})

# -----------------------------
# Screen 7 — Opportunities
# -----------------------------
elif page == "الفرص والفجوات":
    page_header("الفرص والفجوات", "إشارات دعم قرار تجمع الطلب والنمو ومستوى العرض. لا تمثل هذه الإشارات ضمانًا لجدوى مشروع أو استثمار.")
    odf = OPPORTUNITIES.copy()
    if area != "مكة المكرمة": odf = odf[odf.area == area]
    if category != "الكل": odf = odf[odf.category == category]
    odf = odf.sort_values("score", ascending=False)
    if odf.empty:
        st.info("لا توجد إشارات مطابقة للفلاتر الحالية.")
    else:
        top=odf.iloc[0]
        insight(f"أقوى إشارة في الفلاتر الحالية تظهر في <b>{top.area}</b> ضمن <b>{top.category}</b>: {top.reason}. يوصى باستخدامها كنقطة بداية للتحقق الميداني ودراسة السوق.", [f"مؤشر طلب {top.demand_index}", f"نمو {top.growth*100:.0f}%", f"مؤشر عرض {top.supply_index}"])
        c1,c2=st.columns([1.2,1])
        with c1:
            section_header("مصفوفة الطلب مقابل العرض", "أعلى اليسار نسبيًا يشير إلى طلب قوي وعرض أقل.")
            fig=px.scatter(odf,x="supply_index",y="demand_index",size="score",color="growth",hover_name="area",hover_data=["category","reason"],
                           color_continuous_scale=[[0,SAND],[1,GREEN]],size_max=28)
            fig.update_xaxes(title="مؤشر العرض",range=[10,90]); fig.update_yaxes(title="مؤشر الطلب",range=[30,100])
            apply_chart_style(fig,400,False); fig.update_layout(coloraxis_colorbar_title="النمو")
            st.plotly_chart(fig,use_container_width=True,config={"displayModeBar":False})
        with c2:
            section_header("الإشارات الأعلى", "ترتيب وفق مؤشر تجريبي مركب للطلب والنمو والفجوة.")
            top5=odf.head(6)
            for _,r in top5.iterrows():
                st.markdown(f"<div style='padding:.68rem 0;border-bottom:1px solid rgba(117,110,100,.12)'><b>{r.area} · {r.category}</b><span style='float:left;color:{GOLD};font-weight:900'>{r.score:.0f}</span><div style='color:{MUTED};font-size:.76rem;margin-top:.2rem'>{r.reason} · نمو {r.growth*100:.0f}%</div></div>",unsafe_allow_html=True)
        section_header("جدول الفرص", "تفاصيل الإشارات الداعمة للقرار.")
        table=odf.rename(columns={"area":"المنطقة","category":"الفئة","demand_index":"مؤشر الطلب","growth":"اتجاه النمو","supply_index":"مستوى العرض","reason":"سبب ظهور الفرصة","score":"مؤشر الإشارة"})
        st.dataframe(table[["المنطقة","الفئة","مؤشر الطلب","اتجاه النمو","مستوى العرض","سبب ظهور الفرصة","مؤشر الإشارة"]],use_container_width=True,hide_index=True,
                     column_config={"اتجاه النمو":st.column_config.ProgressColumn(format="%.0f%%",min_value=-.05,max_value=.35)})

# -----------------------------
# Screen 8 — Reports
# -----------------------------
elif page == "التقارير":
    page_header("التقارير", "مركز مبسط لعرض التقارير الدورية وتصدير ملخصات البيانات التجريبية.")
    reports=[
        ("التقرير الشهري للطلب والاهتمام","ملخص البحث والحفظ والتخطيط واتجاهات الطلب."),
        ("تحليل مناطق مكة","مقارنة المناطق والفئات ومؤشرات النمو."),
        ("تقرير المجتمعات والاهتمامات","أنماط النقاش والمساهمة والموضوعات الصاعدة."),
        ("أداء الحملات والعروض","قمع الحملات والأداء حسب الجمهور والمنطقة."),
        ("تقرير الفرص والفجوات","إشارات الطلب مقابل العرض لدعم التحقق والدراسة."),
    ]
    for name,desc in reports:
        with st.expander(name, expanded=False):
            st.write(desc)
            st.caption(f"الفترة: {period} · المنطقة: {area} · الفئة: {category} · الجمهور: {audience}")
            st.write("يعرض النموذج بنية التقرير وتجربة التفاعل. البيانات توضيحية وليست بيانات تشغيلية حية.")

    section_header("تصدير ملخص CSV", "يحتوي الملف على مؤشرات مجمعة وفق الفلاتر الحالية.")
    summary = df.groupby(["area","category","audience"])[["interactions","active_users","searches","views","saves","plans","joins","actions","completes","contributes"]].sum().reset_index()
    summary = summary.rename(columns={
        "area":"المنطقة","category":"الفئة","audience":"الجمهور","interactions":"التفاعلات","active_users":"المستخدمون النشطون",
        "searches":"البحث","views":"العرض","saves":"الحفظ","plans":"الإضافة إلى خطتي","joins":"الانضمام","actions":"الانتقال للإجراء",
        "completes":"الإكمال","contributes":"المساهمات"
    })
    csv = summary.to_csv(index=False).encode("utf-8-sig")
    st.download_button("تصدير CSV", data=csv, file_name="EyeMakkah_BI_demo_summary.csv", mime="text/csv")
    st.dataframe(summary.head(30), use_container_width=True, hide_index=True)

st.markdown("<div class='data-note'>البيانات المعروضة في هذا النموذج توضيحية لأغراض تصميم وتجربة المنصة، ولا تمثل بيانات تشغيلية حية أو معلومات عن أفراد.</div>", unsafe_allow_html=True)