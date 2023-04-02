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
      return baseClasses + "border border-gray-600 bg-gray-800/20 text-gray-300";
    case "red":
      return baseClasses + "border border-red-600 bg-red-800/20 text-red-300";
    case "yellow":
      return baseClasses + "border border-yellow-600 bg-yellow-800/20 text-yellow-300";
    case "green":
      return baseClasses + "border border-green-600 bg-green-800/20 text-green-300";
    case "blue":
      return baseClasses + "border border-blue-600 bg-blue-800/20 text-blue-300";
    case "indigo":
      return baseClasses + "border border-indigo-600 bg-indigo-800/20 text-indigo-300";
    case "purple":
      return baseClasses + "border border-purple-600 bg-purple-800/20 text-purple-300";
    case "pink":
      return baseClasses + "border border-pink-600 bg-pink-800/20 text-pink-300";
    case "orange":
      return baseClasses + "border border-orange-600 bg-orange-800/20 text-orange-300";
    case "cyan":
      return baseClasses + "border border-cyan-600 bg-cyan-800/20 text-cyan-300";
  }
};

const Badge: React.FC<BadgeProps> = (badge) => {
  return <span className={getClasses(badge.variant)}>{badge.children}</span>;
};

export default Badge;
