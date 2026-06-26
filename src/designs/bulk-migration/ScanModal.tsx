import { useEffect, useState } from 'react'
import { useComputedTheme } from '@instructure/emotion'
import { Modal } from '@instructure/ui-modal/latest'
import { View } from '@instructure/ui-view/latest'
import { Flex } from '@instructure/ui-flex/latest'
import { Heading } from '@instructure/ui-heading/latest'
import { Text } from '@instructure/ui-text/latest'
import { CloseButton } from '@instructure/ui-buttons/latest'
import { ScreenReaderContent } from '@instructure/ui-a11y-content'

// The compatibility scan that runs before the migrate sheet opens. Counts up from 1 to
// `total` over a couple of seconds, then calls onComplete. Pure presentation — the real
// thing would scan each quiz's content server-side.
export function ScanModal({
  open,
  total,
  onComplete,
  onClose,
}: {
  open: boolean
  total: number
  onComplete: () => void
  onClose: () => void
}) {
  const { sharedTokens } = useComputedTheme()
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!open) {
      setCount(0)
      return
    }
    const steps = Math.max(1, total)
    let n = 0
    const id = setInterval(() => {
      n += 1
      setCount(n)
      if (n >= steps) {
        clearInterval(id)
        setTimeout(onComplete, 450)
      }
    }, Math.min(500, 1800 / steps))
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, total])

  const size = 96
  const thickness = 6
  const r = (size - thickness) / 2
  const c = 2 * Math.PI * r
  const pct = total > 0 ? Math.min(1, count / total) : 0
  const ring = sharedTokens.background.brandColor
  const track = sharedTokens.background.mutedColor

  return (
    <Modal open={open} onDismiss={onClose} size="fullscreen" label="Scanning quizzes for compatibility">
      <Modal.Header>
        <Flex justifyItems="space-between" alignItems="center">
          <Heading level="h2" variant="titleCardLarge" margin="0">Migrate to New Quizzes</Heading>
          <CloseButton onClick={onClose} screenReaderLabel="Close" />
        </Flex>
      </Modal.Header>
      <Modal.Body>
        <Flex direction="column" gap="medium" alignItems="center" justifyItems="center" padding="x-large 0">
          <View as="div" position="relative" width={`${size}px`} height={`${size}px`}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
              <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={thickness} />
              <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={r}
                  fill="none"
                  stroke={ring}
                  strokeWidth={thickness}
                  strokeLinecap="round"
                  strokeDasharray={`${pct * c} ${c}`}
                />
              </g>
            </svg>
            <View as="div" position="absolute" insetBlockStart="0" insetInlineStart="0" width="100%" height="100%">
              <Flex direction="column" height="100%" alignItems="center" justifyItems="center">
                <Text size="large" weight="bold" lineHeight="fit">{Math.max(1, count)}</Text>
                <Text size="legend" color="secondary" lineHeight="fit">/{total}</Text>
              </Flex>
            </View>
            <ScreenReaderContent>Scanning {count} of {total}</ScreenReaderContent>
          </View>
          <Heading level="h3" variant="titleCardRegular" margin="0">
            <Flex direction="column" alignItems="center" gap="0">
              <span>Scanning your quizzes</span>
              <span>for compatibility</span>
            </Flex>
          </Heading>
        </Flex>
      </Modal.Body>
    </Modal>
  )
}
