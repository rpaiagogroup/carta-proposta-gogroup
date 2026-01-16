import React from 'react';
import { FormProvider, useForm } from './context/FormContext';
import MainLayout from './components/MainLayout';
import StepCommon from './components/steps/StepCommon';
import StepModalidade from './components/steps/StepModalidade';
import StepFinal from './components/steps/StepFinal';

const StepRenderer = () => {
  const { state } = useForm();

  switch (state.currentStep) {
    case 1:
      return <StepCommon />;
    case 2:
      return <StepModalidade />;
    case 3:
      return <StepFinal />;
    default:
      return <StepCommon />;
  }
};

const App = () => {
  return (
    <FormProvider>
      <MainLayout>
        <StepRenderer />
      </MainLayout>
    </FormProvider>
  );
};

export default App;
