import FeedbackModal from '#components/feedback-modal';
import { Question } from '#components/question';
import { getAgentContactInfo } from '#models/user/helpers';
import { ISession } from '#models/user/session';

export default function QuestionOrFeedback({
  session,
}: {
  session: ISession | null;
}) {
  const agentContactInfo = getAgentContactInfo(session);

  if (!agentContactInfo) {
    return <Question />;
  }
  return <FeedbackModal agentContactInfo={agentContactInfo} />;
}
