import ExperimentDisplayComponent from "./component";

export default async function ExperimentDisplayPage({
  params,
}: {
  params: Promise<{ experimentId: string }>;
}) {
  const { experimentId } = await params;

  const list = experimentId.split(",");
  const decoded = decodeURIComponent(list[0]).replace(/=$/, "").split(",");

  return (
    <div>
      <ExperimentDisplayComponent experimentIdList={decoded} />
    </div>
  );
}
