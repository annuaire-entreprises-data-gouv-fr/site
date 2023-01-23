interface IProps {
  title: string;
  width: number;
  height: number;
  slug: string;
  className?: string;
}

/**
 * Logo renderer
 * uses a slug to render any logo from /public/images/logos/...
 *
 * @param param0
 * @returns
 */
const Logo: React.FC<IProps> = ({
  title = 'Annuaire des Entreprises',
  width,
  height,
  slug = 'marianne',
  className = '',
}) => (
  <div
    className="logo-wrapper"
    style={{
      width: `${width}px`,
      height: `${height}px`,
    }}
  >
    <img
      className={className}
      src={`/images/logos/${slug || 'marianne'}.svg`}
      alt={title}
      title={title}
      width="100%"
      height="100%"
    />
    <style global jsx>
      {`
        .logo-wrapper {
          max-width: 90%;
          margin: 0 auto;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .logo-wrapper > img {
          margin: auto;
          display: block;
          max-width: 100%;
          max-height: 100%;
        }
      `}
    </style>
  </div>
);

export default Logo;
