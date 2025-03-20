import ExperimentDisplayComponent from "./component";

export default async function ExperimentDisplayPage({
  params,
}: {
  params: Promise<{ experimentId: string }>;
}) {
  const { experimentId } = await params;

  return (
    <div>
      <ExperimentDisplayComponent experimentId={experimentId} />
    </div>
  );
}
