import { PrintOnly } from '#components-ui/print-visibility';

const BreakPageForPrint = () => (
  <PrintOnly>
    <div style={{ pageBreakBefore: 'always' }} />
  </PrintOnly>
);
export default BreakPageForPrint;
