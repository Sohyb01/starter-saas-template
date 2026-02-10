import Image from "next/image";

export const Logo = ({
  width = 100,
  color = "black",
}: {
  width?: number;
  color?: "black" | "white" | "color";
}) => {
  return (
    <div style={{ width: width }} className={`relative aspect-180/96`}>
      <Image fill alt="Website Logo" src={`/logos/logo-${color}.svg`} />
    </div>
  );
};
