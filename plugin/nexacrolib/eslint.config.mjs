import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {


    files: ["**/*.js"], // 적용할 파일 패턴 (JS 파일만)
    languageOptions: {
      ecmaVersion: 2022, // ECMAScript 버전
      sourceType: "module", // ES Module 지원, strict가 기본이므로 "no-delete-var" 같은 설정 무시가 안된다.
      globals: {
        ...globals.browser, // 브라우저 환경 전역 변수

        nexacroApp: "writable",
        nexacro: "writable",
        google: "readonly",
        trace: "readonly",
        system: "writable",
        define: "readonly",
        module: "readonly",
        anime: "readonly",
        SockJS: "readonly",
        _application: "writable",
        required: "readonly",


      },
    },
    plugins: {
      //prettier: require("eslint-plugin-prettier") // Prettier 플러그인
    },
    rules: {


      // 기본 규칙 비활성화
      //"function-paren-newline": "off",
      //"no-control-regex": "off",
      //"no-array-constructor": "off",
      "no-self-assign": "off",
      "no-unused-vars": "off",




      "no-console": "warn",
      /*  @ eslint-disable no-console 부터 */
      /*       console.log(...)           */
      /*  @ eslint-enable no-console  까지*/

      // 엄격한 규칙 활성화
      "no-delete-var": "error", // 변수 삭제 금지
      "no-with": "error", // with 문 금지
      "no-octal": "error", // 8진수 리터럴 금지
      "no-octal-escape": "error", // 8진수 문자열 이스케이프 금지
      "no-unsafe-negation": "error", // 안전하지 않은 부정 연산자 금지
      "no-shadow-restricted-names": "error", // 예약어로 변수 이름 사용 금지 (e.g., arguments, eval)
      "no-eval": "error", // eval() 사용 금지
      "no-implied-eval": "error", // 암묵적인 eval 사용 금지
      "no-iterator": "error", // __iterator__ 프로퍼티 사용 금지
      "no-proto": "error", // __proto__ 사용 금지
      "no-undef": "error", // 선언되지 않은 변수 금지
      /*"no-redeclare": ["error", {
        "ignoreDeclarationMerge": true // 중복 선언 허용- lint 버전에 따라 동작이 다름?
      }],*/ // 동일한 변수 재선언 (var 를 썼을 경우는 무시)
      // 코드 스타일 관련 규칙
      "no-var": "off", // var 대신 let/const 사용 권장
      "prefer-const": "off", // 변경되지 않는 변수는 const 사용 권장
      "no-use-before-define": [
        "error",
        {
          //"functions": true, // 함수 선언 전에 호출 금지
          //"classes": true, // 클래스 선언 전에 사용 금지
          "variables": true // 변수 선언 전에 사용 금지
        }
      ],
      //"no-shadow": "error", //상위 스코프에서 선언된 변수 이름을 하위 스코프에서 다시 사용하는 것을 금지
      //"prettier/prettier": "error", // Prettier 규칙 활성화
      "brace-style": [
        "warn",
        "allman",
        {
          allowSingleLine: true
        }
      ]

    },

  },
  {

    files: ["**/cordova.js", "**/sockjs-1.1.1.js", "**/sockjs.js"],
    rules: {
      "no-use-before-define": "off",

    },
  }
];