import { capitalize } from '#utils/helpers';

const AdministrationInformation: React.FC<{
  str: string;
  administration?: string;
}> = ({ str, administration }) => {
  return capitalize(`${administration ? `${administration} : ` : ''}${str}`);
};

export default AdministrationInformation
