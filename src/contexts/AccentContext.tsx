import React, { createContext, useContext, useState } from "react";

export const ACCENTS = [
  { id: "purple", label: "Lilas", color: "#c859ff" },
  { id: "blue",   label: "Azul",    color: "#4FC3F7" },
  { id: "green",  label: "Verde",   color: "#66BB6A" },
  { id: "orange", label: "Laranja", color: "#FF8C42" },
  { id: "pink",   label: "Rosa",    color: "#F48FB1" },
];

interface AccentContextData {
  accent: string;
  accentColor: string;
  setAccent: (id: string) => void;
}

const AccentContext = createContext<AccentContextData>({} as AccentContextData);

export function AccentProvider({ children }: { children: React.ReactNode }) {
  const [accent, setAccent] = useState("purple");
  const accentColor = ACCENTS.find(a => a.id === accent)?.color || "#c859ff";

  return (
    <AccentContext.Provider value={{ accent, accentColor, setAccent }}>
      {children}
    </AccentContext.Provider>
  );
}

export const useAccent = () => useContext(AccentContext);
