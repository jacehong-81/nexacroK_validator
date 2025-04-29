# 🚀 nexacro-parser-core

넥사크로 프로젝트 개발자 파일 분석기 모듈 입니다.




항목	설명
XML 파서	fast-xml-parser (우선 선정)
XCSS 파서	커스텀 Preprocessor 스타일, 표준 CSS + 확장 속성
Watching File	변경 감지 추상화
Differ 구조	Obj → Obj 비교 (캐시/변경 감지)
확장성 고려	단순 린팅이 아니라 템플릿 엔진 등으로 확장 가능해야 함


목적	추천 모듈	이유
XML 파싱	fast-xml-parser	빠르고 옵션 커스터마이즈가 유연
CSS-like 파싱	postcss	Preprocessor 스타일 커스텀 파싱에 최적 (XCSS 대응)
파일 변경 감지	chokidar	워치 추상화 표준, 대용량 감시도 안정적
객체 변경 감지	fast-json-patch or deep-diff	JS 객체간 차이 계산용
문자열 차이(diff) (선택)	diff	텍스트 기반 비교 필요시
파일 시스템 편의성	fs-extra	파일 접근, 복사, 삭제 등을 쉽게 처리

모듈	세부 설명
fast-xml-parser	CDATA, attribute preserve, namespace 등 모두 지원 가능
postcss	표준 CSS 파서지만, Custom Syntax 처리 plugin 추가 가능
chokidar	VS Code/VS Extension 대응할 수 있는 파일 Watch 추상화 가능
fast-json-patch	객체 스냅샷 비교 및 변화점만 기록 가능 (RFC6902 기반)
fs-extra	Promise 기반의 mkdirp, copy, move, remove 등 지원

레이어	설명
XMLParser	fast-xml-parser 기반의 DOM-like 객체 생성
XCSSParser	postcss 기반, Custom Syntax 플러그인 추가
Watcher	chokidar 기반 파일/폴더 추상화
Differ	fast-json-patch or 직접 커스텀
Abstract FS	fs-extra 래핑 (파일 입출력 추상화)

항목	설명
Template Engine 대응	XML 파서 결과를 재조합해서 Template 렌더러 가능
Lint용 AST Hook	XCSS 분석용 AST Traversal 구조 설계
Cache 및 Incremental Analysis	변경된 파일만 빠르게 다시 파싱하는 구조
CLI나 Extension 연동용 Hook 설계	외부 트리거에 반응하는 구조 미리 준비