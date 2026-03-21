// --- highlight.js core + languages (tree-shakeable) ---
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import python from "highlight.js/lib/languages/python";
import rust from "highlight.js/lib/languages/rust";
import go from "highlight.js/lib/languages/go";
import java from "highlight.js/lib/languages/java";
import c from "highlight.js/lib/languages/c";
import cpp from "highlight.js/lib/languages/cpp";
import csharp from "highlight.js/lib/languages/csharp";
import php from "highlight.js/lib/languages/php";
import ruby from "highlight.js/lib/languages/ruby";
import swift from "highlight.js/lib/languages/swift";
import kotlin from "highlight.js/lib/languages/kotlin";
import xml from "highlight.js/lib/languages/xml";  // html
import css from "highlight.js/lib/languages/css";
import sql from "highlight.js/lib/languages/sql";
import bash from "highlight.js/lib/languages/bash";
import json from "highlight.js/lib/languages/json";
import yaml from "highlight.js/lib/languages/yaml";
import markdown from "highlight.js/lib/languages/markdown";

// Theme — swap for any hljs theme: https://highlightjs.org/demo
import "highlight.js/styles/github-dark-dimmed.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("python",     python);
hljs.registerLanguage("rust",       rust);
hljs.registerLanguage("go",         go);
hljs.registerLanguage("java",       java);
hljs.registerLanguage("c",          c);
hljs.registerLanguage("cpp",        cpp);
hljs.registerLanguage("csharp",     csharp);
hljs.registerLanguage("php",        php);
hljs.registerLanguage("ruby",       ruby);
hljs.registerLanguage("swift",      swift);
hljs.registerLanguage("kotlin",     kotlin);
hljs.registerLanguage("html",       xml);
hljs.registerLanguage("css",        css);
hljs.registerLanguage("sql",        sql);
hljs.registerLanguage("bash",       bash);
hljs.registerLanguage("json",       json);
hljs.registerLanguage("yaml",       yaml);
hljs.registerLanguage("markdown",   markdown);

// supported languages
const LANGUAGES = [
  { label: "JavaScript", value: "javascript" },
  { label: "TypeScript", value: "typescript" },
  { label: "Python",     value: "python"     },
  { label: "Rust",       value: "rust"       },
  { label: "Go",         value: "go"         },
  { label: "Java",       value: "java"       },
  { label: "C",          value: "c"          },
  { label: "C++",        value: "cpp"        },
  { label: "C#",         value: "csharp"     },
  { label: "PHP",        value: "php"        },
  { label: "Ruby",       value: "ruby"       },
  { label: "Swift",      value: "swift"      },
  { label: "Kotlin",     value: "kotlin"     },
  { label: "HTML",       value: "html"       },
  { label: "CSS",        value: "css"        },
  { label: "SQL",        value: "sql"        },
  { label: "Bash",       value: "bash"       },
  { label: "JSON",       value: "json"       },
  { label: "YAML",       value: "yaml"       },
  { label: "Markdown",   value: "markdown"   },
];


const EDITOR_FONT = "'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Consolas', monospace";
const EDITOR_FONT_SIZE = "13px";
const EDITOR_LINE_HEIGHT = "1.65";
const EDITOR_PADDING = "16px";

const GUTTER_WIDTH = "44px"; // enough for 4-digit line numbers



