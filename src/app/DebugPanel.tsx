import type { Tanka } from '../tanka/types';

interface Props {
  tanka: Tanka;
}

const TARGETS = [5, 7, 5, 7, 7] as const;

export function DebugPanel({ tanka }: Props) {
  const moraInfo = tanka.lines
    .map((line, i) => {
      const target = TARGETS[i];
      const diff = line.mora - target;
      const ok = diff === 0;
      const label = ok ? '✓' : diff > 0 ? `+${diff}` : `${diff}`;
      return { idx: i + 1, target, actual: line.mora, label, ok };
    });

  const moraStr = moraInfo
    .map((m) => `L${m.idx} ${m.target}/${m.actual} ${m.label}`)
    .join('  ');

  const tags = tanka.selectedTags.length > 0 ? tanka.selectedTags.join(', ') : '(none)';
  const fallback = tanka.fallbackReason ?? '(none)';

  return (
    <div class="debug-panel">
      template: {tanka.templateId}
      {'\n'}mora:     {moraStr}
      {'\n'}tags:     {tags}
      {'\n'}fallback: {fallback}
    </div>
  );
}
