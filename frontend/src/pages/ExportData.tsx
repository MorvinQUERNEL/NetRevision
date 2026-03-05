import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { FileText, BarChart3, Download, Shield } from 'lucide-react'
import { useProgressStore } from '../stores/progressStore'
import { useAuthStore } from '../stores/authStore'
import { useChapters, useTranslation } from '../hooks/useTranslation'
import { exportProgressToCSV, exportAnalyticsToCSV } from '../utils/csvExport'

export default function ExportData() {
  const { t } = useTranslation()
  const allChapters = useChapters()
  const user = useAuthStore((s) => s.user)
  const records = useProgressStore((s) => s.records)

  function getProgramme(id: number): string {
    if (id <= 8) return t('P1 - Fondamentaux', 'P1 - Fundamentals')
    if (id <= 16) return t('P2 - Avance', 'P2 - Advanced')
    if (id <= 24) return t('P3 - Entreprise', 'P3 - Enterprise')
    return t('P4 - Expert', 'P4 - Expert')
  }

  const previewRows = useMemo(() => {
    return allChapters.slice(0, 5).map((ch) => {
      const r = records.find((rec) => rec.chapterSlug === ch.slug)
      return {
        title: ch.title,
        programme: getProgramme(ch.id),
        cours: r?.courseCompleted ? t('Oui', 'Yes') : t('Non', 'No'),
        quiz: r?.quizScore !== null && r?.quizScore !== undefined ? `${r.quizScore}%` : '-',
      }
    })
  }, [records])

  const remainingCount = allChapters.length - 5

  return (
    <div style={{ paddingTop: 56 }}>
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '48px 24px 80px',
        }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ marginBottom: 40 }}
        >
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              color: 'var(--accent)',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              marginBottom: 12,
            }}
          >
            // export
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 32,
              fontWeight: 700,
              letterSpacing: '-1px',
              marginBottom: 10,
            }}
          >
            {t('Exporter mes donnees', 'Export my data')}
          </h1>
          <p
            style={{
              fontSize: 15,
              color: 'var(--text-secondary)',
              fontWeight: 300,
              maxWidth: 600,
              lineHeight: 1.6,
            }}
          >
            {t('Telecharge tes donnees de progression et tes statistiques au format CSV. Compatible avec Excel, Google Sheets et tout tableur.', 'Download your progress data and statistics in CSV format. Compatible with Excel, Google Sheets and any spreadsheet.')}
          </p>
        </motion.div>

        {/* Export cards grid */}
        <div
          className="export-cards-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 2,
            marginBottom: 40,
          }}
        >
          {/* Card 1 — Progression Detaillee */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              padding: 32,
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                background: 'rgba(0, 229, 160, 0.1)',
                border: '1px solid rgba(0, 229, 160, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FileText size={24} color="#00e5a0" />
            </div>

            <div>
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 20,
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  marginBottom: 8,
                }}
              >
                {t('Progression Detaillee', 'Detailed Progress')}
              </h2>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 14,
                  color: 'var(--text-secondary)',
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {t('Export complet de ta progression par chapitre : cours completes, scores quiz, scores examens et flashcards.', 'Complete export of your progress by chapter: completed courses, quiz scores, exam scores and flashcards.')}
              </p>
            </div>

            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
              }}
            >
              CSV compatible Excel/Google Sheets
            </div>

            <button
              onClick={() => exportProgressToCSV(records, allChapters)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                padding: '14px 24px',
                background: '#00e5a0',
                color: '#080b1a',
                border: 'none',
                fontFamily: 'var(--font-body)',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background 0.2s ease',
                borderRadius: 0,
                marginTop: 'auto',
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.background = '#00ffb3'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.background = '#00e5a0'
              }}
            >
              <Download size={18} />
              {t('Telecharger CSV', 'Download CSV')}
            </button>
          </motion.div>

          {/* Card 2 — Analytics Complet */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              padding: 32,
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                background: 'rgba(99, 102, 241, 0.1)',
                border: '1px solid rgba(99, 102, 241, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <BarChart3 size={24} color="#6366f1" />
            </div>

            <div>
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 20,
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  marginBottom: 8,
                }}
              >
                {t('Analytics Complet', 'Full Analytics')}
              </h2>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 14,
                  color: 'var(--text-secondary)',
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {t('Resume de tes statistiques : profil, points, streak, moyennes et detail par chapitre.', 'Summary of your statistics: profile, points, streak, averages and detail by chapter.')}
              </p>
            </div>

            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
              }}
            >
              CSV compatible Excel/Google Sheets
            </div>

            <button
              onClick={() => {
                if (!user) return
                exportAnalyticsToCSV(records, allChapters, {
                  firstName: user.firstName,
                  lastName: user.lastName,
                  email: user.email,
                  totalPoints: user.totalPoints,
                  loginStreak: user.loginStreak,
                })
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                padding: '14px 24px',
                background: '#6366f1',
                color: '#ffffff',
                border: 'none',
                fontFamily: 'var(--font-body)',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background 0.2s ease',
                borderRadius: 0,
                marginTop: 'auto',
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.background = '#818cf8'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.background = '#6366f1'
              }}
            >
              <Download size={18} />
              {t('Telecharger CSV', 'Download CSV')}
            </button>
          </motion.div>
        </div>

        {/* Privacy note */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            padding: '24px 28px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 16,
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              background: 'rgba(0, 229, 160, 0.08)',
              border: '1px solid rgba(0, 229, 160, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Shield size={20} color="var(--accent)" />
          </div>
          <div>
            <h3
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 16,
                fontWeight: 700,
                color: 'var(--text-primary)',
                marginBottom: 6,
              }}
            >
              {t('Confidentialite', 'Privacy')}
            </h3>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 14,
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              {t("L'export est realise entierement cote client. Aucune donnee n'est envoyee a un serveur externe.", 'The export is performed entirely client-side. No data is sent to an external server.')}
            </p>
          </div>
        </motion.div>

        {/* Preview section */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              color: 'var(--accent)',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              marginBottom: 12,
            }}
          >
            {t('// apercu des donnees', '// data preview')}
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 22,
              fontWeight: 700,
              color: 'var(--text-primary)',
              marginBottom: 20,
            }}
          >
            {t("Apercu de l'export", 'Export preview')}
          </h2>

          <div
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              overflow: 'hidden',
            }}
          >
            <div style={{ overflowX: 'auto' }}>
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 13,
                }}
              >
                <thead>
                  <tr>
                    <th
                      style={{
                        textAlign: 'left',
                        padding: '14px 16px',
                        borderBottom: '1px solid var(--border)',
                        color: 'var(--accent)',
                        fontWeight: 600,
                        fontSize: 11,
                        textTransform: 'uppercase',
                        letterSpacing: '1.5px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {t('Chapitre', 'Chapter')}
                    </th>
                    <th
                      style={{
                        textAlign: 'left',
                        padding: '14px 16px',
                        borderBottom: '1px solid var(--border)',
                        color: 'var(--accent)',
                        fontWeight: 600,
                        fontSize: 11,
                        textTransform: 'uppercase',
                        letterSpacing: '1.5px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {t('Programme', 'Program')}
                    </th>
                    <th
                      style={{
                        textAlign: 'center',
                        padding: '14px 16px',
                        borderBottom: '1px solid var(--border)',
                        color: 'var(--accent)',
                        fontWeight: 600,
                        fontSize: 11,
                        textTransform: 'uppercase',
                        letterSpacing: '1.5px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {t('Cours', 'Course')}
                    </th>
                    <th
                      style={{
                        textAlign: 'center',
                        padding: '14px 16px',
                        borderBottom: '1px solid var(--border)',
                        color: 'var(--accent)',
                        fontWeight: 600,
                        fontSize: 11,
                        textTransform: 'uppercase',
                        letterSpacing: '1.5px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Score Quiz
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {previewRows.map((row, index) => (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.45 + index * 0.05 }}
                      style={{
                        borderBottom:
                          index < previewRows.length - 1
                            ? '1px solid var(--border)'
                            : 'none',
                      }}
                    >
                      <td
                        style={{
                          padding: '12px 16px',
                          color: 'var(--text-primary)',
                          fontFamily: 'var(--font-body)',
                          fontSize: 13,
                          fontWeight: 500,
                        }}
                      >
                        {row.title}
                      </td>
                      <td
                        style={{
                          padding: '12px 16px',
                          color: 'var(--text-secondary)',
                          fontSize: 12,
                        }}
                      >
                        {row.programme}
                      </td>
                      <td
                        style={{
                          padding: '12px 16px',
                          textAlign: 'center',
                          color:
                            row.cours === 'Oui'
                              ? '#00e5a0'
                              : 'var(--text-muted)',
                          fontWeight: 600,
                          fontSize: 12,
                        }}
                      >
                        {row.cours}
                      </td>
                      <td
                        style={{
                          padding: '12px 16px',
                          textAlign: 'center',
                          color:
                            row.quiz !== '-'
                              ? 'var(--text-primary)'
                              : 'var(--text-muted)',
                          fontWeight: 600,
                          fontSize: 12,
                        }}
                      >
                        {row.quiz}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Remaining chapters note */}
            <div
              style={{
                padding: '14px 16px',
                borderTop: '1px solid var(--border)',
                fontFamily: 'var(--font-mono)',
                fontSize: 12,
                color: 'var(--text-muted)',
                textAlign: 'center',
              }}
            >
              ...{t('et', 'and')} {remainingCount} {t('autres chapitres', 'more chapters')}
            </div>
          </div>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .export-cards-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
