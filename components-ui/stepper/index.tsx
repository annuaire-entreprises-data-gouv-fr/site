type IStepperProps = {
  titles: Array<string>;
  currentStep: number;
};
export default function Stepper({ titles, currentStep }: IStepperProps) {
  const totalSteps = titles.length;
  return (
    <div className="fr-stepper">
      <h2 className="fr-stepper__title">
        <span className="fr-stepper__state">Étape {currentStep + 1} sur 3</span>
        {titles[currentStep]}
      </h2>
      <div
        className="fr-stepper__steps"
        data-fr-current-step={currentStep + 1}
        data-fr-steps={totalSteps}
      ></div>
      {currentStep < totalSteps - 1 && (
        <p className="fr-stepper__details">
          <span className="fr-text--bold">Étape suivante :</span>{' '}
          {titles[currentStep + 1]}
        </p>
      )}
    </div>
  );
}
