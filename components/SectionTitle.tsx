type Props = {
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  variant?: "light" | "dark";
};

export function SectionTitle({
  eyebrow,
  title,
  description,
  align = "left",
  variant = "light",
}: Props) {
  const dark = variant === "dark";
  const alignment = align === "center" ? "items-center text-center" : "items-start";

  return (
    <div className={`flex flex-col ${alignment} max-w-3xl`}>
      <span className={`eyebrow ${dark ? "text-white/60" : "text-noir/55"}`}>{eyebrow}</span>
      <span
        aria-hidden
        className={`my-6 block h-px w-12 ${dark ? "bg-olive-light" : "bg-olive"}`}
      />
      <h2
        className={`font-display text-4xl font-light leading-[1.05] tracking-tight text-balance sm:text-5xl lg:text-6xl ${
          dark ? "text-white" : "text-noir"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-6 max-w-2xl text-base leading-relaxed sm:text-lg ${
            dark ? "text-white/70" : "text-noir/65"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
