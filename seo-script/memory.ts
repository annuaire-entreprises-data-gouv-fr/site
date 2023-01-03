/**
 * Memory monitoring helpers
 */

const mem = () => {
  return process.memoryUsage().heapUsed / 1024 / 1024;
};

const logMem = () => {
  const used = mem();
  console.info(
    `The script uses approximately ${Math.round(used * 100) / 100} MB`
  );
};

export { mem, logMem };
