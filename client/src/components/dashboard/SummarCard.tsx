export default function SummaryCard({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-2xl font-bold">${value?.toFixed(2)}</p>
    </div>
  );
}
``;
