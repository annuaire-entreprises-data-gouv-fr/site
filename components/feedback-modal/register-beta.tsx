import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import ButtonLink from '#components-ui/button';
import { Loader } from '#components-ui/loader';
import { useStorage } from 'hooks';
import { registerToBeta } from './actions';
import { IAgentContactInfo } from './type';

const REGISTER_BETA_ID = 'register-beta';
type IProps = { agentContactInfo: IAgentContactInfo };
export default function RegisterBeta({ agentContactInfo }: IProps) {
  const [isAlreadyRegistered, setIsRegistered] = useStorage(
    'local',
    REGISTER_BETA_ID,
    false
  );

  const [{ isNewlyRegistered, consentGiven }, setState] = useState({
    isNewlyRegistered: false,
    consentGiven: false,
  });

  const handleRegister = async () => {
    const registerStatus = await registerToBeta(agentContactInfo);
    setState({ isNewlyRegistered: true, consentGiven: true });
    if (registerStatus === false) {
      return;
    }
    setIsRegistered(true);
  };

  if (isNewlyRegistered) {
    return (
      <>
        <p className="fr-text--lg">
          <strong>🧪 Programme beta-test</strong>
        </p>
        <p>
          Merci de faire partie de notre programme de beta-test ! Nous vous
          contacterons prochainement pour vous proposer un premier échange en
          visio.
        </p>
      </>
    );
  }
  return (
    <>
      <p className="fr-text--lg">
        <strong>❤️ Merci de votre retour !</strong>
        <p>
          Notre équipe a bien reçu votre message, et vous répondra
          prochainement.
        </p>
      </p>
      {!isAlreadyRegistered && (
        <>
          Pour améliorer l’espace agent, vous pouvez participer à notre
          programme de beta-test{' '}
          <small>(entretiens en visio, questionnaires, etc.).</small>
          <form action={handleRegister}>
            <label
              className="fr-label"
              style={{ display: 'flex', gap: '0.5rem', alignItems: 'baseline' }}
            >
              <input
                type="checkbox"
                required
                id="consent"
                name="consent"
                checked={consentGiven}
                onChange={(e) => {
                  setState({
                    isNewlyRegistered,
                    consentGiven: e.target.checked,
                  });
                }}
              />{' '}
              <p>
                J’accepte d’être contacté par email à l’adresse{' '}
                {agentContactInfo.email} pour participer au programme de
                beta-test
              </p>
            </label>

            <SubmitButton disabled={!consentGiven} />
          </form>
        </>
      )}
    </>
  );
}

function SubmitButton({ disabled = false }) {
  const { pending } = useFormStatus();
  return (
    <div className="fr-btns-group">
      <ButtonLink
        aria-label="Participer au programme de beta-test"
        role="submit"
        disabled={disabled}
      >
        Participer {pending && <Loader />}
      </ButtonLink>
    </div>
  );
}
