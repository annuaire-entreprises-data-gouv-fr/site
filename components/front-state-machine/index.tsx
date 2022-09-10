import React from 'react';

/**
 * This component must be coupled with a frontend script (see /frontend/js/front-state-machine.js)
 * It enable to quickly cycle through several state or status - ideal for async download / loader etc.
 *
 * @param states requires a list of 4 JSX element, each corresponding to a state (started/pending/succes/error)
 * @returns
 */
const FrontStateMachine: React.FC<{ id?: string; states: JSX.Element[] }> = ({
  id = 'state-machine',
  states,
}) => {
  return (
    <div id={id} className="display-started">
      <div className="status-started">{states[0]}</div>
      <div className="status-pending">{states[1]}</div>
      <div className="status-success">{states[2]}</div>
      <div className="status-error">{states[3]}</div>

      <style global jsx>{`
        #${id}.display-started > div:not(.status-started) {
          display: none !important;
        }
        #${id}.display-started > div.status-started {
          display: block;
        }
        #${id}.display-pending > div:not(.status-pending) {
          display: none !important;
        }
        #${id}.display-pending > div.status-pending {
          display: block;
        }

        #${id}.display-success > div:not(.status-success) {
          display: none !important;
        }
        #${id}.display-success > div.status-success {
          display: block;
        }

        #${id}.display-error > div:not(.status-error) {
          display: none !important;
        }
        #${id}.display-error > div.status-error {
          display: block;
        }
      `}</style>
    </div>
  );
};

export default FrontStateMachine;
