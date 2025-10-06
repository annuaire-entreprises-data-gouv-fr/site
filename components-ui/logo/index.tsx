type IProps = {
  title: string;
  alt?: string;
  width: number;
  height: number;
  slug: string;
  className?: string;
  lazy?: boolean;
};

/**
 * Logo renderer
 * uses a slug to render any logo from /public/images/logos/...
 *
 * @param param0
 * @returns
 */
const Logo: React.FC<IProps> = ({
  title = "Annuaire des Entreprises",
  alt,
  width,
  height,
  slug = "marianne",
  className = "",
  lazy = false,
}) => (
  <div
    className="logo-wrapper"
    style={{
      width: `${width}px`,
      height: `${height}px`,
      maxWidth: " 90%",
      margin: "0 auto",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <img
      alt={alt || title}
      className={className}
      height="100%"
      loading={lazy ? "lazy" : "eager"}
      src={`/images/logos/${slug || "marianne"}.svg`}
      style={{
        margin: "auto",
        display: "block",
        maxWidth: "100%",
        maxHeight: "100%",
        boxShadow: "none",
      }}
      title={title}
      width="100%"
    />
  </div>
);

export default Logo;
