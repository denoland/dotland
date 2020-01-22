import { useEffect } from "react";

type Props = {
  children: string | string[];
};

export default ({ children }: Props) => {
  useEffect(() => {
    const originalTitle = document.title;
    document.title = Array.isArray(children) ? children.join("") : children;
    return () => {
      document.title = originalTitle;
    };
  }, [children]);

  return null;
};
