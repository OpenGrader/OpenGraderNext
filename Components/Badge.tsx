export type BadgeVariant =
  | "gray"
  | "red"
  | "yellow"
  | "green"
  | "blue"
  | "indigo"
  | "purple"
  | "pink"
  | "orange"
  | "cyan";

interface BadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
}

const getClasses = (variant: BadgeVariant): string => {
  const baseClasses = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ";
  switch (variant) {
    case "gray":
      return baseClasses + "bg-gray-900 text-gray-100";
    case "red":
      return baseClasses + "bg-red-900 text-red-100";
    case "yellow":
      return baseClasses + "bg-yellow-900 text-yellow-100";
    case "green":
      return baseClasses + "bg-green-900 text-green-100";
    case "blue":
      return baseClasses + "bg-blue-900 text-blue-100";
    case "indigo":
      return baseClasses + "bg-indigo-900 text-indigo-100";
    case "purple":
      return baseClasses + "bg-purple-900 text-purple-100";
    case "pink":
      return baseClasses + "bg-pink-900 text-pink-100";
    case "orange":
      return baseClasses + "bg-orange-900 text-orange-100";
    case "cyan":
      return baseClasses + "bg-cyan-900 text-cyan-100";
  }
};

const Badge: React.FC<BadgeProps> = (badge) => {
  return <span className={getClasses(badge.variant)}>{badge.children}</span>;
};

export default Badge;
