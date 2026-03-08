import { useState, useEffect } from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export function JsonEditor({ value, onChange }: Props) {
  const [text, setText] = useState(value);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setText(value);
  }, [value]);

  const handleChange = (newText: string) => {
    setText(newText);
    try {
      JSON.parse(newText);
      setError(null);
      onChange(newText);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <textarea
        value={text}
        onChange={(e) => handleChange(e.target.value)}
        spellCheck={false}
        style={{
          flex: 1,
          fontFamily: "monospace",
          fontSize: "13px",
          padding: "12px",
          border: error ? "2px solid #ef4444" : "2px solid #e5e7eb",
          borderRadius: "8px",
          resize: "none",
          outline: "none",
          lineHeight: "1.5",
          minHeight: "400px",
          background: "#fafafa",
        }}
      />
      {error && (
        <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>{error}</p>
      )}
    </div>
  );
}
