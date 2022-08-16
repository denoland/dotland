/** @jsx h */
/** @jsxFrag Fragment */
import { h, VNode } from "preact";
import { tw } from "@twind";
import { useState } from "preact/hooks";
import { CodeBlock } from "@/components/CodeBlock.tsx";
import * as Icons from "@/components/Icons.tsx";

export default function InstallationBlock(props: { uaIsWin: boolean }) {
  const [isWin, setIsWin] = useState(props.uaIsWin);

  return (
    <div>
      <h2 class={tw`flex items-center gap-3`}>
        <strong class={tw`text-xl font-medium`}>Installation</strong>
        <span
          class={tw`inline-flex items-center gap-2 relative text-gray-500 leading-none hover:text-gray-900 transition-colors`}
        >
          {isWin ? "Windows (PowerShell)" : "macOS, Linux, and BSD"}
          <Icons.SelectCaret />
          <select
            class={tw`absolute top-0 left-0 w-full h-full bg-transparent border-none outline-none opacity-0 cursor-pointer`}
            onChange={(e) => {
              setIsWin((e.target as HTMLSelectElement).value === "win");
            }}
            value={isWin ? "win" : "unix"}
          >
            <option value="unix">macOS, Linux, and BSD</option>
            <option value="win">Windows (PowerShell)</option>
          </select>
        </span>
      </h2>
      <CodeBlock
        class="mt-4 border-2 border-fresh !bg-[#F3FBF5]"
        code={isWin
          ? `iwr https://deno.land/install.ps1 -useb | iex`
          : `curl -fsSL https://deno.land/install.sh | sh`}
        language="bash"
      >
      </CodeBlock>
    </div>
  );
}
