import Link from "next/link";

type PanelLinkProps = {
  title: string;
  href?: string;
  position: "first" | "last" | "only" | "other";
  children: React.ReactNode;
} & Record<string, any>;

const classNames = (...classes: (string | undefined | boolean)[]) => classes.filter(Boolean).join(" ");

const PanelLink: React.FC<PanelLinkProps> = ({ title, href, position, children, ...props }) => {
  const Component = href ? Link : "button";
  const roundingRules: Map<typeof position, string> = new Map([
    ["first", "rounded-l-md"],
    ["last", "rounded-r-md"],
    ["only", "rounded-md"],
    ["other", ""],
  ]);

  return (
    <li>
      <Component
        {...props}
        href={href ?? ""}
        title={title}
        className={classNames(
          "rounded-l-md border-gray-400 text-gray-300 p-1 h-8 w-9 flex items-center justify-center hover:bg-gray-800 transition-all",
          roundingRules.get(position),
          // all should have right border except last and only items to prevent double border weight
          ["first", "other"].includes(position) && "border-r",
        )}
      >
        {children}
      </Component>
    </li>
  );
};

export default PanelLink;
