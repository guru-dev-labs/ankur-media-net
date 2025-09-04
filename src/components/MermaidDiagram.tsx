"use client";

import React, { useEffect } from "react";
import mermaid from "mermaid";

// Initialize Mermaid.js for client-side rendering
if (typeof window !== "undefined") {
  mermaid.initialize({
    startOnLoad: true,
    theme: "neutral",
    securityLevel: "loose",
  });
}

interface MermaidDiagramProps {
  chart: string;
}

const MermaidDiagram = ({ chart }: MermaidDiagramProps) => {
  useEffect(() => {
    // Rerender the diagram when the chart data changes
    mermaid.run();
  }, [chart]);

  return <div className="mermaid">{chart}</div>;
};

export default MermaidDiagram;
