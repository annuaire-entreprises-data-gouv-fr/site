/**
 * Initialize state machine by giving the id of the machine
 *
 * Work in pair with <FrontStateMachine /> component
 * @param {*} stateMachineId
 * @returns
 */
function FrontStateMachineFactory(stateMachineId) {
  const _wrapper = document.getElementById(stateMachineId);

  return {
    // variable to check to know if statemachine is present on page
    exists: !!_wrapper,
    setError: function () {
      _wrapper.className = 'display-error';
    },
    setStarted: function () {
      _wrapper.className = 'display-started';
    },
    setSuccess: function () {
      _wrapper.className = 'display-success';
    },
    setPending: function () {
      _wrapper.className = 'display-pending';
    },
    isStarted: function () {
      return _wrapper.className.indexOf('display-started') > -1;
    },
  };
}

export default FrontStateMachineFactory;
