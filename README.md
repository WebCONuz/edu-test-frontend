# 🎓 Edu Test — Frontend

Test yechish platformasining frontend qismi. Next.js 15, TypeScript, shadcn/ui asosida qurilgan to'liq funksional web ilova.

---

## 🛠 Texnologiyalar

| Texnologiya         | Versiya             | Maqsad                            |
| ------------------- | ------------------- | --------------------------------- |
| Next.js             | 15 (App Router)     | Frontend framework                |
| TypeScript          | 5+                  | Type safety                       |
| Tailwind CSS        | v4                  | Styling                           |
| shadcn/ui           | Radix + Nova preset | UI komponentlar                   |
| TanStack Query      | v5                  | Server state, caching, pagination |
| Zustand + persist   | latest              | Client state (auth user)          |
| React Hook Form     | latest              | Form management                   |
| Zod                 | latest              | Form validation                   |
| react-katex + katex | latest              | LaTeX formula render              |
| js-cookie           | latest              | Cookie management                 |

---

## 📁 Loyiha strukturasi

```
edu-test-frontend/
├── app/                          → Next.js routing (faqat page.tsx lar)
│   ├── (auth)/                   → Himoyasiz sahifalar (login bo'lsa redirect)
│   │   ├── login/
│   │   ├── register/
│   │   ├── forgot-password/
│   │   └── reset-password/
│   ├── admin/                    → Admin panel (admin, super_admin)
│   │   ├── layout.tsx            → Role-based sidebar (super_admin vs admin)
│   │   ├── dashboard/
│   │   ├── subjects/
│   │   ├── questions/
│   │   ├── students/
│   │   ├── sessions/
│   │   ├── users/                → Faqat super_admin
│   │   └── teachers/             → Faqat admin
│   ├── teacher/                  → Teacher panel
│   │   ├── layout.tsx
│   │   ├── dashboard/
│   │   ├── subjects/
│   │   └── questions/
│   ├── student/                  → Student interfeysi (login shart emas)
│   │   ├── test/
│   │   ├── result/
│   │   └── results/
│   ├── layout.tsx                → Root layout (QueryClientProvider)
│   ├── page.tsx                  → Landing page
│   └── providers.tsx             → TanStack Query provider
├── features/                     → Business logic (feature-based)
│   ├── auth/
│   │   ├── api/                  → auth.api.ts
│   │   ├── components/           → LoginForm, RegisterForm, ForgotPasswordForm, ResetPasswordForm
│   │   ├── hooks/                → useLogin, useRegister, useForgotPassword, useResetPassword
│   │   ├── store/                → auth.store.ts (Zustand — user, role)
│   │   └── types/                → auth.types.ts
│   ├── students/
│   │   ├── api/                  → students.api.ts
│   │   ├── components/           → StudentEntryForm, StudentTestPage, StudentResultPage, StudentMyResultsPage
│   │   ├── hooks/                → useStudentEntry, useStudentTest, useMyResults
│   │   └── types/                → student.types.ts
│   ├── subjects/
│   │   ├── api/                  → subjects.api.ts
│   │   ├── hooks/                → useSubjects
│   │   └── types/                → subject.types.ts
│   ├── teacher/
│   │   ├── api/                  → teacher.api.ts (subjects + questions CRUD + import)
│   │   ├── components/
│   │   │   ├── dashboard/        → TeacherDashboardPage
│   │   │   ├── subjects/         → TeacherSubjectsPage
│   │   │   └── questions/        → TeacherQuestionsPage
│   │   ├── hooks/                → teacher.hooks.ts
│   │   └── types/                → teacher.types.ts
│   ├── admin/
│   │   ├── api/                  → admin.api.ts (users + students + sessions)
│   │   ├── components/
│   │   │   ├── dashboard/        → AdminDashboardPage
│   │   │   ├── subjects/         → AdminSubjectsPage
│   │   │   ├── questions/        → AdminQuestionsPage
│   │   │   ├── students/         → AdminStudentsPage
│   │   │   ├── sessions/         → AdminSessionsPage
│   │   │   ├── users/            → AdminUsersPage (super_admin only)
│   │   │   └── teachers/         → AdminTeachersPage (admin only)
│   │   ├── hooks/                → admin.hooks.ts
│   │   └── types/                → admin.types.ts
│   └── landing/
│       └── components/           → LandingPage
├── shared/
│   ├── components/
│   │   ├── MathText.tsx          → LaTeX formula render
│   │   └── panel-layout/         → PanelSidebar, PanelHeader (shared)
│   ├── hooks/                    → global hooks
│   └── types/                    → react-katex.d.ts, global types
├── components/
│   └── ui/                       → shadcn komponentlari (auto-generated)
├── lib/
│   ├── constants.ts              → API_URL, ROUTES
│   ├── fetcher.ts                → Global fetch wrapper (401 → auto refresh)
│   └── query-client.ts           → TanStack Query sozlamalari
└── middleware.ts                 → Token tekshiruv + rol himoya + auto refresh
```

