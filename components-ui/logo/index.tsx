import logo from '../../public/images/logo';

const Logo = ({ width = 300 }) => (
  <div className="logo-wrapper">
    {logo}
    <style jsx>
      {`
        .logo-wrapper {
          max-width: 90%;
          width: ${width}px;
          margin: 0 auto;
        }
      `}
    </style>
  </div>
);

export default Logo;
