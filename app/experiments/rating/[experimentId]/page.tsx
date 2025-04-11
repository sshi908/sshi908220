import ExperimentRatingComponent from "./component";

export default async function ExperimentRatingPage({
  params,
}: {
  params: Promise<{ experimentId: string }>;
}) {
  const { experimentId } = await params;

  const list = experimentId.split(",");
  const decoded = decodeURIComponent(list[0]).replace(/=$/, "").split(",");

  return (
    <div>
      <ExperimentRatingComponent experimentIdList={decoded} />
    </div>
  );
}
