/**
 * Memory monitoring helpers
 */

mem = () => {
  return (used = process.memoryUsage().heapUsed / 1024 / 1024);
};

logMem = () => {
  const used = mem();
  console.log(
    `The script uses approximately ${Math.round(used * 100) / 100} MB`
  );
};

module.exports = { mem, logMem };
