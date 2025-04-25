# 🚀 nexacro-cli

넥사크로 기반 개발 도구와 플러그인을 위한 모듈형 CLI 프레임워크입니다.

- ✅ 최신 **ESM** 기반으로 설계
- 🔧 **인터랙티브 모드**, **단일 실행 모드**, **REST/JSON-RPC 마이크로서비스 모드** 지원
- 🎨 Chalk, 테이블, 스피너 등으로 출력 커스터마이징 가능
- 🧩 [typedi](https://www.npmjs.com/package/typedi)를 활용한 DI(의존성 주입) 설계

---

## 📦 nexacro-cli 설계 개요

### ✅ 핵심 기능 범주

| 범주 | 내용 |
|------|------|
| 모듈 구조 | ESM 기반, `export`만 제공 (실행기는 외부에서 구현) |
| 명령어 구성 | 외부 `.cli/commands/*.js` 또는 JS config로 명령 정의 주입 |
| 실행 모드 | ① 단일 명령 실행 후 종료<br>② 세션 유지형 인터랙티브 모드 |
| 출력 포맷 | 글자 색상, 도트 테이블, 스타일 제어 지원 |
| 실행 방식 | 함수형 실행 / 콘솔 CLI 실행기 / REST API / JSON-RPC 실행기 |
| DI 구성 | `typedi` 기반의 의존성 주입 설계 |

---

### 🧩 필요 모듈 정리

| 모듈명 | 용도 | 설명 |
|--------|------|------|
| `chalk` | 콘솔 색상 출력 | 텍스트 강조 스타일 (컬러, 굵기 등) |
| `enquirer` | CLI 프롬프트 | 질문/선택/자동완성 인터페이스 |
| `cli-table3` | 도트 테이블 출력 | 정렬된 CLI 표 출력 |
| `ora` | 로딩 스피너 | 명령 실행 중 애니메이션 처리 |
| `fast-glob` | 명령어 탐색 | `.cli/commands/*.js` 자동 로딩 지원 |
| `typedi` | 의존성 주입 | 실행기/서비스 주입 기반 구성 |
| `express` 또는 `fastify` | REST API 실행기 | 마이크로서비스 형태 CLI 서버 지원 |
| `body-parser` | REST JSON 파서 | Express 연동용 미들웨어 |
| `jsonrpc-lite` 또는 `rpc-websockets` | JSON-RPC 모드 | RPC 기반 호출 처리용 (선택) |

---

## 🗂️ 프로젝트 구조 예시