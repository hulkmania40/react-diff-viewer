import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactDiffViewer from "react-diff-viewer";

interface DiffViewerComponentProps {
  oldFile: string;
  newFile: string;
}

type Hunk = HTMLElement[]; // a consecutive group of changed rows

const DiffViewerComponent: React.FC<DiffViewerComponentProps> = ({ oldFile, newFile }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hunks, setHunks] = useState<Hunk[]>([]);
  const [current, setCurrent] = useState<number>(-1);

  // Find rows that represent changes and group consecutive rows into hunks
  const collectHunks = useCallback(() => {
    const root = containerRef.current;
    if (!root) return;

    const allRows = Array.from(root.querySelectorAll("tr")) as HTMLElement[];

    const isChangeRow = (tr: HTMLElement) =>
      !!tr.querySelector(
        // match a wide range of classnames the lib may use: added/removed/changed
        'td[class*="add"], td[class*="remov"], td[class*="chang"], td[class*="diff-"], td[class*="ins"], td[class*="del"]'
      );

    const chunks: Hunk[] = [];
    let acc: Hunk = [];

    for (const tr of allRows) {
      if (isChangeRow(tr)) {
        acc.push(tr);
      } else if (acc.length) {
        chunks.push(acc);
        acc = [];
      }
    }
    if (acc.length) chunks.push(acc);

    setHunks(chunks);
    setCurrent(-1); // reset selection on new render/content
  }, []);

  // Observe DOM changes from ReactDiffViewer and (re)collect hunks
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new MutationObserver(() => {
      // defer to next tick to ensure layout is settled
      queueMicrotask(collectHunks);
    });

    observer.observe(el, { childList: true, subtree: true });
    collectHunks();

    return () => observer.disconnect();
  }, [collectHunks, oldFile, newFile]);

  // Apply/remove visual highlight for current hunk
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    // clear previous highlight
    root.querySelectorAll(".rdv-current-hunk").forEach((el) => el.classList.remove("rdv-current-hunk"));

    if (current >= 0 && hunks[current]) {
      for (const row of hunks[current]) row.classList.add("rdv-current-hunk");
      // center the first row of the hunk
      hunks[current][0].scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [current, hunks]);

  // Keyboard navigation: N (next), P (previous)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // don't steal keys from inputs
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select" || target?.isContentEditable) return;

      if (!hunks.length) return;

      if (e.key === "n" || e.key === "N") {
        e.preventDefault();
        setCurrent((idx) => Math.min((idx < 0 ? 0 : idx + 1), hunks.length - 1));
      } else if (e.key === "p" || e.key === "P") {
        e.preventDefault();
        setCurrent((idx) => Math.max(idx <= 0 ? 0 : idx - 1, 0));
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [hunks.length]);

  return (
    <div className="p-4">
      {/* inline styles for the highlight */}
      <style>{`
        .rdv-current-hunk { outline: 2px solid orange; outline-offset: -2px; }
        .rdv-current-hunk > td { background: rgba(255,165,0,0.15) !important; }
      `}</style>

      <h2 className="text-xl font-semibold mb-2">
        File Differences <span className="text-sm font-normal opacity-70">(Press <kbd>P</kbd> / <kbd>N</kbd> to move between change sets)</span>
      </h2>

      <div ref={containerRef}>
        <ReactDiffViewer
          oldValue={oldFile}
          newValue={newFile}
          splitView={false}
          hideLineNumbers={false}
          showDiffOnly={true}   // works either way; set true if you prefer only change blocks
          disableWordDiff={false}
        />
      </div>
    </div>
  );
};

export default DiffViewerComponent;
