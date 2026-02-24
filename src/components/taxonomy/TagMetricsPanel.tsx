import { Card } from "../ui/Card";

interface MetricData {
    label: string;
    value: string;
    subValue?: string;
}

export function TagMetricsPanel(props: { metrics: MetricData[] }) {
    return (
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {props.metrics.map((metric) => (
                <Card class="p-5 flex flex-col justify-center">
                    <span class="text-sm font-medium text-slate-500 mb-1">{metric.label}</span>
                    <div class="flex items-baseline gap-2">
                        <span class="text-2xl font-bold text-slate-900">{metric.value}</span>
                        {metric.subValue && (
                            <span class="text-xs font-medium text-slate-400">{metric.subValue}</span>
                        )}
                    </div>
                </Card>
            ))}
        </div>
    );
}
