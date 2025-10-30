import { Icon } from "#components-ui/icon/wrapper";
import type { IAPINotRespondingError } from "#models/api-not-responding";

const APINotRespongingElement: React.FC<{
  data: IAPINotRespondingError;
  administration: string;
}> = ({ data, administration }) => (
  <>
    {(data?.errorType === 408 && (
      <>
        <i>
          <Icon color="orange" slug="alertFill">
            La récupération de la conformité auprès des services{" "}
            {administration} a pris trop de temps.
          </Icon>
        </i>
        <br />
        <a href="">Rechargez la page</a> ou ré-essayez plus-tard.
        <br />
        <br />
      </>
    )) || (
      <>
        <i>
          <Icon color="#df0a00" slug="errorFill">
            La récupération de la conformité auprès des services{" "}
            {administration} a échoué.
          </Icon>
        </i>
        <br />
        Ré-essayez plus tard ou rapprochez-vous de l’entreprise pour lui
        demander la pièce directement.
        <br />
        <br />
      </>
    )}
  </>
);

export default APINotRespongingElement;
