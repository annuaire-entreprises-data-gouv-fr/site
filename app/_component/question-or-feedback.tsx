import FeedbackModal from '#components/feedback-modal';
import { IAgentContactInfo } from '#components/feedback-modal/type';
import { Question } from '#components/question';
import { EScope, hasRights } from '#models/user/rights';
import { ISession } from '#models/user/session';

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

const getAgentContactInfo = (
  session: ISession | null
): IAgentContactInfo | null => {
  if (!hasRights(session, EScope.isAgent) || !session?.user?.email) {
    return null;
  }
  return {
    email: session.user.email,
    name: session.user.fullName,
  };
};
