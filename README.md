# 📦 Wood Decor - تعليمات التثبيت

## هيكل الفولدرات المطلوب

```
MyProject/                        ← الفولدر الرئيسي
│
├── Backend/                      ← حط هنا الـ Backend بتاعك
│   ├── WebsiteBackend.sln
│   ├── Bl/
│   ├── DAL/
│   ├── Domains/
│   └── WoodDecorBackend/
│       ├── Apis.csproj
│       ├── appsettings.Production.json   ← انسخه من هنا
│       └── ...
│
├── frontend/                     ← حط هنا الـ Next.js بتاعك
│   ├── package.json
│   └── ...
│
├── backups/                      ← هيتعمل تلقائي (باك أب يومي)
│
├── Dockerfile.api                ← من هنا
├── Dockerfile.frontend           ← من هنا
├── docker-compose.yml            ← من هنا
└── install.bat                   ← من هنا
```

## خطوات التثبيت على جهاز العميل

1. حمّل **Docker Desktop** من: https://www.docker.com/products/docker-desktop/
2. افتح Docker Desktop وخليه يشتغل
3. ضغط دبل كليك على `install.bat`
4. افتح المتصفح على: http://localhost:3000

## ⚠️ مهم جداً

- **لا تكتب** `docker compose down -v` أبداً — ده بيمسح البيانات كلها!
- لو عايز توقف التطبيق بس اكتب: `docker compose down`
- البيانات بتتحفظ تلقائياً حتى لو الكمبيوتر اتقفل أو الـ container وقع
- الباك أب اليومي بيتحفظ في فولدر `backups/`
