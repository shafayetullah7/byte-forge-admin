export function TagBadge(props: { text: string; count?: number }) {
    return (
        <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200">
            <span class="text-xs font-medium text-slate-700">{props.text}</span>
            {props.count !== undefined && (
                <span class="bg-slate-200 text-slate-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                    {props.count}
                </span>
            )}
        </div>
    );
}
