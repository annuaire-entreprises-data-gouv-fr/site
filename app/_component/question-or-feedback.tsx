import { Question } from '#components-ui/question';
import FeedbackModal from '#components/feedback-modal';
import { ISession, getAgentContactInfo } from '#utils/session';

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
