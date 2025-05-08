import Head from 'next/head';
import StepIndicator from '../components/StepIndicator';

export default function StepIndicatorPage() {
  // Example steps; replace with your own data or props
  const steps = [
    { key: 'one',   title: 'Step One'   },
    { key: 'two',   title: 'Step Two'   },
    { key: 'three', title: 'Step Three' },
  ];

  return (
    <>
      <Head>
        <title>Step Indicator</title>
      </Head>
      <StepIndicator steps={steps} current={0} />
    </>
  );
}
