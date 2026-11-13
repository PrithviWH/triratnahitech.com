import { GemMarker } from './GemMotif';

export interface TimelineCell {
  kicker: string;
  headline: string;
  body: string;
}

export function TimelineStrip({ cells }: { cells: TimelineCell[] }) {
  return (
    <div className="rounded-2xl overflow-hidden border border-zinc-200 bg-white card-elevated grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-zinc-200">
      {cells.map((cell, idx) => (
        <div key={cell.headline + idx} className="p-7 sm:p-8 flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between">
            <span className="font-display text-xs font-semibold uppercase tracking-[0.12em] text-[#0F4C5C]">
              {cell.kicker}
            </span>
            <GemMarker size={8} color={idx === 1 ? '#0F4C5C' : '#C84B13'} />
          </div>
          <h3 className="font-display font-bold text-2xl sm:text-3xl tracking-tight text-[#09090B]">
            {cell.headline}
          </h3>
          <p className="font-body text-sm sm:text-base leading-relaxed text-zinc-600">
            {cell.body}
          </p>
        </div>
      ))}
    </div>
  );
}
