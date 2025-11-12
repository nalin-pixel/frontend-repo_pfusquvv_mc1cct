import Spline from '@splinetool/react-spline'

export default function Hero() {
  return (
    <section className="relative min-h-[70vh] bg-black text-white overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/2fSS9b44gtYBt4RI/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-10 items-center">
        <div className="space-y-6">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-xs uppercase tracking-wide">Government Hospital Info</span>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            One place for hospital maps, doctors, fees and procedures
          </h1>
          <p className="text-white/80 text-lg">
            Search hospitals, view departments and doctor availability, check official fees, and see the exact documents required for any operation.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="#search" className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-3 rounded-lg">Find Hospitals</a>
            <a href="#procedures" className="bg-white/10 hover:bg-white/20 text-white px-5 py-3 rounded-lg">Procedure Guides</a>
          </div>
        </div>
        <div className="hidden md:block" />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
    </section>
  )
}