---

## 👥 Rollar va imkoniyatlar

| Imkoniyat                         | super_admin | admin | teacher        |
| --------------------------------- | ----------- | ----- | -------------- |
| Barcha fanlarni ko'rish           | ✅          | ✅    | ✅             |
| Fan yaratish/yangilash            | ✅          | ✅    | ✅             |
| Fanni inactive qilish             | ✅          | ✅    | Faqat o'ziniki |
| Barcha savollarni ko'rish         | ✅          | ✅    | Faqat o'ziniki |
| Savol yaratish/yangilash          | ✅          | ✅    | ✅             |
| Fayldan savol import              | ✅          | ✅    | ✅             |
| Studentlar ro'yxati               | ✅          | ✅    | ❌             |
| Studentni bloklash/faollashtirish | ✅          | ✅    | ❌             |
| Sessiyalar statistikasi           | ✅          | ✅    | ❌             |
| Teacherlar ro'yxati               | ✅          | ✅    | ❌             |
| Foydalanuvchilar CRUD             | ✅          | ❌    | ❌             |

---

## 🔄 Student flow

```
/ (landing page)
    ↓
/student → telefon + ism + fan + savol soni + vaqt (daqiqada)
    ↓
check-phone → mavjud user → ism avtomatik to'ldiriladi (readonly)
    ↓
/student/test → savollar + timer + progress bar + javob variantlari
    ↓                           ↓
Vaqt tugasa (auto submit)    "Testni yakunlash" tugmasi
    ↓
/student/result → natija (foiz, to'g'ri/noto'g'ri, vaqt) + savollar tahlili
    ↓
/student/results → telefon orqali barcha testlar tarixi va statistika
```

---

## 🔒 Autentifikatsiya va xavfsizlik

**Token saqlash:**

- `access_token` — `httpOnly cookie` da (1 soat)
- `refresh_token` — `httpOnly cookie` da (1 kun)
- Frontend tokenlarni ko'rmaydi — barcha so'rovlarda `credentials: 'include'`

**Auto refresh mexanizmi:**

```
1. middleware.ts — sahifaga kirishda:
   access_token expire → GET /auth/refresh (Cookie header bilan)
   → Yangi Set-Cookie response → Foydalanuvchi hech narsa sezmaydi

2. fetcher.ts — API so'rovda:
   401 kelsa → GET /auth/refresh → Asl so'rovni qayta yuborish
   Refresh muvaffaqiyatsiz → / ga redirect
```

**Rol himoyasi (`middleware.ts`):**

| Route                 | Ruxsat berilgan rollar | Ruxsatsiz bo'lsa      |
| --------------------- | ---------------------- | --------------------- |
| `/admin/users`        | super_admin            | /admin/dashboard      |
| `/admin/*`            | admin, super_admin     | /teacher/dashboard    |
| `/teacher/*`          | teacher                | /admin/dashboard      |
| `/login`, `/register` | Token yo'q             | Dashboard ga redirect |
| `/student/*`          | Hamma                  | —                     |

**Zustand persist:**

- `user` (role, fullName, email) localStorage da saqlanadi
- Logout → `clearUser()` → `/` ga redirect

---

## ➕ LaTeX formulalar

Matematik formulalar `$...$` formatida saqlanadi va `react-katex` orqali render qilinadi:

```tsx
import { MathText } from '@/shared/components/MathText'

<MathText text="$\frac{3}{4}$ kg un kerak" />
// → ¾ kg un kerak

<MathText text="Tenglamani yeching: $x^2 - 5x + 6 = 0$" />
// → Tenglamani yeching: x²-5x+6=0
```

`MathText` komponenti `$...$` qismlarini KaTeX orqali, qolganini oddiy matn sifatida render qiladi. Savol matni, javob variantlari va natija sahifasida ishlatiladi.

