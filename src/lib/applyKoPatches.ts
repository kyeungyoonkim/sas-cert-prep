export interface KoPatch {
  explanationKo?: string
  coachingTip?: string
}

/** Apply Korean locale patches without overwriting existing values. */
export function applyKoPatches<T extends { id: string; explanationKo?: string; coachingTip?: string }>(
  items: T[],
  patches: Record<string, KoPatch>
): T[] {
  return items.map((item) => {
    const patch = patches[item.id]
    if (!patch) return item
    return {
      ...item,
      explanationKo: item.explanationKo ?? patch.explanationKo,
      coachingTip: item.coachingTip ?? patch.coachingTip,
    }
  })
}
