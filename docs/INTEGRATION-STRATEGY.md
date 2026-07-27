# Tutora FE-BE Integration Strategy

> Status: **FE 0% connected to BE** (39 screens, 0 API calls, 0 HTTP client)
> Backend: **60 endpoints** ready and tested
> Created: 2026-07-25

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Phase 1: Foundation (API Client + Auth)](#2-phase-1-foundation)
3. [Phase 2: Customer Core Flow](#3-phase-2-customer-core-flow)
4. [Phase 3: Teacher Features](#4-phase-3-teacher-features)
5. [Phase 4: Parent Features](#5-phase-4-parent-features)
6. [Phase 5: Real-time & Polish](#6-phase-5-real-time--polish)
7. [File-by-File Change Map](#7-file-by-file-change-map)
8. [Backend API Quick Reference](#8-backend-api-quick-reference)

---

## 1. Architecture Overview

### Current State
```
Frontend (Expo Router + Zustand)
  ├── No HTTP client installed (no axios, no fetch wrapper)
  ├── All data hardcoded or in Zustand mock stores
  ├── 13x setTimeout faking API calls
  └── AsyncStorage key: "auth-session" (just { isAuthenticated, role })

Backend (Fastify + Prisma + PostgreSQL)
  ├── 60 REST endpoints ready
  ├── JWT auth (access + refresh tokens)
  ├── Socket.IO for real-time (chat, GPS, order status)
  └── BullMQ for background jobs
```

### Target Architecture
```
Frontend
  ├── src/api/client.ts          ← Axios instance + interceptors
  ├── src/api/auth.ts            ← Auth API calls
  ├── src/api/teachers.ts        ← Teacher API calls
  ├── src/api/orders.ts          ← Order API calls
  ├── src/api/chat.ts            ← Chat API calls
  ├── src/api/wallet.ts          ← Wallet/Payment API calls
  ├── src/api/parent.ts          ← Parent/Family API calls
  ├── src/api/notifications.ts   ← Notification API calls
  ├── src/hooks/useQuery.ts      ← Optional: SWR/React Query wrapper
  └── src/store/useAuthStore.ts  ← Updated: stores JWT tokens
```

### Dependencies to Install
```bash
# Required
npm install axios
npm install socket.io-client

# Optional (recommended for better UX)
npm install @tanstack/react-query  # Server state management
npm install expo-secure-store       # Secure token storage (replaces AsyncStorage for tokens)
```

---

## 2. Phase 1: Foundation

### Goal: Auth flow works end-to-end. User can register, login, and see their real profile.

### 1.1 Create API Client

**New file: `frontend/src/api/client.ts`**

```typescript
// What to build:
// - Axios instance with baseURL = "http://localhost:3000" (or from expo config)
// - Request interceptor: attach Authorization: Bearer <accessToken>
// - Response interceptor: on 401, try refresh token, retry request
// - Error handler: extract message from BE response { message: string }
// - Token storage: use expo-secure-store or AsyncStorage for tokens
```

**Token storage keys:**
```
"access-token"  → string (JWT)
"refresh-token" → string (JWT)
"user"          → JSON { id, role, name, email, phone, avatarUrl }
```

### 1.2 Update Auth Store

**File: `frontend/src/store/useAuthStore.ts`**

Current state → Target state:

| Field | Current | Target |
|-------|---------|--------|
| `isAuthenticated` | `boolean` | Keep (computed from token existence) |
| `role` | `"customer"\|"teacher"\|"parent"` | `Role` from BE: `"STUDENT"\|"TEACHER"\|"PARENT"\|"ADMIN"` |
| `tutorStatus` | `"draft"\|"review_video"\|"approved"` | Fetch from `GET /users/me` → `teacherProfile.onboardStatus` |
| `user` | ❌ doesn't exist | `{ id, name, email, phone, avatarUrl, role }` |
| `accessToken` | ❌ doesn't exist | `string \| null` |
| `refreshToken` | ❌ doesn't exist | `string \| null` |
| `_hasHydrated` | `boolean` | Keep |

**Actions to update:**

| Action | Current | Target |
|--------|---------|--------|
| `login(email, password)` | `setTimeout` + local state | `POST /auth/login` → store tokens + user |
| `register(data)` | `setTimeout` + local state | `POST /auth/register` or `POST /auth/teacher/register` |
| `logout()` | Clear AsyncStorage | `POST /auth/logout` + clear tokens |
| `refreshSession()` | ❌ doesn't exist | `POST /auth/refresh` with stored refreshToken |
| `loadSession()` | Read AsyncStorage | Read tokens from secure storage, validate with `GET /users/me` |
| `updateProfile(data)` | ❌ doesn't exist | `PATCH /users/me` |

### 1.3 Wire Login Screen

**File: `frontend/app/(auth)/login.tsx`**

| Current | Target |
|---------|--------|
| `setTimeout(() => setAuth(role), 1500)` | `await api.auth.login(email, password)` |
| Role selector (customer/teacher/parent) | Remove — role comes from BE response |
| `useAuthStore.login(role)` | `useAuthStore.login(response.user, response.accessToken, response.refreshToken)` |
| Navigate to `/(customer)/(tabs)` based on role selector | Navigate based on `user.role`: STUDENT→`/(customer)`, TEACHER→`/(teacher)`, PARENT→`/(parent)` |

**Backend endpoint:**
```
POST /auth/login
Body: { email: string, password: string }
Response: { message, user: { id, role, name, email, phone, ... }, accessToken, refreshToken }
```

### 1.4 Wire Register Screen

**File: `frontend/app/(auth)/register.tsx`**

| Current | Target |
|---------|--------|
| Collects all fields but discards them | Send to appropriate endpoint |
| Single `setTimeout` | Conditional: STUDENT/PARENT → `POST /auth/register`, TEACHER → `POST /auth/teacher/register` |
| Navigates to login | Store tokens, navigate to KYC (teacher) or home (student/parent) |

**Two backend endpoints:**
```
POST /auth/register          → Body: { name, email, phone, password, role: "STUDENT"|"PARENT" }
POST /auth/teacher/register  → Body: { name, email, phone, password, university, major, yearEnrolled, gpa, subjects[], bio? }
```

### 1.5 Wire Root Gateway

**File: `frontend/app/index.tsx`**

| Current | Target |
|---------|--------|
| Read Zustand for redirect | `loadSession()` → validate token with `GET /users/me` → redirect based on real role |

### 1.6 Wire Teacher Onboarding (KYC, Documents, Video)

**Files:**
- `frontend/app/(auth)/teacher/kyc.tsx` → `POST /auth/teacher/kyc` with `{ nik, ktpPhotoUrl }`
- `frontend/app/(auth)/teacher/documents.tsx` → `POST /auth/teacher/documents` with `{ documentUrls: string[] }`
- `frontend/app/(auth)/teacher/video.tsx` → `POST /auth/teacher/video` with `{ videoUrl }`

**Note:** File uploads need to be uploaded to a storage service first (S3/Cloudinary), then the URL is sent to BE. For now, can mock the upload and use placeholder URLs.

### Phase 1 Checklist

- [ ] `npm install axios` in frontend
- [ ] Create `src/api/client.ts` with interceptors
- [ ] Create `src/api/auth.ts` with login/register/logout/refresh
- [ ] Update `useAuthStore` to store JWT tokens
- [ ] Wire `login.tsx` to `POST /auth/login`
- [ ] Wire `register.tsx` to `POST /auth/register` / `POST /auth/teacher/register`
- [ ] Wire `app/index.tsx` to validate token on startup
- [ ] Wire `teacher/kyc.tsx` to `POST /auth/teacher/kyc`
- [ ] Wire `teacher/documents.tsx` to `POST /auth/teacher/documents`
- [ ] Wire `teacher/video.tsx` to `POST /auth/teacher/video`
- [ ] Add `(parent)` to `app/_layout.tsx` Stack screens
- [ ] Fix role mapping: FE uses "customer", BE uses "STUDENT"

---

## 3. Phase 2: Customer Core Flow

### Goal: Student can browse teachers, create orders, track sessions, and submit reviews.

### 2.1 Wire Customer Home

**File: `frontend/app/(customer)/(tabs)/index.tsx`**

| Current | Target |
|---------|--------|
| `Halo, Delia!` hardcoded | `Halo, ${user.name}!` from `useAuthStore.user` |
| Wallet `Rp 250.000` hardcoded | `GET /wallet/balance` → `data.balance` |
| Services hardcoded | Keep as-is (static navigation tiles) |
| Promo cards hardcoded | `GET /promotions` → active promotions |

**API calls:**
```
GET /users/me          → user name, avatar
GET /wallet/balance    → wallet balance
GET /promotions        → promo cards
```

### 2.2 Wire Profile Screens

**File: `frontend/app/(customer)/(tabs)/profile.tsx`**
```
GET /users/me → { name, email, phone, avatarUrl }
```

**File: `frontend/app/(customer)/profile/edit.tsx`**
```
GET /users/me           → populate form fields
PATCH /users/me         → { name?, avatarUrl? } → save
```

**File: `frontend/app/(customer)/profile/settings.tsx`**
```
POST /auth/refresh or similar for password reset
DELETE endpoint for account deletion (not yet in BE)
```

### 2.3 Wire Teacher Browsing

**File: `frontend/app/(customer)/teacher/[id].tsx`**
```
GET /teachers/:id → full teacher profile, stats, education, price
GET /teachers/:id/reviews → reviews list
```

| Current | Target |
|---------|--------|
| All teacher data hardcoded in JSX | Map from API response |
| Reviews from local `useReviewStore` | `GET /teachers/:id/reviews` |
| Favorite is local state | `POST /teachers/:id/favorite` (not in BE yet — skip or add) |

### 2.4 Wire Order Flow

**File: `frontend/app/(customer)/order/location.tsx`**
```
// Location picker — keep hardcoded for now
// Pass { latitude, longitude, address } to next screen via route params
```

**File: `frontend/app/(customer)/order/subject.tsx`**
```
GET  /vouchers/validate → validate promo code
POST /orders            → create order
```

| Current | Target |
|---------|--------|
| Price calculated client-side | Still client-side for preview, but BE validates final price |
| `setTimeout` → navigating to searching | `POST /orders` → get orderId → navigate to searching with orderId |
| PROMOS hardcoded | `GET /promotions` |

**File: `frontend/app/(customer)/order/searching.tsx`**
```
// Poll GET /orders/active or GET /orders/:id until status changes from SEARCHING
// Or use Socket.IO event "new_order" / "order_matched"
```

**File: `frontend/app/(customer)/order/tracking.tsx`**
```
GET /orders/:id → tutor info, ETA
Socket.IO → teacher location updates in real-time
```

**File: `frontend/app/(customer)/order/session.tsx`**
```
POST /sessions/:id/end → end session
POST /sos              → trigger emergency alert
```

**File: `frontend/app/(customer)/order/review.tsx`**
```
POST /sessions/:id/review → { rating, content, tags }
```

### 2.5 Wire Activity/History

**File: `frontend/app/(customer)/(tabs)/activity.tsx`**
```
GET /orders/active    → ongoing orders
GET /orders/history   → completed/cancelled orders
GET /wallet/balance   → balance chip
```

### 2.6 Wire Chat

**File: `frontend/app/(customer)/(tabs)/chat.tsx`**
```
GET /chats → list of chat rooms with last message
```

**File: `frontend/app/(customer)/chat/room.tsx`**
```
GET  /chats/:roomId/messages → message history (cursor pagination)
POST /chats/:roomId/messages → send message
Socket.IO → real-time incoming messages
```

### 2.7 Wire Notifications

**File: `frontend/app/(customer)/notifications.tsx`**
```
GET /notifications        → notification list
PATCH /notifications/:id/read → mark as read
```

### 2.8 Wire Payment

**File: `frontend/app/(customer)/payment/index.tsx`**
```
GET /wallet/balance → TutorPay balance
POST /payments/topup → initiate Midtrans payment
```

### Phase 2 Checklist

- [ ] Create `src/api/teachers.ts`
- [ ] Create `src/api/orders.ts`
- [ ] Create `src/api/chat.ts`
- [ ] Create `src/api/wallet.ts`
- [ ] Create `src/api/notifications.ts`
- [ ] Wire `(customer)/(tabs)/index.tsx` → users/me, wallet, promotions
- [ ] Wire `(customer)/(tabs)/profile.tsx` → users/me
- [ ] Wire `(customer)/profile/edit.tsx` → PATCH users/me
- [ ] Wire `(customer)/teacher/[id].tsx` → GET teachers/:id
- [ ] Wire `(customer)/order/subject.tsx` → POST orders
- [ ] Wire `(customer)/order/searching.tsx` → poll order status
- [ ] Wire `(customer)/order/tracking.tsx` → GET orders/:id
- [ ] Wire `(customer)/order/session.tsx` → POST sessions/end, SOS
- [ ] Wire `(customer)/order/review.tsx` → POST sessions/:id/review
- [ ] Wire `(customer)/(tabs)/activity.tsx` → GET orders/history
- [ ] Wire `(customer)/(tabs)/chat.tsx` → GET chats
- [ ] Wire `(customer)/chat/room.tsx` → GET/POST chats/:roomId/messages
- [ ] Wire `(customer)/notifications.tsx` → GET notifications
- [ ] Wire `(customer)/payment/index.tsx` → GET wallet/balance, POST topup

---

## 4. Phase 3: Teacher Features

### Goal: Teacher can go online, receive orders, conduct sessions, and manage earnings.

### 3.1 Wire Teacher Dashboard

**File: `frontend/app/(teacher)/(tabs)/index.tsx`**

| Current | Target |
|---------|--------|
| Online toggle is local `useState` | `PATCH /teachers/me/status` → `{ isOnline: boolean }` |
| Income/sessions hardcoded | `GET /wallet/balance` + compute from `GET /orders/history` |
| Recent sessions hardcoded | `GET /orders/history` (last 5) |

**API calls:**
```
PATCH /teachers/me/status → toggle online
GET /wallet/balance       → today's earnings
GET /orders/history       → recent sessions
```

### 3.2 Wire Teacher Profile & Reviews

**File: `frontend/app/(teacher)/(tabs)/profile.tsx`**
```
GET /users/me → teacher profile (name, email, phone, rating from teacherProfile)
POST /auth/logout → logout
```

**File: `frontend/app/(teacher)/profile/reviews.tsx`**
```
GET /teachers/:id/reviews → reviews for logged-in teacher (id from token)
```

| Current | Target |
|---------|--------|
| Reviews filter `teacherId === "1"` | Use `user.id` from auth store |

### 3.3 Wire Teacher History & Earnings

**File: `frontend/app/(teacher)/(tabs)/history.tsx`**
```
GET /orders/history → filter by status
```

**File: `frontend/app/(teacher)/(tabs)/earnings.tsx`**
```
GET /wallet/balance      → current balance
GET /wallet/transactions → transaction list
```

### 3.4 Wire Withdraw

**File: `frontend/app/(teacher)/payment/withdraw.tsx`**
```
GET /wallet/balance → current balance
POST /payments/withdraw → { amount, bankCode, accountNumber, accountName }
```

### 3.5 Wire Job Flow (Incoming → Active → Report)

**File: `frontend/app/(teacher)/job/incoming.tsx`**
```
GET /orders/active → get incoming order with student info
POST /orders/:id/accept → accept order
POST /orders/:id/reject → reject order
```

| Current | Target |
|---------|--------|
| Mock child data from `useFamilyStore` | Real student data from `GET /orders/active` |
| Accept/reject just navigate | Call API, then navigate |

**File: `frontend/app/(teacher)/job/active.tsx`**
```
PUT /teachers/me/location → send GPS coordinates periodically
POST /sessions/:id/start  → start session (when arrived + geo-fence check)
POST /sessions/:id/end    → end session
POST /sos                 → emergency alert
```

| Current | Target |
|---------|--------|
| 3-state machine (on_the_way → arrived → teaching) | Map to BE statuses: `ON_THE_WAY` → `ARRIVED` → `ACTIVE` |
| Hardcoded distance 150m | Real GPS distance |
| Hardcoded timer | Real timer from `startedAt` timestamp |
| Mock teleport button | Remove or keep as dev tool |

**File: `frontend/app/(teacher)/job/report.tsx`**
```
POST /sessions/:id/report → { summary, characters: string[], photoUrl? }
```

| Current | Target |
|---------|--------|
| Saves to local `useFamilyStore.addReport()` | `POST /sessions/:id/report` |
| Hardcoded childId "c1" | Session knows the student |
| Mock photo | Real photo upload → URL → send to API |

### 3.6 Wire Teacher Waiting Room

**File: `frontend/app/(teacher)/waiting.tsx`**
```
GET /users/me → check teacherProfile.onboardStatus
// Poll every 5s or use Socket.IO for real-time status update
```

### Phase 3 Checklist

- [ ] Create `src/api/parent.ts` (family endpoints)
- [ ] Wire `(teacher)/(tabs)/index.tsx` → PATCH status, GET wallet
- [ ] Wire `(teacher)/(tabs)/profile.tsx` → GET users/me
- [ ] Wire `(teacher)/profile/reviews.tsx` → GET teachers/:id/reviews
- [ ] Wire `(teacher)/(tabs)/history.tsx` → GET orders/history
- [ ] Wire `(teacher)/(tabs)/earnings.tsx` → GET wallet/balance + transactions
- [ ] Wire `(teacher)/payment/withdraw.tsx` → POST payments/withdraw
- [ ] Wire `(teacher)/job/incoming.tsx` → GET orders/active, POST accept/reject
- [ ] Wire `(teacher)/job/active.tsx` → POST sessions/start/end, PUT location
- [ ] Wire `(teacher)/job/report.tsx` → POST sessions/:id/report
- [ ] Wire `(teacher)/waiting.tsx` → GET users/me (poll onboardStatus)

---

## 5. Phase 4: Parent Features

### Goal: Parent can see children's activity, reports, and track live sessions.

### 5.1 Wire Parent Dashboard

**File: `frontend/app/(parent)/(tabs)/index.tsx`**

| Current | Target |
|---------|--------|
| Children from `useFamilyStore` (hardcoded) | `GET /parent/children` |
| Reports from store | `GET /parent/children/:id/orders` |
| Live session hardcoded | `GET /parent/children/:id/live-session` (if exists in BE) |

**API calls:**
```
GET /parent/children                    → list children
GET /parent/children/:childId/orders    → child's order history
```

### 5.2 Wire Parent Reports

**File: `frontend/app/(parent)/(tabs)/reports.tsx`**
```
// Reuse: GET /parent/children/:childId/orders with status=DONE
// Each order can include its session report via GET /sessions/:id/report
```

### 5.3 Wire Parent Profile

**File: `frontend/app/(parent)/(tabs)/profile.tsx`**
```
GET /users/me → parent profile
POST /auth/logout → logout
```

### 5.4 Wire Parent Live Tracking

**File: `frontend/app/(parent)/tracking/live.tsx`**
```
GET /orders/:id → current session status
Socket.IO → real-time tutor location
```

### Phase 4 Checklist

- [ ] Wire `(parent)/(tabs)/index.tsx` → GET parent/children
- [ ] Wire `(parent)/(tabs)/reports.tsx` → GET parent/children/:id/orders
- [ ] Wire `(parent)/(tabs)/profile.tsx` → GET users/me
- [ ] Wire `(parent)/tracking/live.tsx` → Socket.IO tutor location

---

## 6. Phase 5: Real-time & Polish

### Goal: Chat, GPS tracking, and notifications work in real-time.

### 6.1 Socket.IO Client

**New file: `frontend/src/api/socket.ts`**

```typescript
// Connect to backend Socket.IO at http://localhost:3000
// Events to listen:
//   "chat_message"      → new message in active chat room
//   "order_status"      → order status changed (matched, arrived, etc.)
//   "teacher_location"  → tutor GPS position updated
//   "sos_alert"         → emergency alert (for parent/admin)
//   "new_order"         → new incoming order (for teacher)
// Authentication: send JWT token in handshake auth
```

### 6.2 Integrate Socket.IO in Screens

| Screen | Socket Events |
|--------|--------------|
| `chat/room.tsx` | Listen `chat_message`, emit on send |
| `order/tracking.tsx` | Listen `teacher_location` |
| `order/searching.tsx` | Listen `order_status` (when matched) |
| `teacher/(tabs)/index.tsx` | Listen `new_order` |
| `parent/tracking/live.tsx` | Listen `teacher_location` |

### 6.3 Replace Mock Stores

| Store | Action |
|-------|--------|
| `useFamilyStore` | Replace all hardcoded data with API calls |
| `useReviewStore` | Replace with API calls to `GET /teachers/:id/reviews` |
| `useAuthStore` | Already updated in Phase 1 |

### 6.4 File Uploads

Screens that need file uploads:
- `teacher/kyc.tsx` → KTP photo
- `teacher/documents.tsx` → KTM, CV, transcript, portfolio
- `teacher/video.tsx` → intro video
- `teacher/job/report.tsx` → session photo

**Approach:**
1. Upload file to cloud storage (S3/Cloudinary) → get URL
2. Send URL to BE endpoint
3. For now: can use a simple file upload endpoint or mock with placeholder URLs

### Phase 5 Checklist

- [ ] `npm install socket.io-client` in frontend
- [ ] Create `src/api/socket.ts`
- [ ] Integrate Socket.IO in chat room
- [ ] Integrate Socket.IO in order tracking
- [ ] Integrate Socket.IO in teacher dashboard (incoming orders)
- [ ] Integrate Socket.IO in parent live tracking
- [ ] Replace `useFamilyStore` mock data with API calls
- [ ] Replace `useReviewStore` mock data with API calls
- [ ] Implement file upload flow (or mock with placeholder URLs)

---

## 7. File-by-File Change Map

### New Files to Create

| File | Purpose | Phase |
|------|---------|-------|
| `src/api/client.ts` | Axios instance + interceptors + token management | 1 |
| `src/api/auth.ts` | Login, register, logout, refresh, OTP | 1 |
| `src/api/teachers.ts` | List teachers, get detail, toggle status, location | 2 |
| `src/api/orders.ts` | Create order, active, history, cancel | 2 |
| `src/api/sessions.ts` | Start, end, report, review | 2-3 |
| `src/api/chat.ts` | Chat rooms, messages | 2 |
| `src/api/wallet.ts` | Balance, transactions | 2-3 |
| `src/api/payments.ts` | Topup, withdraw | 2-3 |
| `src/api/parent.ts` | Children, topup, orders | 4 |
| `src/api/notifications.ts` | List, mark read, register device | 2 |
| `src/api/socket.ts` | Socket.IO client | 5 |
| `src/types/api.ts` | TypeScript types matching BE responses | 1 |

### Existing Files to Modify

| File | Changes | Phase |
|------|---------|-------|
| `src/store/useAuthStore.ts` | Store JWT tokens, user data; add refreshSession | 1 |
| `src/store/useFamilyStore.ts` | Replace hardcoded data with API calls | 5 |
| `src/store/useReviewStore.ts` | Replace hardcoded data with API calls | 5 |
| `app/_layout.tsx` | Add `(parent)` screen to Stack | 1 |
| `app/index.tsx` | Validate token, route based on real role | 1 |
| `app/(auth)/login.tsx` | Call `POST /auth/login`, store tokens | 1 |
| `app/(auth)/register.tsx` | Call register API, handle teacher vs student | 1 |
| `app/(auth)/teacher/kyc.tsx` | Call `POST /auth/teacher/kyc` | 1 |
| `app/(auth)/teacher/documents.tsx` | Call `POST /auth/teacher/documents` | 1 |
| `app/(auth)/teacher/video.tsx` | Call `POST /auth/teacher/video` | 1 |
| `app/(customer)/(tabs)/index.tsx` | Fetch user, wallet, promotions | 2 |
| `app/(customer)/(tabs)/chat.tsx` | Fetch `GET /chats` | 2 |
| `app/(customer)/(tabs)/activity.tsx` | Fetch `GET /orders/history` | 2 |
| `app/(customer)/(tabs)/profile.tsx` | Fetch `GET /users/me` | 2 |
| `app/(customer)/(tabs)/promo.tsx` | Fetch `GET /promotions` | 2 |
| `app/(customer)/teacher/[id].tsx` | Fetch `GET /teachers/:id` + reviews | 2 |
| `app/(customer)/notifications.tsx` | Fetch `GET /notifications` | 2 |
| `app/(customer)/payment/index.tsx` | Fetch wallet, POST topup | 2 |
| `app/(customer)/profile/edit.tsx` | Fetch + PATCH `users/me` | 2 |
| `app/(customer)/order/subject.tsx` | POST `/orders` | 2 |
| `app/(customer)/order/searching.tsx` | Poll order status | 2 |
| `app/(customer)/order/tracking.tsx` | Fetch order + Socket.IO | 2 |
| `app/(customer)/order/session.tsx` | POST sessions/end, SOS | 2 |
| `app/(customer)/order/review.tsx` | POST sessions/:id/review | 2 |
| `app/(customer)/chat/room.tsx` | Fetch messages, send via API + Socket.IO | 2 |
| `app/(teacher)/(tabs)/index.tsx` | PATCH status, fetch wallet/orders | 3 |
| `app/(teacher)/(tabs)/history.tsx` | Fetch `GET /orders/history` | 3 |
| `app/(teacher)/(tabs)/earnings.tsx` | Fetch wallet + transactions | 3 |
| `app/(teacher)/(tabs)/profile.tsx` | Fetch `GET /users/me` | 3 |
| `app/(teacher)/waiting.tsx` | Poll `GET /users/me` for onboardStatus | 3 |
| `app/(teacher)/payment/withdraw.tsx` | POST `payments/withdraw` | 3 |
| `app/(teacher)/job/incoming.tsx` | Fetch active order, POST accept/reject | 3 |
| `app/(teacher)/job/active.tsx` | PUT location, POST sessions/start/end | 3 |
| `app/(teacher)/job/report.tsx` | POST sessions/:id/report | 3 |
| `app/(teacher)/profile/reviews.tsx` | Fetch `GET /teachers/:id/reviews` | 3 |
| `app/(parent)/(tabs)/index.tsx` | Fetch children, orders | 4 |
| `app/(parent)/(tabs)/reports.tsx` | Fetch children reports | 4 |
| `app/(parent)/(tabs)/profile.tsx` | Fetch `GET /users/me` | 4 |
| `app/(parent)/tracking/live.tsx` | Fetch order + Socket.IO | 4 |

---

## 8. Backend API Quick Reference

### Auth (no auth required)
| Method | Endpoint | Body |
|--------|----------|------|
| POST | `/auth/register` | `{ name, email, phone, password, role: "STUDENT"\|"PARENT" }` |
| POST | `/auth/login` | `{ email, password }` |
| POST | `/auth/refresh` | `{ refreshToken }` |
| POST | `/auth/otp/send` | `{ phone }` |
| POST | `/auth/otp/verify` | `{ phone, code }` |
| POST | `/auth/teacher/register` | `{ name, email, phone, password, university, major, yearEnrolled, gpa, subjects[], bio? }` |

### Auth (authenticated)
| Method | Endpoint | Body | Role |
|--------|----------|------|------|
| POST | `/auth/logout` | `{ refreshToken }` | ALL |
| POST | `/auth/teacher/kyc` | `{ nik, ktpPhotoUrl }` | TEACHER |
| POST | `/auth/teacher/documents` | `{ documentUrls: string[] }` | TEACHER |
| POST | `/auth/teacher/video` | `{ videoUrl }` | TEACHER |

### User
| Method | Endpoint | Body | Role |
|--------|----------|------|------|
| GET | `/users/me` | — | ALL |
| PATCH | `/users/me` | `{ name?, avatarUrl? }` | ALL |

### Teachers
| Method | Endpoint | Body/Query | Role |
|--------|----------|------------|------|
| GET | `/teachers` | `?subject&level&lat&lng&radius&sort&page` | ALL |
| GET | `/teachers/:id` | — | ALL |
| PATCH | `/teachers/me/status` | `{ isOnline: boolean }` | TEACHER |
| PUT | `/teachers/me/location` | `{ latitude, longitude }` | TEACHER |
| GET | `/teachers/:id/reviews` | `?page&limit` | ALL |

### Orders
| Method | Endpoint | Body | Role |
|--------|----------|------|------|
| POST | `/orders` | `{ subject, level, durationHours, sessionsTotal, latitude, longitude, addressText, scheduleType, scheduledAt?, voucherCode?, studentId? }` | STUDENT/PARENT |
| GET | `/orders/active` | — | ALL |
| GET | `/orders/history` | `?page&limit` | ALL |
| GET | `/orders/:id` | — | ALL |
| PATCH | `/orders/:id/cancel` | `{ reason? }` | ALL |
| POST | `/orders/:id/accept` | — | TEACHER |
| POST | `/orders/:id/reject` | — | TEACHER |

### Sessions
| Method | Endpoint | Body | Role |
|--------|----------|------|------|
| POST | `/sessions/:id/start` | — | TEACHER |
| POST | `/sessions/:id/end` | — | TEACHER |
| POST | `/sessions/:id/report` | `{ summary, characters: string[], photoUrl? }` | TEACHER |
| GET | `/sessions/:id/report` | — | ALL |
| POST | `/sessions/:id/review` | `{ rating, content, tags }` | STUDENT/PARENT |
| POST | `/sos` | `{ sessionId, latitude, longitude }` | ALL |

### Wallet & Payments
| Method | Endpoint | Body | Role |
|--------|----------|------|------|
| GET | `/wallet/balance` | — | ALL |
| GET | `/wallet/transactions` | `?page&limit` | ALL |
| POST | `/payments/topup` | `{ amount }` | ALL |
| POST | `/payments/withdraw` | `{ amount, bankCode, accountNumber, accountName }` | TEACHER |

### Chat
| Method | Endpoint | Body | Role |
|--------|----------|------|------|
| GET | `/chats` | — | ALL |
| GET | `/chats/:roomId/messages` | `?cursor&limit` | ALL |
| POST | `/chats/:roomId/messages` | `{ content }` | ALL |
| PATCH | `/chats/:roomId/read` | — | ALL |

### Family (Parent)
| Method | Endpoint | Body | Role |
|--------|----------|------|------|
| POST | `/parent/children` | `{ childName, childGrade }` | PARENT |
| GET | `/parent/children` | — | PARENT |
| GET | `/parent/children/:childId` | — | PARENT |
| POST | `/parent/children/:childId/topup` | `{ amount }` | PARENT |
| GET | `/parent/children/:childId/orders` | `?page&limit` | PARENT |

### Notifications
| Method | Endpoint | Body | Role |
|--------|----------|------|------|
| GET | `/notifications` | `?page&limit` | ALL |
| PATCH | `/notifications/:id/read` | — | ALL |
| POST | `/notifications/register-device` | `{ token, deviceInfo? }` | ALL |

### Public
| Method | Endpoint | Body |
|--------|----------|------|
| GET | `/promotions` | — |
| POST | `/vouchers/validate` | `{ code, orderAmount }` |

---

## Known Issues to Fix

1. **Role mapping mismatch**: FE uses `"customer"`, BE uses `"STUDENT"`. All screens need to map:
   - `"customer"` → `"STUDENT"`
   - `"teacher"` → `"TEACHER"`
   - `"parent"` → `"PARENT"`

2. **Missing `(parent)` in root layout**: `app/_layout.tsx` Stack doesn't declare parent screens.

3. **BigInt serialization**: Prisma BigInt (wallet balance) needs to be cast to number in BE responses (already done in some endpoints).

4. **File uploads**: No file upload endpoint in BE. Need to either:
   - Add file upload endpoint to BE (recommended)
   - Use external storage (S3/Cloudinary) directly from FE

5. **CORS**: Backend CORS allows `localhost:8081` (Expo web) and `localhost:19006` (Expo Go). Verify these match your dev setup.

6. **Teacher profile relation**: `User.teacherProfile` was removed to fix Prisma conflicts. Profile data comes from `GET /users/me` which includes `teacherProfile` relation.

---

## Recommended Execution Order

```
Week 1: Phase 1 (Foundation + Auth)
  Day 1-2: API client + auth store + types
  Day 3-4: Login + Register + Root gateway
  Day 5: Teacher onboarding (KYC, docs, video)

Week 2: Phase 2 (Customer Core)
  Day 1-2: Home + Profile + Teacher browsing
  Day 3-4: Order flow (location → subject → searching → tracking → session → review)
  Day 5: Chat + Notifications + Payment

Week 3: Phase 3 (Teacher Features)
  Day 1-2: Dashboard + Status toggle + History + Earnings
  Day 3-4: Job flow (incoming → active → report)
  Day 5: Withdraw + Reviews + Waiting room

Week 4: Phase 4 + 5 (Parent + Real-time)
  Day 1-2: Parent features
  Day 3-4: Socket.IO integration
  Day 5: Polish + Testing
```
