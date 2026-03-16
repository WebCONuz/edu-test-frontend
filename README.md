# 🎓 Edu Test — Frontend

Test yechish platformasining frontend qismi. Next.js 15, TypeScript va shadcn/ui asosida qurilgan.

---

## 🛠 Texnologiyalar

| Texnologiya              | Maqsad                   |
| ------------------------ | ------------------------ |
| Next.js 15 (App Router)  | Frontend framework       |
| TypeScript               | Type safety              |
| Tailwind CSS v4          | Styling                  |
| shadcn/ui (Radix + Nova) | UI komponentlar          |
| TanStack Query           | Server state, caching    |
| Zustand + persist        | Client state (auth user) |
| React Hook Form + Zod    | Form validation          |
| react-katex + katex      | LaTeX formula render     |
| js-cookie                | Cookie management        |

---

## 📁 Loyiha strukturasi

```
edu-test-frontend/
├── app/                        → Next.js routing
│   ├── (auth)/                 → Himoyasiz sahifalar
│   │   ├── login/
│   │   ├── register/
│   │   ├── forgot-password/
│   │   └── reset-password/
│   ├── admin/                  → Admin panel (admin, super_admin)
│   │   ├── dashboard/
│   │   ├── users/
│   │   ├── subjects/
│   │   ├── questions/
│   │   ├── sessions/
│   │   └── students/
│   ├── teacher/                → Teacher panel
│   │   ├── dashboard/
│   │   ├── subjects/
│   │   └── questions/
│   ├── student/                → Student interfeysi (ochiq)
│   │   ├── test/
│   │   ├── result/
│   │   └── results/
│   ├── layout.tsx              → Root layout (Providers)
│   ├── page.tsx                → Landing page
│   └── providers.tsx           → QueryClientProvider
├── features/                   → Business logic (feature-based)
│   ├── auth/
│   │   ├── api/                → auth.api.ts
│   │   ├── components/         → LoginForm, RegisterForm, ForgotPasswordForm, ResetPasswordForm
│   │   ├── hooks/              → useLogin, useRegister, useForgotPassword, useResetPassword
│   │   ├── store/              → auth.store.ts (Zustand)
│   │   └── types/              → auth.types.ts
│   ├── students/
│   │   ├── api/                → students.api.ts
│   │   ├── components/         → StudentEntryForm, StudentTestPage, StudentResultPage, StudentMyResultsPage
│   │   ├── hooks/              → useStudentEntry, useStudentTest, useMyResults
│   │   └── types/              → student.types.ts
│   ├── subjects/
│   │   ├── api/                → subjects.api.ts
│   │   ├── hooks/              → useSubjects
│   │   └── types/              → subject.types.ts
│   └── landing/
│       └── components/         → LandingPage
├── shared/
│   ├── components/             → MathText (LaTeX render)
│   ├── hooks/                  → global hooks
│   ├── types/                  → react-katex.d.ts, global types
│   └── utils/                  → yordamchi funksiyalar
├── components/
│   └── ui/                     → shadcn komponentlari
├── lib/
│   ├── constants.ts            → API_URL, ROUTES
│   ├── fetcher.ts              → global fetch wrapper (401 → auto refresh)
│   └── query-client.ts         → TanStack Query sozlamalari
└── middleware.ts               → Rol tekshiruv + token refresh
```

---

## 👥 Rollar va sahifalar

| Rol           | Sahifalar                            |
| ------------- | ------------------------------------ |
| `super_admin` | `/admin/*`                           |
| `admin`       | `/admin/*`                           |
| `teacher`     | `/teacher/*`                         |
| Student       | `/student/*` (login shart emas)      |
| Hamma         | `/` (landing), `/login`, `/register` |

---

## 🔄 Student flow

```
/ (landing)
    ↓
/student → telefon + ism + fan + savol soni + vaqt
    ↓
check-phone → mavjud user → ism avtomatik to'ldiriladi
    ↓
/student/test → savollar + timer + progress
    ↓
/student/result → natija + tahlil
    ↓
/student/results → barcha testlar tarixi (telefon orqali)
```

