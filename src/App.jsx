import { useEffect, useState } from 'react'
import Hero from './components/Hero'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function Section({ title, children, id }) {
  return (
    <section id={id} className="max-w-6xl mx-auto px-6 py-12">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">{title}</h2>
      <div className="bg-white rounded-xl shadow-sm border p-6">{children}</div>
    </section>
  )
}

function SearchHospitals() {
  const [q, setQ] = useState('')
  const [state, setState] = useState('')
  const [district, setDistrict] = useState('')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)

  const search = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (state) params.append('state', state)
      if (district) params.append('district', district)
      const res = await fetch(`${API_BASE}/api/hospitals?${params.toString()}`)
      const data = await res.json()
      setItems(data.items || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    search()
  }, [])

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-3 gap-3">
        <input value={state} onChange={e=>setState(e.target.value)} placeholder="State" className="border rounded-lg px-3 py-2" />
        <input value={district} onChange={e=>setDistrict(e.target.value)} placeholder="District" className="border rounded-lg px-3 py-2" />
        <button onClick={search} className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2">Search</button>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="divide-y">
          {items.map((h) => (
            <li key={h._id} className="py-3 flex items-start justify-between">
              <div>
                <p className="font-semibold">{h.name}</p>
                <p className="text-sm text-gray-600">{[h.address, h.district, h.state].filter(Boolean).join(', ')}</p>
                <p className="text-sm text-gray-600">Departments: {h.departments?.join(', ') || '—'}</p>
              </div>
              {h.phone && (
                <a href={`tel:${h.phone}`} className="text-blue-600">Call</a>
              )}
            </li>
          ))}
          {items.length === 0 && (
            <li className="py-6 text-center text-gray-500">No hospitals yet. Add some below.</li>
          )}
        </ul>
      )}
    </div>
  )
}

function ProcedureDocs() {
  const [q, setQ] = useState('')
  const [items, setItems] = useState([])
  const [docs, setDocs] = useState([])
  const [active, setActive] = useState(null)

  const search = async () => {
    const res = await fetch(`${API_BASE}/api/procedures?q=${encodeURIComponent(q)}`)
    const data = await res.json()
    setItems(data.items || [])
  }

  const open = async (slug) => {
    setActive(slug)
    const res = await fetch(`${API_BASE}/api/procedures/${slug}/documents`)
    const data = await res.json()
    setDocs(data.items || [])
  }

  useEffect(() => { search() }, [])

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search procedures e.g., cataract" className="border rounded-lg px-3 py-2 flex-1" />
        <button onClick={search} className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2">Search</button>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="border rounded-lg p-3">
          <h4 className="font-semibold mb-2">Procedures</h4>
          <ul className="space-y-2 max-h-64 overflow-auto">
            {items.map(p => (
              <li key={p._id} className={`p-2 rounded cursor-pointer ${active===p.slug?'bg-blue-50':''}`} onClick={()=>open(p.slug)}>
                <p className="font-medium">{p.name}</p>
                {p.slug && <p className="text-xs text-gray-500">{p.slug}</p>}
              </li>
            ))}
            {items.length===0 && <li className="text-gray-500">No procedures yet.</li>}
          </ul>
        </div>
        <div className="border rounded-lg p-3">
          <h4 className="font-semibold mb-2">Documents required</h4>
          <ul className="space-y-2">
            {docs.map(d => (
              <li key={d._id} className="p-2 rounded bg-gray-50">
                <p className="font-medium">{d.title} {d.mandatory ? <span className="text-red-600 text-xs">(Mandatory)</span> : null}</p>
                {d.description && <p className="text-sm text-gray-600">{d.description}</p>}
              </li>
            ))}
            {active && docs.length===0 && <li className="text-gray-500">No documents added for this procedure.</li>}
          </ul>
        </div>
      </div>
    </div>
  )
}

function QuickAddDemo() {
  const [saving, setSaving] = useState(false)

  const seedData = async () => {
    setSaving(true)
    try {
      // Create demo hospital
      await fetch(`${API_BASE}/api/hospitals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'District Hospital Demo',
          level: 'district',
          state: 'Punjab',
          district: 'Ludhiana',
          address: 'Main Road, Model Town',
          phone: '+91-12345-67890',
          departments: ['Surgery','Gynecology','Cardiology']
        })
      })

      // Create a procedure + docs
      await fetch(`${API_BASE}/api/procedures`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Cataract Surgery', slug: 'cataract', steps: ['Admission','Anesthesia','Lens replacement','Recovery'] })
      })

      const docs = [
        { title: 'Govt Photo ID (Aadhaar/PAN/Passport)', mandatory: true },
        { title: 'Recent Eye Examination Report', mandatory: true },
        { title: 'Consent Form signed by patient/guardian', mandatory: true },
        { title: 'ABHA number (if available)', mandatory: false }
      ]
      for (const d of docs) {
        await fetch(`${API_BASE}/api/procedures/cataract/documents`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(d)
        })
      }
      alert('Demo data added. Use the sections above to view it.')
    } catch (e) {
      console.error(e)
      alert('Failed to add demo data')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex items-center justify-between">
      <p className="text-gray-600">Quickly add demo data to explore the app.</p>
      <button onClick={seedData} disabled={saving} className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white rounded-lg px-4 py-2">{saving? 'Seeding...' : 'Add Demo Data'}</button>
    </div>
  )
}

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Hero />
      <Section id="search" title="Find Hospitals">
        <SearchHospitals />
      </Section>
      <Section id="procedures" title="Procedure Guides & Documents">
        <ProcedureDocs />
      </Section>
      <Section id="demo" title="Try it out">
        <QuickAddDemo />
      </Section>
      <footer className="text-center text-sm text-gray-500 py-10">Public health information demo. Data shown here is sample only.</footer>
    </div>
  )
}

export default App
