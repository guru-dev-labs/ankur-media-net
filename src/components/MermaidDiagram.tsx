"use client";
import { useEffect, useRef } from "react";
import mermaid from "mermaid";

interface MermaidDiagramProps {
  chart: string;
}

export default function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      mermaid.initialize({ startOnLoad: true, theme: "default" });
      try {
        ref.current.innerHTML = `<div class="mermaid">${chart}</div>`;
        mermaid.init(undefined, ref.current);
      } catch (e) {
        console.error("Mermaid render error:", e);
        ref.current.innerHTML = `<pre style="color:red">Mermaid render error</pre>`;
      }
    }
  }, [chart]);

  return <div ref={ref} />;
}
