import { useEffect, useMemo, useRef, useState } from "react";
import Editor from "@monaco-editor/react";

type Starters = Record<string, string>;

type SubmitBreakdown = {
  id: number;
  visibility: "public" | "hidden";
  status: "AC" | "WA" | "TLE" | "RE" | "CE" | string;
  timeMs: number;
};

type SubmitResp = {
  overall_verdict: string;
  breakdown: SubmitBreakdown[];
};

interface Props {
  apiBase: string;             // e.g. http://localhost:8000/api
  userId: string;              // your logged-in user id
  problemId: string | number;  // id or slug
  starters?: Starters;         // starter code per language
}

const LANGS = [
  { value: "python", label: "Python" },
  { value: "cpp", label: "C++17" },
  { value: "java", label: "Java 17" },
];

const DEFAULT_STARTERS: Starters = {
  python: `import sys

def main():
    data = sys.stdin.read().strip()
    print("echo:", data)

if __name__ == "__main__":
    main()
`,
  cpp: `#include <bits/stdc++.h>
using namespace std;
int main(){ios::sync_with_stdio(false);cin.tie(nullptr);
  string line; vector<string> lines; while(getline(cin,line)) lines.push_back(line);
  cout << "echo:"; for (auto &s: lines) cout << "\\n" << s; cout << "\\n"; return 0;
}
`,
  java: `import java.io.*;import java.util.*;
public class Main{
  public static void main(String[] args) throws Exception{
    var br=new BufferedReader(new InputStreamReader(System.in));
    var sb=new StringBuilder(); String ln;
    while((ln=br.readLine())!=null) sb.append(ln).append("\\n");
    System.out.print("echo:\\n"+sb.toString());
  }
}
`,
};

export default function ProblemWorkspace({ apiBase, userId, problemId, starters }: Props) {
  const [language, setLanguage] = useState<string>("python");
  const [source, setSource] = useState<string>("");
  const [stdinText, setStdinText] = useState<string>("");
  const [stdoutText, setStdoutText] = useState<string>("");
  const [running, setRunning] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [verdict, setVerdict] = useState<{ overall: string; tests: { label: string; status: string }[] } | null>(null);

  const lsKey = useMemo(
    () => `oj:code:${userId}:${problemId}:${language}`,
    [userId, problemId, language]
  );

  // load starter or cached code
  useEffect(() => {
    const cached = localStorage.getItem(lsKey);
    if (cached) {
      setSource(cached);
    } else {
      const starter = starters?.[language] ?? DEFAULT_STARTERS[language] ?? "";
      setSource(starter);
      localStorage.setItem(lsKey, starter);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lsKey, language]);

  // debounce local save
  const saveTimer = useRef<number | undefined>(undefined);
  const onChange = (val?: string) => {
    const v = val ?? "";
    setSource(v);
    window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => {
      localStorage.setItem(lsKey, v);
    }, 300);
  };

  const runCustom = async () => {
    setRunning(true); setStdoutText("");
    try {
      const resp = await fetch(`${apiBase}/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-User-Id": userId },
        body: JSON.stringify({ problemId, language, source, stdin: stdinText }),
      });
      if (!resp.ok) throw new Error("Runner API not reachable");
      const data: { stdout?: string; stderr?: string; timeMs?: number } = await resp.json();
      setStdoutText((data.stdout ?? "") + (data.stderr ? `\n[stderr]\n${data.stderr}` : ""));
    } catch {
      // fallback so UI still works if backend off
      setStdoutText(`(demo) Ran locally. Wire ${apiBase}/run to execute for real.`);
    } finally {
      setRunning(false);
    }
  };

  const submit = async () => {
    setSubmitting(true); setVerdict(null);
    try {
      const resp = await fetch(`${apiBase}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-User-Id": userId },
        body: JSON.stringify({ problemId, language, source }),
      });
      if (!resp.ok) throw new Error("Submit API not reachable");
      const data: SubmitResp = await resp.json();
      setVerdict({
        overall: data.overall_verdict,
        tests: data.breakdown.map((t, i) => ({
          label: `${t.visibility === "public" ? "Sample" : "Hidden"} ${i + 1}`,
          status: t.status,
        })),
      });
    } catch {
      // demo chips
      setVerdict({
        overall: "Wrong Answer",
        tests: Array.from({ length: 8 }, (_, i) => ({ label: `Hidden ${i + 1}`, status: i < 6 ? "AC" : "WA" })),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="oj-card">
      <div className="oj-title">Your Solution</div>

      <div className="oj-toolbar">
        <select className="oj-select" value={language} onChange={(e) => setLanguage(e.target.value)}>
          {LANGS.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
        </select>
        <div style={{ flex: 1 }} />
        <button className="oj-btn primary" onClick={submit} disabled={submitting}>
          {submitting ? "Submitting…" : "Submit"}
        </button>
      </div>

      <div className="oj-editor" style={{ height: "58vh" }}>
        <Editor
          height="58vh"
          language={language === "cpp" ? "cpp" : language}
          value={source}
          onChange={onChange}
          options={{ fontSize: 14, minimap: { enabled: false }, scrollBeyondLastLine: false, automaticLayout: true }}
        />
      </div>

      <div className="oj-two">
        <div>
          <div className="oj-label">Input</div>
          <textarea className="oj-textarea" value={stdinText} onChange={(e) => setStdinText(e.target.value)} placeholder="Type custom stdin here…" />
          <button className="oj-btn" onClick={runCustom} disabled={running} style={{ marginTop: 8 }}>
            {running ? "Running…" : "Run"}
          </button>
        </div>
        <div>
          <div className="oj-label">Output</div>
          <pre className="oj-output">{stdoutText}</pre>
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        {!verdict ? (
          <div className="oj-muted">Submit to see verdicts here.</div>
        ) : (
          <>
            <div className={verdict.overall === "Accepted" ? "oj-overall ok" : "oj-overall bad"}>
              Result: {verdict.overall}
            </div>
            <div className="oj-chips">
              {verdict.tests.map((t, i) => (
                <div key={i} className={`oj-chip ${t.status === "AC" ? "ac" : "fail"}`}>
                  {t.label}: {t.status}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
