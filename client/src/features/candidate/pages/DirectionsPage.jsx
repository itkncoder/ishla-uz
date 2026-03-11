import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import useJobOrderStore from '@stores/jobOrderStore'

const INDUSTRIES = [
  { key: 'construction', image: 'https://cdn.undraw.co/illustrations/under-construction_c2y1.svg', accent: '#E65100' },
  { key: 'hospitality', image: 'https://cdn.undraw.co/illustration/travelers_kud9.svg', accent: '#7B1FA2' },
  { key: 'healthcare', image: 'https://cdn.undraw.co/illustrations/medicine_hqqg.svg', accent: '#2E7D32' },
  { key: 'manufacturing', image: 'https://cdn.undraw.co/illustrations/factory_4d61.svg', accent: '#1565C0' },
  { key: 'logistics', image: 'https://cdn.undraw.co/illustration/logistics_8vri.svg', accent: '#00838F' },
  { key: 'agriculture', image: 'https://cdn.undraw.co/illustrations/farming_u62j.svg', accent: '#558B2F' },
  { key: 'it', image: 'https://cdn.undraw.co/illustration/vibe-coding_mjme.svg', accent: '#004AAD' },
  { key: 'retail', image: 'https://cdn.undraw.co/illustration/online-shopping_hgf6.svg', accent: '#C62828' },
]

export default function DirectionsPage() {
  const { t } = useTranslation(['candidate', 'common'])
  const navigate = useNavigate()
  const { jobOrders, fetch } = useJobOrderStore()

  useEffect(() => { fetch() }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">{t('directions.title')}</h1>
      <p className="text-gray-500 mb-6">{t('directions.subtitle')}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {INDUSTRIES.map(({ key, image, accent }) => {
          const count = jobOrders.filter(j => j.industry === key && j.status === 'active').length
          return (
            <div
              key={key}
              className="rounded-xl overflow-hidden transition-all duration-300 cursor-pointer group"
              onClick={() => navigate(`/candidate/jobs?industry=${key}`)}
            >
              <div className="h-40 overflow-hidden bg-gray-50 flex items-center justify-center p-4">
                <img
                  src={image}
                  alt={t(`common:landing.${key}`)}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="bg-white px-3 py-3 flex flex-col gap-2 border border-gray-100 border-t-0 rounded-b-xl">
                <h2 className="font-semibold text-base text-gray-900">{t(`common:landing.${key}`)}</h2>
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#004AAD]/10 text-[#004AAD]">
                    {count} {t('directions.activeJobs')}
                  </span>
                  <svg className="w-4 h-4 text-gray-300 group-hover:text-[#004AAD] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
