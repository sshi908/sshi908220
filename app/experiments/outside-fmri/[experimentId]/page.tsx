import ExperimentComponent from "./component";

export default async function ExperimentPage({
  params,
}: {
  params: Promise<{ experimentId: string }>;
}) {
  const { experimentId } = await params;

  return (
    <div>
      <ExperimentComponent experimentId={experimentId} />
    </div>
  );
}
