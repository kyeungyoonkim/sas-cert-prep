import type { KoPatch } from '../../lib/applyKoPatches'
import { KO_PATCHES_BASE } from './ko-patches-base'
import { KO_PATCHES_CLINICAL } from './ko-patches-clinical'
import { KO_PATCHES_ADVANCED } from './ko-patches-advanced'

export const KO_PATCHES: Record<string, KoPatch> = {
  ...KO_PATCHES_BASE,
  ...KO_PATCHES_CLINICAL,
  ...KO_PATCHES_ADVANCED,
}
