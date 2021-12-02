import { PrintOnly } from '../print-visibility';

const BreakPageForPrint = () => (
  <PrintOnly>
    <div className="page-break">
      <style jsx>{`
        div.page-break {
          page-break-before: always;
        }
      `}</style>
    </div>
  </PrintOnly>
);
export default BreakPageForPrint;
