import { View } from '@instructure/ui-view/latest'
import { Flex } from '@instructure/ui-flex/latest'
import { Text } from '@instructure/ui-text/latest'

// A lightweight donut chart built from an SVG (the sandbox ships no charting library).
// Segments are drawn as stroked arcs around a single circle; a legend lists each segment
// with its count and share. Colors are passed in as hex (InstUI dataVisualization palette).

export type DonutSegment = { key: string; label: string; count: number; color: string }

export function DonutChart({
  segments,
  size = 144,
  thickness = 22,
  centerLabel,
  centerSub,
}: {
  segments: DonutSegment[]
  size?: number
  thickness?: number
  centerLabel?: string
  centerSub?: string
}) {
  const total = segments.reduce((s, x) => s + x.count, 0)
  const r = (size - thickness) / 2
  const c = 2 * Math.PI * r
  const cx = size / 2

  // Accumulate each segment's arc as a dash, offset by everything before it.
  let acc = 0
  const arcs = segments.map((seg) => {
    const frac = total > 0 ? seg.count / total : 0
    const dash = frac * c
    const node = {
      key: seg.key,
      color: seg.color,
      dasharray: `${dash} ${c - dash}`,
      // Negative offset advances the start point clockwise from 12 o'clock.
      dashoffset: -acc * c,
    }
    acc += frac
    return node
  })

  return (
    <Flex gap="large" alignItems="center" wrap="wrap">
      <Flex.Item shouldShrink={false}>
        <View as="div" display="block" position="relative" width={`${size}px`} height={`${size}px`}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`${centerLabel ?? total} total`}>
            <g transform={`rotate(-90 ${cx} ${cx})`}>
              {arcs.map((a) => (
                <circle
                  key={a.key}
                  cx={cx}
                  cy={cx}
                  r={r}
                  fill="none"
                  stroke={a.color}
                  strokeWidth={thickness}
                  strokeDasharray={a.dasharray}
                  strokeDashoffset={a.dashoffset}
                />
              ))}
            </g>
          </svg>
          {centerLabel ? (
            <View as="div" position="absolute" insetBlockStart="0" insetInlineStart="0" width="100%" height="100%">
              <Flex direction="column" height="100%" alignItems="center" justifyItems="center">
                <Text size="x-large" weight="bold" lineHeight="fit">{centerLabel}</Text>
                {centerSub ? <Text size="legend" color="secondary" lineHeight="fit">{centerSub}</Text> : null}
              </Flex>
            </View>
          ) : null}
        </View>
      </Flex.Item>

      <Flex.Item shouldGrow shouldShrink>
        <Flex direction="column" gap="x-small">
          {segments.map((seg) => {
            const pct = total > 0 ? Math.round((seg.count / total) * 100) : 0
            return (
              <Flex key={seg.key} justifyItems="space-between" alignItems="center" gap="medium">
                <Flex gap="x-small" alignItems="center">
                  <View
                    as="span"
                    display="inline-block"
                    width="0.75rem"
                    height="0.75rem"
                    borderRadius="circle"
                    background="primary"
                    themeOverride={{ backgroundPrimary: seg.color }}
                  />
                  <Text size="contentSmall">{seg.label}</Text>
                </Flex>
                <Text size="contentSmall" color="secondary">{seg.count} ({pct}%)</Text>
              </Flex>
            )
          })}
        </Flex>
      </Flex.Item>
    </Flex>
  )
}