---

## 📊 Paginatsiya

Savollar backend tomonidan paginate qilinadi:

```ts
useQuestions(page: number, limit: number, subjectId?: string)
// queryKey: ['questions', page, limit, subjectId]
// Response: {
//   data: Question[],
//   meta: { total, page, limit, totalPages, hasNext, hasPrev }
// }
```

Filter o'zgarganda `page` avtomatik `1` ga reset bo'ladi. Pagination UI list pastida ko'rsatiladi.

---

## 🗂 Shared komponentlar

### PanelSidebar + PanelHeader

Teacher va Admin panellar uchun umumiy layout:

```tsx
// Har ikki panel bir xil komponentdan foydalanadi
<PanelSidebar title="Teacher Panel" navItems={navItems} />
<PanelHeader pageTitles={pageTitles} />

// Admin layoutda role ga qarab navItems o'zgaradi
const navItems = isSuperAdmin ? superAdminNavItems : adminNavItems
```

Sidebar da: logo, nav links (active state bilan), user info, logout tugmasi.

### fetcher.ts

Barcha API so'rovlar uchun markaziy wrapper:

- `credentials: 'include'` — cookie avtomatik yuboriladi
- 401 → auto refresh → retry
- Query params support
- FormData support (fayl yuklash uchun)

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

# Production build
npm run build
npm run start
```

Dastur `http://localhost:3000` da ishga tushadi.

> ⚠️ Backend `http://localhost:4000` da ishlab turishi kerak.
> Backend repo: [edu-test-backend](https://github.com/username/edu-test-backend)

---

## 📖 Sahifalar ro'yxati

| URL                         | Tavsif                               | Himoya                        |
| --------------------------- | ------------------------------------ | ----------------------------- |
| `/`                         | Landing page                         | Ochiq                         |
| `/login`                    | Tizimga kirish                       | Ochiq (login bo'lsa redirect) |
| `/register`                 | Teacher ro'yxati                     | Ochiq (login bo'lsa redirect) |
| `/forgot-password`          | Parolni tiklash emaili               | Ochiq                         |
| `/reset-password?token=...` | Yangi parol kiritish                 | Ochiq                         |
| `/student`                  | Test boshlash                        | Ochiq                         |
| `/student/test`             | Test yechish (timer bilan)           | Ochiq                         |
| `/student/result`           | Test natijasi + tahlil               | Ochiq                         |
| `/student/results`          | Barcha testlar tarixi                | Ochiq                         |
| `/teacher/dashboard`        | Statistika va tezkor harakatlar      | teacher                       |
| `/teacher/subjects`         | Fanlar CRUD                          | teacher                       |
| `/teacher/questions`        | Savollar CRUD + import               | teacher                       |
| `/admin/dashboard`          | Kengaytirilgan statistika            | admin, super_admin            |
| `/admin/subjects`           | Barcha fanlar boshqaruvi             | admin, super_admin            |
| `/admin/questions`          | Barcha savollar boshqaruvi           | admin, super_admin            |
| `/admin/students`           | Studentlar + bloklash/faollashtirish | admin, super_admin            |
| `/admin/sessions`           | Sessiyalar statistikasi + filter     | admin, super_admin            |
| `/admin/teachers`           | Teacherlar ro'yxati (readonly)       | admin                         |
| `/admin/users`              | Foydalanuvchilar CRUD                | super_admin                   |

---

## 🧩 Feature moduli arxitekturasi

Har bir feature quyidagi tuzilishda bo'ladi:

```
features/[feature-name]/
├── api/         → fetcher orqali backend bilan muloqot
├── components/  → UI komponentlar
├── hooks/       → TanStack Query hooks (useQuery, useMutation)
├── store/       → Zustand store (kerak bo'lsa)
└── types/       → TypeScript interfeyslari
```

**Asosiy qoida:** `app/` papkasidagi `page.tsx` faqat feature komponentni chaqiradi — hech qanday logic yo'q:

```tsx
// app/teacher/subjects/page.tsx
import { TeacherSubjectsPage } from "@/features/teacher/components/subjects/TeacherSubjectsPage";

export default function SubjectsPage() {
  return <TeacherSubjectsPage />;
}
```

**Import tartibi (dependency chain):**

```
types → api → hooks → components → page.tsx
```

---

## 📝 Litsenziya

MIT
