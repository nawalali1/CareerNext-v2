import Head from 'next/head';
import StepProgress from '../components/StepProgress';

export default function StepProgressPage() {
  const labels = ['Profile', 'Experience', 'Review', 'Submit'];

  return (
    <>
      <Head>
        <title>Step Progress</title>
      </Head>
      <StepProgress steps={labels} current={0} onSelect={() => {}} />
    </>
  );
}
