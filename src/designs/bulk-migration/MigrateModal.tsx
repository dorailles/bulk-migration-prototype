import { useMemo, useState } from 'react'
import { useComputedTheme } from '@instructure/emotion'
import { Modal } from '@instructure/ui-modal/latest'
import { View } from '@instructure/ui-view/latest'
import { Flex } from '@instructure/ui-flex/latest'
import { Heading } from '@instructure/ui-heading/latest'
import { Text } from '@instructure/ui-text/latest'
import { Button, CloseButton } from '@instructure/ui-buttons/latest'
import { Checkbox } from '@instructure/ui-checkbox/latest'
import { ScreenReaderContent } from '@instructure/ui-a11y-content'
import { courseQuizzes, teacherName } from './migrationModel'
import type { Course, Quiz } from './migrationModel'

// A quiz plus the course/educator it belongs to — needed in the bulk sheet where quizzes
// from several courses are interleaved.
type ScopedQuiz = Quiz & { courseName: string; educator: string }

// The migrate sheet: quizzes from the selected course(s), grouped by how cleanly they
// migrate, with two preference toggles. Quizzes are checked by default; unchecking is
// presentational in this prototype.

type GroupKey = 'supported' | 'submissions' | 'review'

const GROUP_META: Record<GroupKey, { title: string; note?: string }> = {
  supported: { title: 'Fully supported' },
  submissions: {
    title: 'With submissions',
    note: "For these quizzes we'll keep a copy of the original quiz. Existing submission data will be available through this original quiz.",
  },
  review: {
    title: 'Review needed',
    note: 'These quizzes contain rich content. You can review the migrated quizzes to ensure all content has been converted successfully.',
  },
}

function groupOf(q: Quiz): GroupKey {
  if (q.issues.includes('submissions')) return 'submissions'
  if (q.issues.length > 0) return 'review' // item banks or unsupported types
  return 'supported'
}

export function MigrateModal({
  open,
  courses,
  onCancel,
  onMigrate,
}: {
  open: boolean
  courses: Course[]
  onCancel: () => void
  onMigrate: () => void
}) {
  const { sharedTokens } = useComputedTheme()
  const [keepOriginal, setKeepOriginal] = useState(false)
  const [publishClean, setPublishClean] = useState(false)
  const [unchecked, setUnchecked] = useState<Set<string>>(new Set())

  const groups = useMemo(() => {
    const all: ScopedQuiz[] = courses.flatMap((c) =>
      courseQuizzes(c).map((q) => ({ ...q, courseName: c.name, educator: teacherName(c.teacherId) })),
    )
    return {
      supported: all.filter((q) => groupOf(q) === 'supported'),
      submissions: all.filter((q) => groupOf(q) === 'submissions'),
      review: all.filter((q) => groupOf(q) === 'review'),
    }
  }, [courses])

  const toggle = (id: string) =>
    setUnchecked((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const sectionBg = {
    background: 'secondary' as const,
    themeOverride: { backgroundSecondary: sharedTokens.background.pageColor },
    borderRadius: sharedTokens.borderRadius.card.md,
  }

  // The migration preferences live inside "Fully supported" — they only affect those
  // quizzes (the others always keep their original and get a copy).
  const preferences = (
    <View as="div" display="block" padding="small" margin="0 0 small 0" {...sectionBg}>
      <Flex direction="column" gap="x-small">
        <Checkbox
          variant="toggle"
          size="small"
          label="Keep a copy of the original Classic Quiz"
          checked={keepOriginal}
          onChange={(e) => setKeepOriginal(e.target.checked)}
        />
        <Checkbox
          variant="toggle"
          size="small"
          label="Publish all Quizzes that don't require a review"
          checked={publishClean}
          onChange={(e) => setPublishClean(e.target.checked)}
        />
      </Flex>
    </View>
  )

  // Groups are always shown, even when empty, so the three categories are always visible.
  // Plain (non-collapsible) sections — no chevron.
  const renderGroup = (key: GroupKey, quizzes: ScopedQuiz[]) => {
    const meta = GROUP_META[key]
    return (
      <View as="div" display="block" key={key}>
        <Text weight="bold">{meta.title} ({quizzes.length})</Text>
        <View as="div" display="block" padding="x-small 0 small 0">
          {key === 'supported' ? preferences : null}
          {quizzes.length > 0 && meta.note ? (
            <View as="div" display="block" margin="0 0 small 0">
              <Text size="contentSmall" color="secondary">{meta.note}</Text>
            </View>
          ) : null}
          {quizzes.length === 0 ? (
            <Text size="contentSmall" color="secondary">No quizzes in this category.</Text>
          ) : (
            <Flex direction="column" gap="x-small">
              {quizzes.map((q) => (
                <Flex key={q.id} gap="small" alignItems="center">
                  <Flex.Item size="1.5rem" shouldShrink={false}>
                    <Checkbox
                      label={<ScreenReaderContent>Select {q.name}</ScreenReaderContent>}
                      checked={!unchecked.has(q.id)}
                      onChange={() => toggle(q.id)}
                    />
                  </Flex.Item>
                  <Flex.Item shouldGrow shouldShrink>
                    <Text weight="bold" as="div">{q.name}</Text>
                    <Text size="contentSmall" color="secondary" as="div" lineHeight="condensed">
                      {q.courseName} · {q.educator} · {q.questionCount} Questions
                    </Text>
                  </Flex.Item>
                </Flex>
              ))}
            </Flex>
          )}
        </View>
      </View>
    )
  }

  return (
    <Modal open={open} onDismiss={onCancel} size="fullscreen" label="Migrate to New Quizzes">
      <Modal.Header>
        <Flex justifyItems="space-between" alignItems="center">
          <Heading level="h2" variant="titleCardLarge" margin="0">Migrate to New Quizzes</Heading>
          <CloseButton onClick={onCancel} screenReaderLabel="Close" />
        </Flex>
      </Modal.Header>
      <Modal.Body>
        <Flex direction="column" gap="medium" alignItems="stretch">
          {renderGroup('supported', groups.supported)}
          <View as="div" display="block" borderWidth="small 0 0 0" borderColor="secondary" />
          {renderGroup('submissions', groups.submissions)}
          <View as="div" display="block" borderWidth="small 0 0 0" borderColor="secondary" />
          {renderGroup('review', groups.review)}
        </Flex>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onCancel} margin="0 x-small 0 0">Cancel</Button>
        <Button color="primary" onClick={onMigrate}>Migrate selected</Button>
      </Modal.Footer>
    </Modal>
  )
}
