import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

interface MathTextProps {
  text: string;
}

export function MathText({ text }: MathTextProps) {
  const parts = text.split(/(\$[^$]+\$)/);

  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("$") && part.endsWith("$")) {
          const math = part.slice(1, -1);
          return <InlineMath key={i} math={math} />;
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}