---

## 🔒 Autentifikatsiya

- **Access token** — `httpOnly cookie` da (1 soat)
- **Refresh token** — `httpOnly cookie` da (1 kun)
- Frontend token ni ko'rmaydi — barcha so'rovlarda `credentials: 'include'`
- `middleware.ts` — har bir sahifaga kirishda token tekshiradi
- Token expire → `middleware` avtomatik `GET /auth/refresh` chaqiradi
- Refresh ham ishlamasa → `/` (landing) ga redirect
- `Zustand persist` — user ma'lumotlari (role, name) localStorage da

---

## ➕ LaTeX formulalar

Matematik formulalar `$...$` formatida keladi va `react-katex` orqali render qilinadi:

```tsx
import { MathText } from "@/shared/components/MathText";

<MathText text="$\frac{3}{4}$ kg un kerak" />;
// → ¾ kg un kerak
```

---

## 🚀 O'rnatish

### 1. Repozitoriyani clone qilish

```bash
git clone https://github.com/username/edu-test-frontend.git
cd edu-test-frontend
```

### 2. Paketlarni o'rnatish

```bash
npm install
```

### 3. `.env.local` fayl yaratish

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

### 4. Dasturni ishga tushirish

```bash
# Development
npm run dev

# Production
npm run build
npm run start
```

Dastur `http://localhost:3000` da ishga tushadi.

> ⚠️ Backend `http://localhost:4000` da ishlab turishi kerak. Backend repo: [edu-test-backend](https://github.com/username/edu-test-backend)

---

## 📖 Sahifalar

| URL                         | Tavsif              | Himoya                        |
| --------------------------- | ------------------- | ----------------------------- |
| `/`                         | Landing page        | Ochiq                         |
| `/login`                    | Tizimga kirish      | Ochiq (login bo'lsa redirect) |
| `/register`                 | Teacher ro'yxati    | Ochiq (login bo'lsa redirect) |
| `/forgot-password`          | Parolni tiklash     | Ochiq                         |
| `/reset-password?token=...` | Yangi parol         | Ochiq                         |
| `/student`                  | Test boshlash       | Ochiq                         |
| `/student/test`             | Test yechish        | Ochiq                         |
| `/student/result`           | Natija              | Ochiq                         |
| `/student/results`          | Barcha natijalar    | Ochiq                         |
| `/admin/dashboard`          | Admin bosh sahifa   | admin, super_admin            |
| `/admin/users`              | Foydalanuvchilar    | admin, super_admin            |
| `/admin/subjects`           | Fanlar              | admin, super_admin            |
| `/admin/questions`          | Savollar            | admin, super_admin            |
| `/admin/sessions`           | Sessiyalar          | admin, super_admin            |
| `/admin/students`           | Studentlar          | admin, super_admin            |
| `/teacher/dashboard`        | Teacher bosh sahifa | teacher                       |
| `/teacher/subjects`         | Fanlar              | teacher                       |
| `/teacher/questions`        | Savollar            | teacher                       |

---

## 🗂 Feature moduli strukturasi

Har bir feature quyidagi tuzilishda bo'ladi:

```
features/[feature-name]/
├── api/         → backend bilan muloqot (fetcher ishlatadi)
├── components/  → UI komponentlar
├── hooks/       → TanStack Query hooks (useQuery, useMutation)
├── store/       → Zustand store (agar kerak bo'lsa)
└── types/       → TypeScript interfeyslari
```

**Qoida:** `app/` papkasidagi `page.tsx` faqat feature komponentni chaqiradi — hech qanday logic yo'q.

```tsx
// app/student/page.tsx
import { StudentEntryForm } from "@/features/students/components/StudentEntryForm";
export default function StudentPage() {
  return <StudentEntryForm />;
}
```

---

## 📝 Litsenziya

MIT
