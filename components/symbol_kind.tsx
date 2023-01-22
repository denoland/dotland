// Copyright 2021-2023 the Deno authors. All rights reserved. MIT license.

export const colors = {
  "namespace": ["#D25646", "#D256461A"],
  "class": ["#20B44B", "#2FA8501A"],
  "enum": ["#22ABB0", "#22ABB01A"],
  "variable": ["#7E57C0", "#7E57C01A"],
  "function": ["#056CF0", "#026BEB1A"],
  "interface": ["#D2A064", "#D4A0681A"],
  "typeAlias": ["#A4478C", "#A4478C1A"],
  "moduleDoc": ["", ""],
  "import": ["", ""],
} as const;

export const docNodeKindMap = {
  "namespace": Namespace,
  "class": Class,
  "enum": Enum,
  "variable": Variable,
  "function": Function,
  "interface": Interface,
  "typeAlias": TypeAlias,
  "moduleDoc": () => null,
  "import": () => null,
} as const;

export const docNodeKindOrder = Object.keys(colors);

export function Namespace() {
  const [text, bg] = colors["namespace"];
  return (
    <div class={`bg-[${bg}] text-[${text}] symbolKind`}>
      N
    </div>
  );
}

export function Class() {
  const [text, bg] = colors["class"];
  return (
    <div
      class={`bg-[${bg}] text-[${text}] symbolKind`}
      title="Class"
    >
      c
    </div>
  );
}

export function Enum() {
  const [text, bg] = colors["enum"];
  return (
    <div
      class={`bg-[${bg}] text-[${text}] symbolKind`}
      title="Enum"
    >
      E
    </div>
  );
}

export function Variable() {
  const [text, bg] = colors["variable"];
  return (
    <div
      class={`bg-[${bg}] text-[${text}] symbolKind`}
      title="Variable"
    >
      v
    </div>
  );
}

export function Function() {
  const [text, bg] = colors["function"];
  return (
    <div
      class={`bg-[${bg}] text-[${text}] symbolKind`}
      title="Function"
    >
      f
    </div>
  );
}

export function Interface() {
  const [text, bg] = colors["interface"];
  return (
    <div
      class={`bg-[${bg}] text-[${text}] symbolKind`}
      title="Interface"
    >
      I
    </div>
  );
}

export function TypeAlias() {
  const [text, bg] = colors["typeAlias"];
  return (
    <div
      class={`bg-[${bg}] text-[${text}] symbolKind`}
      title="Type Alias"
    >
      T
    </div>
  );
}
