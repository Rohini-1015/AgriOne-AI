# 🌾 AgriOne AI — Smart Farming Assistant Platform

AgriOne AI is an end-to-end intelligent agricultural advisory and marketplace platform designed to empower farmers with precision agronomy, real-time market insights, AI disease diagnosis, soil analytics, equipment rentals, and fair trade crop commerce.

---

## 🌟 Key Features

1. **AI Crop Doctor (`/disease-doctor`)**: Visual diagnostic engine for detecting leaf infections, fungal blights, and deficiencies with organic and chemical treatment plans.
2. **AI Crop Recommender (`/crop-recommend`)**: Multi-variable agronomic recommendation engine factoring soil N-P-K, pH, temperature, and season.
3. **Soil Health Evaluator (`/soil-health`)**: Comprehensive soil nutrient scoring, deficit alerts, and corrective advisories.
4. **Mandi Market Prices (`/market-prices`)**: Daily commodity pricing across APMC mandis.
5. **Weather & Spray Advisories (`/weather`)**: Micro-climate temperature, humidity, rainfall forecasts, and chemical spray alerts.
6. **Agri Marketplace (`/marketplace`)**: Direct-to-consumer farm produce store with shopping cart and PhonePe integration.
7. **Farm Services (`/services/*`)**: Machinery & tractor rentals, farm labour booking, and crop logistics.
8. **AgriBot AI Agronomist (`/agribot`)**: 24/7 conversational agricultural chatbot.
9. **Government Schemes (`/schemes`)**: Verified directory of farmer welfare schemes and subsidies.
10. **Admin Dashboard (`/admin`)**: Operations control center with GMV tracking, user management, and order status.
11. **Bilingual Support**: English & Tamil (தமிழ்).

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, React Router DOM, Axios.
- **Backend**: Node.js, Express, TypeScript, Prisma ORM (PostgreSQL ready with resilient in-memory fallback datastore), Zod, JWT, Multer.
- **Testing**: Automated end-to-end verification suite (`test_e2e_suite.js`).

---

## 🚀 Getting Started Locally

### 1. Backend Setup
```bash
cd backend
npm install
npm run dev
```
Backend runs on `http://localhost:5000` (API routes at `http://localhost:5000/api`).

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`.

---

## 🔑 Demo Test Accounts

| Role | Email | Password | Location |
| :--- | :--- | :--- | :--- |
| **Farmer** | `farmer@agrione.com` | `Farmer@123` | Thanjavur, Tamil Nadu |
| **Buyer** | `buyer@agrione.com` | `Buyer@123` | Chennai, Tamil Nadu |
| **Admin** | `admin@agrione.com` | `Admin@123` | Coimbatore, Tamil Nadu |
| **Expert** | `expert@agrione.com` | `Expert@123` | Coimbatore, Tamil Nadu |

---

## ☁️ Deployment Instructions

### Frontend on Vercel
1. Push repository to GitHub.
2. Import project into [Vercel](https://vercel.com).
3. Set **Root Directory** to `frontend`.
4. Framework Preset: **Vite**.
5. Set Environment Variable: `VITE_API_BASE_URL` to your live backend API URL (e.g. `https://your-backend.onrender.com/api`).
6. Click **Deploy**.

### Backend on Render / Railway
1. Import repository to [Render](https://render.com) as a **Web Service**.
2. Set **Root Directory** to `backend`.
3. Build Command: `npm install && npm run build`
4. Start Command: `npm start`
5. Click **Deploy**.
