import FeedbackModal from '#components/feedback-modal';
import { Question } from '#components/question';
import { ISession } from '#utils/session';

export default function QuestionOrFeedback({
  session,
}: {
  session: ISession | null;
}) {
  const agentContactInfo = {
    email: 'johan.girod@beta.gouv.fr',
    name: 'Johan Girod',
  };
  // getAgentContactInfo(session);
  if (!agentContactInfo) {
    return <Question />;
  }
  return <FeedbackModal agentContactInfo={agentContactInfo} />;
}
