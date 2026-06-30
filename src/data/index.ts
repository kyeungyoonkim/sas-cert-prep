import type { CertId, CertData } from './types'
import { BASE_CERT } from './base'
import { CLINICAL_CERT } from './clinical'
import { ADVANCED_CERT } from './advanced'

export * from './types'
export * from './bank'
export * from './collections'
export * from './studyPath'
export * from './syllabus'
export { BASE_CERT, CLINICAL_CERT, ADVANCED_CERT }

export const CERTIFICATIONS: Record<CertId, CertData> = {
  base: BASE_CERT,
  clinical: CLINICAL_CERT,
  advanced: ADVANCED_CERT,
}

export const CERT_ORDER: CertId[] = ['base', 'clinical', 'advanced']

export function getCert(id: CertId): CertData {
  return CERTIFICATIONS[id]
}

export const SELECTED_CERT_KEY = 'sas-cert-selected'

export function loadSelectedCert(): CertId {
  try {
    const stored = localStorage.getItem(SELECTED_CERT_KEY)
    if (stored && stored in CERTIFICATIONS) return stored as CertId
  } catch {
    /* ignore */
  }
  return 'base'
}

export function saveSelectedCert(id: CertId): void {
  localStorage.setItem(SELECTED_CERT_KEY, id)
}
