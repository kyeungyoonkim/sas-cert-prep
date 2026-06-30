# SAS Certification Prep

SAS 자격증 3종 연습 웹사이트 — Base → Clinical → Advanced 로드맵 지원

## 자격증 선택

| 자격증 | 시험 ID | 문제 수 | 모의고사 | 합격 기준 |
|--------|---------|---------|----------|-----------|
| **Base** Programming Specialist | A00-231 | 57문제 | 40문제 / 135분 | 725점 |
| **Clinical** Trials Programming | A00-282 | 29문제 | 65문제 / 110분 | 68% |
| **Advanced** Programming Professional | A00-232 | 26문제 | 15문제 / 125분 | 725점 |

사이드바 **자격증 선택**에서 Base / Clinical / Advanced를 전환하면 문제, 체크리스트, 모의고사, 진도가 각각 분리됩니다.

## 기능

- 영역별 연습 · 모의고사 · 플래시카드 · 오답 복습 · 북마크
- 자격증별 학습 체크리스트
- 자격증별 진도/정답률/모의고사 기록 (localStorage)
- 연속 학습 일수 추적

## 실행 (로컬 개발)

```bash
npm install
npm run dev
```

http://localhost:5173

## GitHub에 올려서 어디서든 쓰기

진도는 **브라우저 localStorage**에 저장됩니다. PC/폰마다 따로 쌓이며 GitHub와는 동기화되지 않습니다.

### 1) Git 설치 (한 번만)

Windows: [Git for Windows](https://git-scm.com/download/win) 설치 후 터미널을 다시 엽니다.

### 2) GitHub에 새 저장소 만들기

1. [github.com/new](https://github.com/new) 에서 저장소 생성 (예: `sas-cert-prep`)
2. **Public** 권장 (무료 Pages)
3. README 추가는 안 해도 됨 (로컬에 이미 있음)

### 3) 코드 올리기 (프로젝트 폴더에서)

```bash
cd "c:\Users\Kyeungyoon Kim\OneDrive\sas"

git init
git add .
git commit -m "Initial commit: SAS cert prep app"

git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/sas-cert-prep.git
git push -u origin main
```

`YOUR_USERNAME`과 저장소 이름은 본인 것으로 바꿉니다.

### 4) GitHub Pages 켜기

1. GitHub 저장소 → **Settings** → **Pages**
2. **Build and deployment** → Source: **GitHub Actions**
3. `main`에 push하면 `.github/workflows/deploy.yml`이 자동 빌드·배포
4. 1~2분 후 주소: `https://YOUR_USERNAME.github.io/sas-cert-prep/`

이 URL을 북마크하면 **어떤 컴퓨터/폰**에서든 브라우저만 있으면 됩니다. Node 설치 불필요.

### 다른 PC에서 코드 수정할 때

```bash
git clone https://github.com/YOUR_USERNAME/sas-cert-prep.git
cd sas-cert-prep
npm install
npm run dev
```

수정 후:

```bash
git add .
git commit -m "설명"
git push
```

→ Pages 사이트도 자동으로 갱신됩니다.

### 더 쉬운 대안: Vercel / Netlify

GitHub에 올린 뒤 [vercel.com](https://vercel.com) 또는 [netlify.com](https://netlify.com)에서 저장소 연결 → **Import** → Build: `npm run build`, Output: `dist` (Vercel은 Vite 자동 인식). 커스텀 URL도 가능합니다.

## 추천 학습 순서

1. **Base** (A00-231) — 필수 기초
2. **Advanced** (A00-232) — SQL, Macro, Hash (Clinical 전에 해도 됨)
3. **Clinical** (A00-282) — Base 또는 Advanced 선행 필요

## 공식 자료

- [SAS Certification](https://www.sas.com/en_us/certification.html)
- [Sample Questions](https://www.sas.com/en_us/certification/sample-questions.html)
- [Free Practice Exams](https://www.sas.com/en_us/certification/resources/sas-practice-exams.html)
