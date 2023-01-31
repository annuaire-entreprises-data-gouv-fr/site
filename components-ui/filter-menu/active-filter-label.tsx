import { MouseEventHandler } from 'react';

const ActiveFilterLabel: React.FC<{
  label?: string;
  icon?: JSX.Element;
  query: string;
  onClick: MouseEventHandler;
}> = ({ label, icon = null, query, onClick }) => (
  <div className="selected-filter-container cursor-pointer">
    <span onClick={onClick}>
      {icon}&nbsp;{label}
    </span>
    <a className="no-style-link" href={query}>
      ✕
    </a>
    <style jsx>{`
      .selected-filter-container {
        display: flex;
        align-items: center;
        padding: 5px 30px 5px 10px;
        color: #000091;
        background-color: #dfdff1;
        border-radius: 5px;
        border: 1px solid #000091;
      }
      .selected-filter-container:hover {
        border-color: #0a76f6;
      }

      .selected-filter-container > a {
        padding: 5px 10px 5px 5px;
        font-weight: bold;
        position: absolute;
        right: 0;
      }
      .selected-filter-container > a:hover {
        background-color: #00009111;
      }
    `}</style>
  </div>
);

export default ActiveFilterLabel;
