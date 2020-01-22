import { useEffect } from "react";

type Props = {
  children: string | string[];
};

/**
 * Title is the component for setting the page title.
 *
 *     <Title>Deno Homepage</Title>
 */
export default function Title({ children }: Props) {
  useEffect(() => {
    const originalTitle = document.title;
    document.title = Array.isArray(children) ? children.join("") : children;
    return () => {
      document.title = originalTitle;
    };
  }, [children]);

  return null;
}
