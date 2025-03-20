import ExperimentRatingComponent from "./component";

export default async function ExperimentRatingPage({
  params,
}: {
  params: Promise<{ experimentId: string }>;
}) {
  const { experimentId } = await params;

  return (
    <div>
      <ExperimentRatingComponent experimentId={experimentId} />
    </div>
  );
}