export const CodeEditor = ({ code, setCode, language, setLanguage, isEditingMode = true }) => {
  const highlightRef = useRef(null);
  const textareaRef  = useRef(null);
  const gutterRef    = useRef(null);

  const lineCount = code ? code.split("\n").length : 1;

useEffect(() => {
  if (!highlightRef.current) return;
  
  // Use a fallback language if 'language' is null or undefined
  const validLanguage = language ?? "bash"; 
  
  try {
    const result = hljs.highlight(code || " ", { 
      language: validLanguage, 
      ignoreIllegals: true 
    });
    highlightRef.current.innerHTML = result.value + "\n";
  } catch (err) {
    const result = hljs.highlightAuto(code || " ");
    highlightRef.current.innerHTML = result.value + "\n";
  }
}, [code, language]);

  const syncScroll = useCallback(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    if (highlightRef.current?.parentElement) {
      highlightRef.current.parentElement.scrollTop  = ta.scrollTop;
      highlightRef.current.parentElement.scrollLeft = ta.scrollLeft;
    }
    if (gutterRef.current) {
      gutterRef.current.scrollTop = ta.scrollTop;
    }
  }, []);

  const handleKeyDown = (e) => {
    if (!isEditingMode) return; // Disable all logic if not editing
    if (e.key !== "Tab") return;
    e.preventDefault();
    const el    = e.target;
    const start = el.selectionStart;
    const end   = el.selectionEnd;
    const next  = code.substring(0, start) + "  " + code.substring(end);
    setCode(next);
    requestAnimationFrame(() => { el.selectionStart = el.selectionEnd = start + 2; });
  };

  const langLabel = LANGUAGES.find(l => l.value === language)?.label ?? "Code";

  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(() => {
    if (!code.trim()) return;
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [code]);

  const sharedStyle = {
    fontFamily:  EDITOR_FONT,
    fontSize:    EDITOR_FONT_SIZE,
    lineHeight:  EDITOR_LINE_HEIGHT,
    padding:     `${EDITOR_PADDING} ${EDITOR_PADDING} ${EDITOR_PADDING} ${EDITOR_PADDING}`,
    whiteSpace:  "pre",
    wordWrap:    "normal",
    boxSizing:   "border-box",
    margin:      0,
  };

  return (
    <div
      className={`mt-3 rounded-lg border border-white/10 overflow-hidden shadow-lg transition-opacity ${!isEditingMode ? 'opacity-90' : ''}`}
      style={{ background: "#1e2030" }}
    >
      {/* ── Toolbar ── */}
      <div
        className="flex items-center justify-between px-3 py-2 border-b border-white/10 select-none"
        style={{ background: "#171926" }}
      >
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full" style={{ background: "#ff5f57" }} />
          <span className="w-3 h-3 rounded-full" style={{ background: "#febc2e" }} />
          <span className="w-3 h-3 rounded-full" style={{ background: "#28c840" }} />
          <span className="ml-3 text-[11px] text-white/35 font-mono select-none">
            {langLabel} {!isEditingMode && "(Preview)"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Hide selector if not editing */}
          {isEditingMode && (
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="text-[11px] border border-white/10 rounded px-2 py-0.5 cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
              style={{ background: "#252839", color: "rgba(255,255,255,0.65)" }}
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.value} value={lang.value} style={{ background: "#1e2030" }}>
                  {lang.label}
                </option>
              ))}
            </select>
          )}

          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-0.5 rounded border border-white/10 transition-all duration-200 cursor-pointer"
            style={{
              background: copied ? "rgba(40,200,100,0.15)" : "rgba(255,255,255,0.06)",
              color:      copied ? "#4ade80"               : "rgba(255,255,255,0.5)",
              borderColor: copied ? "rgba(74,222,128,0.3)" : "rgba(255,255,255,0.1)",
              fontSize: "11px",
            }}
          >
            {copied ? <Check size={11} /> : <Copy size={11} />}
            <span className="font-mono">{copied ? "Copied!" : "Copy"}</span>
          </button>
        </div>
      </div>

      {/* ── Editor body ── */}
      <div className="flex" style={{ minHeight: "140px", maxHeight: "360px" }}>
        <div
          ref={gutterRef}
          aria-hidden="true"
          className="select-none overflow-hidden flex-shrink-0"
          style={{
            width:           GUTTER_WIDTH,
            background:      "#181926",
            borderRight:     "1px solid rgba(255,255,255,0.07)",
            paddingTop:      EDITOR_PADDING,
            paddingBottom:   EDITOR_PADDING,
            overflowY:       "hidden",
          }}
        >
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i} style={{ fontFamily: EDITOR_FONT, fontSize: EDITOR_FONT_SIZE, lineHeight: EDITOR_LINE_HEIGHT, textAlign: "right", paddingRight: "10px", color: "rgba(255,255,255,0.2)" }}>
              {i + 1}
            </div>
          ))}
        </div>

        <div className="relative flex-1 overflow-hidden">
          <pre
            aria-hidden="true"
            className="hljs absolute inset-0 m-0 overflow-auto pointer-events-none"
            style={{ ...sharedStyle, background: "transparent" }}
          >
            <code ref={highlightRef} className={`language-${language}`} style={{ background: "transparent", padding: 0 }} />
          </pre>

          <textarea
            ref={textareaRef}
            value={code ?? ""}
            onChange={(e) => isEditingMode && setCode(e.target.value)}
            onScroll={syncScroll}
            onKeyDown={handleKeyDown}
            readOnly={!isEditingMode} // Native HTML attribute
            spellCheck={false}
            className="absolute inset-0 w-full h-full resize-none outline-none overflow-auto"
            style={{
              ...sharedStyle,
              background:  "transparent",
              color:       "transparent",
              // Hide caret if not editing
              caretColor:  isEditingMode ? "#e2e8f0" : "transparent",
              zIndex:      1,
              tabSize:     2,
              // Use default cursor when not editing to signal it's a view
              cursor:      isEditingMode ? "text" : "default"
            }}
          />
        </div>
      </div>

      <div className="flex justify-end px-3 py-1 border-t border-white/10 select-none" style={{ background: "#171926" }}>
        <span className="text-[10px] text-white/30 font-mono">
          {code ? `${lineCount} lines · ${code.length} chars` : "empty"}
        </span>
      </div>
    </div>
  );
};