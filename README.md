# Static Publishing Boilerplate

HTML · SCSS · Tailwind CSS · Gulp 기반의 정적 페이지 퍼블리싱 프로젝트입니다.
유지보수성, 재사용성, 퍼블리싱 생산성을 고려해 구성했습니다.

## 기술 스택

- HTML
- SCSS
- Tailwind CSS (v3)
- Gulp (v5)
- JavaScript
- Node.js / npm

## 요구 사항

- Node.js 18 이상 (권장: 20+)
- npm

## 설치

```bash
npm install
```

## 사용법

| 명령어 | 설명 |
| --- | --- |
| `npm run dev` | dist 초기화 → 빌드 → 로컬 개발 서버 실행 + 파일 변경 감지 자동 새로고침 |
| `npm run build` | dist 초기화 → 압축(CSS/JS) 포함 production 빌드 |
| `npm run clean` | dist 폴더 삭제 |

개발 서버는 기본적으로 [http://localhost:3000](http://localhost:3000) 에서 실행됩니다.

## 폴더 구조

```txt
project-root/
├─ src/
│  ├─ html/
│  │  ├─ index.html
│  │  └─ pages/
│  │     └─ sample.html
│  ├─ scss/
│  │  ├─ main.scss
│  │  ├─ abstracts/_variables.scss
│  │  ├─ base/_reset.scss
│  │  ├─ components/_button.scss
│  │  └─ layout/_header.scss
│  ├─ js/
│  │  └─ main.js
│  ├─ images/
│  ├─ fonts/
│  └─ assets/
├─ dist/                # 빌드 결과물 (자동 생성)
├─ gulpfile.js
├─ package.json
├─ postcss.config.js
├─ tailwind.config.js
├─ .gitignore
└─ README.md
```

## Gulp 빌드 기능

- **HTML 복사**: `src/html` → `dist` (디렉토리 구조 유지)
- **SCSS 컴파일**: Dart Sass 로 컴파일
- **Tailwind CSS 빌드**: PostCSS 플러그인으로 처리
- **PostCSS 처리 / Autoprefixer**: 벤더 프리픽스 자동 적용
- **CSS 압축**: production 빌드(`npm run build`) 시 cssnano 로 압축
- **JavaScript 복사 및 압축**: terser 로 minify
- **이미지 / 폰트 / 에셋 복사**: `dist` 로 그대로 복사
- **로컬 개발 서버**: BrowserSync
- **파일 변경 감지 → 자동 새로고침**: watch + live reload
- **dist 폴더 초기화 후 빌드**: 빌드 전 dist 정리

## 빌드 산출물

빌드 결과물은 `dist/` 폴더에 생성됩니다.

```txt
dist/
├─ index.html
├─ pages/
│  └─ sample.html
├─ css/
│  └─ main.css
├─ js/
│  └─ main.js
├─ images/
├─ fonts/
└─ assets/
```

## 작성 가이드

- 새 페이지는 `src/html/pages/` 에 추가하면 `dist/pages/` 로 빌드됩니다.
- 스타일은 Tailwind 유틸리티 클래스를 기본으로 사용하고, 반복되는 패턴은 `src/scss/components/` 에 SCSS 컴포넌트로 분리합니다.
- 개발 모드에서는 CSS/JS 에 소스맵이 포함되며, production 빌드에서는 제외 및 압축됩니다.
