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
    setNotFound: function () {
      _wrapper.className = 'display-not-found';
    },
    setDefault: function () {
      _wrapper.className = 'display-default';
    },
    setSuccess: function () {
      _wrapper.className = 'display-success';
    },
    setStarted: function () {
      _wrapper.className = 'display-started';
    },
    isStarted: function () {
      return _wrapper.className.indexOf('display-started') > -1;
    },
  };
}

export default FrontStateMachineFactory;
