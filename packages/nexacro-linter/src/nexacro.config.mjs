// nexacro.config.mjs
// 스텁 디자인
import
{
  has,
  not,
  get,
  and,
  or,
  xor,
  ifCond,
  onlyIfTags,
  notForTags,
  onlyForExts,
  onlyForClass,
} from "nexacro-linter/dsl.js";


const define_attr = ["id", "taborder"]; // 이렇게 변수 형태로 define 도 가능

/** @type {import("nexacro-linter").LinterConfig} */

export default [
  ////////////////////////////////////////////////////////////////////////
  // XML Rule Spec (기능형 룰) 예
  ////////////////////////////////////////////////////////////////////////

  {
    files: ["**/*.xfdl", "**/*.xadl"],
    rules: {
      "xml/required-attributes": [
        "error",
        {
          required: [
            {
              tags: ["Button"],
              attributes: define_attr,
            },
            {
              tags: ["Edit"],
              attributes: ["text"],
            },
          ],
        },
      ],
      "xml/attribute-value-validation": [
        "warn",
        {
          patterns: {
            id: /^btn-[a-z]+$/,
            taborder: /^\d+$/,
          },
        },
      ],
    },
    customRules: [
      {
        id: "custom/readonly-requires-text",
        level: "error",
        meta: { description: "readonly가 있으면 text도 필요", category: "structure" },
        dsl: ifCond(has("readonly")).then(has("text")),
      },
      {
        id: "custom/button-or-edit-must-have-id",
        level: "warn",
        meta: { description: "Button 또는 Edit는 id가 필요", category: "structure" },
        dsl: onlyIfTags(["Button", "Edit"]).then(has("id")),
      },
    ],
  },

  ////////////////////////////////////////////////////////////////////////
  // XCSS 접근성 관련 (기능형) 룰 (WCAG) 예
  ////////////////////////////////////////////////////////////////////////
  {
    files: ["**/*.xcss"],
    rules: {
      "xcss/contrast-checker": ["error", { minContrastRatio: 4.5 }],
      "xcss/font-size-minimum": ["warn", { unit: "px", min: 12 }],
      "xcss/line-height-readable": ["warn", { min: 1.5 }],
      "xcss/letter-spacing-readable": ["warn", { min: 0.12 }],
      "xcss/word-spacing-readable": ["warn", { min: 0.16 }],
    },
    customRules: [
      {
        id: "custom/focus-visual-outline",
        level: "warn",
        meta: { description: "btn- 클래스는 :focus 상태 시 outline이 필요", category: "accessibility" },
        dsl: onlyForClass(/^btn-/).status(["focus"]),
      },
    ],
  },

  ////////////////////////////////////////////////////////////////////////
  // 디자인 시스템 커버리지  예
  ////////////////////////////////////////////////////////////////////////
  {
    files: ["**/*.xcss"],
    rules: {
      "xcss/design-token-color-coverage": [
        "error",
        { tokenSet: ["#111", "#222", "var(--primary)"] }, // -nexa-define 
      ],
      "xcss/design-token-font-coverage": [
        "warn",
        { tokenSet: ["12px", "14px", "16px", "var(--font-title)"] },
      ],
      "xcss/design-token-spacing-coverage": [
        "warn",
        { tokenSet: ["4px", "8px", "12px", "16px", "var(--gap-md)"] },
      ],
    },
    customRules: [
      {
        id: "custom/token-font-size-limit",
        level: "error",
        meta: { description: "폰트 크기는 토큰 내에서만 사용", category: "design" },
        dsl: get("font-size").isTokenVal(["12px", "14px", "16px"]),
      },
    ],
  },

  ////////////////////////////////////////////////////////////////////////
  // Rule Scope & Policy DSL 예제 포함 예
  ////////////////////////////////////////////////////////////////////////
  {
    files: ["**/*.xcss"],
    customRules: [
      {
        id: "custom/class-and-unit-check",
        level: "warn",
        meta: { description: "btn- 클래스에서 font-size는 px 단위로 12 이상", category: "structure" },
        dsl: and(
          onlyForClass(/^btn-/),
          get("font-size").unitVal("px"),
          get("font-size").gteVal(12)
        ),
      },
      {
        id: "custom/status-joined-class",
        level: "error",
        meta: { description: "btn-에 .action 클래스 조합 + focus 상태", category: "accessibility" },
        dsl: onlyForClass(/^btn-/).join("action").status(["focus"]),
      },
    ],
  },
];
