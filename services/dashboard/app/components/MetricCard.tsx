interface MetricCardProps {
  metricName: string;
  value: number;
}

export default function MetricCard({ metricName, value }: MetricCardProps) {
  return (
    <div className="flex-1 group flex flex-col justify-between rounded-sm bg-white p-4 shadow-xl transition-shadow sm:p-6 lg:p-8">
      <div className="mb-5">
        <h3 className="font-medium text-gray-900">{metricName}</h3>
        <div className="border-t-2 border-gray-100 pt-1">
          <p className="mt-1 text-sm text-gray-700">Production</p>
        </div>
      </div>
      <div>
        <p className="text-4xl font-extrabold text-blue-600 md:text-5xl">{ value }</p>
        {/* <Line data={viewableData} options={options}></Line> */}
      </div>
    </div>
  );
}
