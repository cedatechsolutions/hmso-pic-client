import { Link } from 'react-router-dom'
import { appRoutes } from '../routes'

type ChecklistOption = {
  available: boolean
  label: string
}

const checklistOptions: ChecklistOption[] = [
  {
    available: true,
    label: 'Property Inspection Checklist',
  },
  {
    available: false,
    label: 'Checklist 02',
  },
  {
    available: false,
    label: 'Checklist 03',
  },
]

function HomePage() {
  return (
    <main className="relative min-h-screen bg-white">
      <section className="mx-auto grid min-h-screen w-[min(720px,calc(100%_-_24px))] place-items-center py-8 sm:w-[min(720px,calc(100%_-_40px))]">
        <div className="w-full max-w-[420px] grid gap-8">
          <div className="grid gap-3 text-center px-4">
            <h1 className="text-[1.9rem] font-medium tracking-[-0.04em] text-slate-900 sm:text-[2.3rem]">
              Which form would you like to use?
            </h1>
            <p className="text-sm leading-7 text-slate-500 sm:text-base">
              Choose a checklist to continue.
            </p>
          </div>

          <div className="grid gap-3 px-4">
            <Link
              to={appRoutes.propertyChecklist}
              className="inline-flex min-h-12 items-center justify-center rounded-md border border-[#1a73e8] bg-[#1a73e8] px-5 text-sm font-medium text-white transition hover:-translate-y-px hover:shadow-[0_12px_24px_rgba(15,23,42,0.08)]"
            >
              {checklistOptions[0].label}
            </Link>
            <button
              type="button"
              disabled
              className="inline-flex min-h-12 items-center justify-center rounded-md border border-[#dde3ea] bg-[#f8fafc] px-5 text-sm font-medium text-slate-500"
            >
              {checklistOptions[1].label}
            </button>
            <button
              type="button"
              disabled
              className="inline-flex min-h-12 items-center justify-center rounded-md border border-[#dde3ea] bg-[#f8fafc] px-5 text-sm font-medium text-slate-500"
            >
              {checklistOptions[2].label}
            </button>
          </div>
        </div>
      </section>

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="site-unavailable-title"
        aria-describedby="site-unavailable-description"
        className="fixed inset-0 z-50 grid place-items-center bg-white px-6"
      >
        <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white px-8 py-12 text-center shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
            Notice
          </p>
          <h2
            id="site-unavailable-title"
            className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-slate-900 sm:text-4xl"
          >
            This site is currently unavailable
          </h2>
          <p
            id="site-unavailable-description"
            className="mt-4 text-base leading-7 text-slate-600 sm:text-lg"
          >
            Please contact the developer for assistance before trying to access this page again.
          </p>
        </div>
      </div>
    </main>
  )
}

export default HomePage
