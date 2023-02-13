import { MouseEventHandler } from 'react';
import { Icon } from '#components-ui/icon/wrapper';
import constants from '#models/constants';

const ActiveFilterLabel: React.FC<{
  label?: string;
  icon: string;
  query: string;
  onClick: MouseEventHandler;
}> = ({ label, icon, query, onClick }) => (
  <div className="selected-filter-container cursor-pointer">
    <span onClick={onClick}>
      <Icon color={constants.colors.frBlue} slug={icon}>
        &nbsp;{label}
      </Icon>
    </span>
    <a className="no-style-link" href={query}>
      ✕
    </a>
    <style jsx>{`
      .selected-filter-container {
        display: flex;
        align-items: center;
        padding: 3px 30px 3px 10px;
        color: ${constants.colors.frBlue};
        background-color: ${constants.colors.pastelBlue};
        border-radius: 3px;
        border: 1px solid ${constants.colors.frBlue};
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
        background-color: ${constants.colors.frBlue}11;
      }
    `}</style>
  </div>
);

export default ActiveFilterLabel;
