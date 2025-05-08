import Head from 'next/head';
import SectionEditor from '../components/SectionEditor';

export default function SectionEditorPage() {
  return (
    <>
      <Head>
        <title>Section Editor</title>
      </Head>
      <SectionEditor
        section={null}
        onContentChange={() => {}}
        onFieldChange={() => {}}
        onAddField={() => {}}
      />
    </>
  );
}
