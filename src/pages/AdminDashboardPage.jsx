import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../contexts/authStore'
import {
  createAdminAirplane,
  createAdminAirport,
  createAdminCity,
  createAdminFlight,
  deleteAdminAirplane,
  deleteAdminAirport,
  deleteAdminCity,
  deleteAdminFlight,
  fetchAdminAirplanes,
  fetchAdminAirports,
  fetchAdminCities,
  fetchAdminFlights,
  updateAdminAirplane,
  updateAdminAirport,
  updateAdminCity,
  updateAdminFlight,
} from '../services/adminService'
import { normalizeFlights, normalizeList } from '../utils/flightData'

const TABS = [
  { id: 'city', label: 'Cities' },
  { id: 'airport', label: 'Airports' },
  { id: 'airplane', label: 'Airplanes' },
  { id: 'flight', label: 'Flights' },
]

const emptyForms = {
  city: { name: '' },
  airport: { name: '', code: '', address: '', cityId: '' },
  airplane: { modelNumber: '', capacity: '' },
  flight: {
    flightNumber: '',
    airplaneId: '',
    departureAirportId: '',
    arrivalAirportId: '',
    departureTime: '',
    arrivalTime: '',
    price: '',
    boardingGage: '',
    totalSeats: '',
  },
}

function toDateTimeLocal(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function fromDateTimeLocal(value) {
  if (!value) return value
  return new Date(value).toISOString()
}

function Field({ label, children }) {
  return (
    <label className="block text-sm text-slate-700">
      <span className="mb-2 block text-sm font-bold text-slate-800">{label}</span>
      {children}
    </label>
  )
}

const inputClass =
  'w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-500/10'

function AdminDashboardPage() {
  const navigate = useNavigate()
  const token = useAuthStore((state) => state.token)
  const user = useAuthStore((state) => state.user)
  const clearAuth = useAuthStore((state) => state.clearAuth)

  const [tab, setTab] = useState('city')
  const [cities, setCities] = useState([])
  const [airports, setAirports] = useState([])
  const [airplanes, setAirplanes] = useState([])
  const [flights, setFlights] = useState([])
  const [form, setForm] = useState(emptyForms.city)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const loadAll = useCallback(async () => {
    if (!token) return
    setLoading(true)
    setError('')
    try {
      const [cityData, airportData, airplaneData, flightData] = await Promise.all([
        fetchAdminCities(token),
        fetchAdminAirports(token),
        fetchAdminAirplanes(token),
        fetchAdminFlights(token),
      ])
      setCities(normalizeList(cityData))
      setAirports(normalizeList(airportData))
      setAirplanes(normalizeList(airplaneData))
      setFlights(normalizeFlights(flightData))
    } catch (err) {
      setError(err.message || 'Unable to load admin data')
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    loadAll()
  }, [loadAll])

  useEffect(() => {
    setForm(emptyForms[tab])
    setEditingId(null)
    setMessage('')
    setError('')
  }, [tab])

  const rows = useMemo(() => {
    if (tab === 'city') return cities
    if (tab === 'airport') return airports
    if (tab === 'airplane') return airplanes
    return flights
  }, [tab, cities, airports, airplanes, flights])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const resetForm = () => {
    setForm(emptyForms[tab])
    setEditingId(null)
  }

  const startEdit = (row) => {
    setEditingId(row.id)
    setMessage('')
    setError('')

    if (tab === 'city') {
      setForm({ name: row.name || '' })
      return
    }
    if (tab === 'airport') {
      setForm({
        name: row.name || '',
        code: row.code || '',
        address: row.address || '',
        cityId: row.cityId != null ? String(row.cityId) : '',
      })
      return
    }
    if (tab === 'airplane') {
      setForm({
        modelNumber: row.modelNumber || '',
        capacity: row.capacity != null ? String(row.capacity) : '',
      })
      return
    }
    setForm({
      flightNumber: row.flightNumber || '',
      airplaneId: row.airplaneId != null ? String(row.airplaneId) : '',
      departureAirportId: row.departureAirportId || '',
      arrivalAirportId: row.arrivalAirportId || '',
      departureTime: toDateTimeLocal(row.departureTime),
      arrivalTime: toDateTimeLocal(row.arrivalTime),
      price: row.price != null ? String(row.price) : '',
      boardingGage: row.boardingGage || '',
      totalSeats: row.totalSeats != null ? String(row.totalSeats) : '',
    })
  }

  const buildPayload = () => {
    if (tab === 'city') {
      return { name: form.name.trim() }
    }
    if (tab === 'airport') {
      return {
        name: form.name.trim(),
        code: form.code.trim().toUpperCase(),
        address: form.address.trim(),
        cityId: Number(form.cityId),
      }
    }
    if (tab === 'airplane') {
      return {
        modelNumber: form.modelNumber.trim(),
        capacity: Number(form.capacity),
      }
    }
    return {
      flightNumber: form.flightNumber.trim(),
      airplaneId: Number(form.airplaneId),
      departureAirportId: form.departureAirportId.trim().toUpperCase(),
      arrivalAirportId: form.arrivalAirportId.trim().toUpperCase(),
      departureTime: fromDateTimeLocal(form.departureTime),
      arrivalTime: fromDateTimeLocal(form.arrivalTime),
      price: Number(form.price),
      boardingGage: form.boardingGage.trim(),
      totalSeats: Number(form.totalSeats),
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    setMessage('')

    try {
      const payload = buildPayload()
      if (editingId == null) {
        if (tab === 'city') await createAdminCity(token, payload)
        else if (tab === 'airport') await createAdminAirport(token, payload)
        else if (tab === 'airplane') await createAdminAirplane(token, payload)
        else await createAdminFlight(token, payload)
        setMessage('Created successfully')
      } else {
        if (tab === 'city') await updateAdminCity(token, editingId, payload)
        else if (tab === 'airport') await updateAdminAirport(token, editingId, payload)
        else if (tab === 'airplane') await updateAdminAirplane(token, editingId, payload)
        else await updateAdminFlight(token, editingId, payload)
        setMessage('Updated successfully')
      }
      resetForm()
      await loadAll()
    } catch (err) {
      setError(err.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this record?')) return
    setError('')
    setMessage('')
    try {
      if (tab === 'city') await deleteAdminCity(token, id)
      else if (tab === 'airport') await deleteAdminAirport(token, id)
      else if (tab === 'airplane') await deleteAdminAirplane(token, id)
      else await deleteAdminFlight(token, id)
      if (editingId === id) resetForm()
      setMessage('Deleted successfully')
      await loadAll()
    } catch (err) {
      setError(err.message || 'Delete failed')
    }
  }

  const handleLogout = () => {
    clearAuth()
    navigate('/admin/signin')
  }

  const cityNameById = useMemo(() => {
    const map = new Map()
    cities.forEach((city) => map.set(String(city.id), city.name))
    return map
  }, [cities])

  return (
    <div className="app-shell relative">
      <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-lg text-white">
            FS
          </span>
          <div>
            <p className="text-lg font-black tracking-tight text-slate-950">FlySmart Admin</p>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              {user?.email || 'Administrator'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/" className="hidden text-sm font-semibold text-slate-600 transition hover:text-slate-950 sm:inline">
            Traveler site
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:border-slate-300"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="relative mx-auto flex w-full max-w-7xl flex-col gap-6 px-5 pb-12 sm:px-8 lg:px-10">
        <section className="glass-panel rounded-[2rem] p-6 sm:p-8">
          <p className="eyebrow">Operations</p>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Flight data CRUD</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            All writes go through `/admin/flightservice` and require an admin JWT.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {TABS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                  tab === item.id
                    ? 'bg-slate-950 text-white'
                    : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <section className="soft-card rounded-[2rem] p-6 sm:p-7">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-black text-slate-950">
                {editingId == null ? `Create ${tab}` : `Edit ${tab} #${editingId}`}
              </h2>
              {editingId != null ? (
                <button type="button" onClick={resetForm} className="text-sm font-bold text-sky-700">
                  Cancel edit
                </button>
              ) : null}
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {tab === 'city' ? (
                <Field label="City name">
                  <input className={inputClass} name="name" value={form.name} onChange={handleChange} required />
                </Field>
              ) : null}

              {tab === 'airport' ? (
                <>
                  <Field label="Airport name">
                    <input className={inputClass} name="name" value={form.name} onChange={handleChange} required />
                  </Field>
                  <Field label="Code">
                    <input className={inputClass} name="code" value={form.code} onChange={handleChange} required />
                  </Field>
                  <Field label="Address">
                    <input className={inputClass} name="address" value={form.address} onChange={handleChange} />
                  </Field>
                  <Field label="City">
                    <select className={inputClass} name="cityId" value={form.cityId} onChange={handleChange} required>
                      <option value="">Select city</option>
                      {cities.map((city) => (
                        <option key={city.id} value={city.id}>
                          {city.name} (#{city.id})
                        </option>
                      ))}
                    </select>
                  </Field>
                </>
              ) : null}

              {tab === 'airplane' ? (
                <>
                  <Field label="Model number">
                    <input
                      className={inputClass}
                      name="modelNumber"
                      value={form.modelNumber}
                      onChange={handleChange}
                      required
                    />
                  </Field>
                  <Field label="Capacity">
                    <input
                      className={inputClass}
                      type="number"
                      min="1"
                      name="capacity"
                      value={form.capacity}
                      onChange={handleChange}
                      required
                    />
                  </Field>
                </>
              ) : null}

              {tab === 'flight' ? (
                <>
                  <Field label="Flight number">
                    <input
                      className={inputClass}
                      name="flightNumber"
                      value={form.flightNumber}
                      onChange={handleChange}
                      required
                    />
                  </Field>
                  <Field label="Airplane">
                    <select
                      className={inputClass}
                      name="airplaneId"
                      value={form.airplaneId}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select airplane</option>
                      {airplanes.map((plane) => (
                        <option key={plane.id} value={plane.id}>
                          {plane.modelNumber} (#{plane.id}, {plane.capacity} seats)
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Departure airport code">
                    <select
                      className={inputClass}
                      name="departureAirportId"
                      value={form.departureAirportId}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select departure</option>
                      {airports.map((airport) => (
                        <option key={airport.id} value={airport.code}>
                          {airport.code} — {airport.name}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Arrival airport code">
                    <select
                      className={inputClass}
                      name="arrivalAirportId"
                      value={form.arrivalAirportId}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select arrival</option>
                      {airports.map((airport) => (
                        <option key={airport.id} value={airport.code}>
                          {airport.code} — {airport.name}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Departure time">
                    <input
                      className={inputClass}
                      type="datetime-local"
                      name="departureTime"
                      value={form.departureTime}
                      onChange={handleChange}
                      required
                    />
                  </Field>
                  <Field label="Arrival time">
                    <input
                      className={inputClass}
                      type="datetime-local"
                      name="arrivalTime"
                      value={form.arrivalTime}
                      onChange={handleChange}
                      required
                    />
                  </Field>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <Field label="Price">
                      <input
                        className={inputClass}
                        type="number"
                        min="0"
                        name="price"
                        value={form.price}
                        onChange={handleChange}
                        required
                      />
                    </Field>
                    <Field label="Boarding gate">
                      <input
                        className={inputClass}
                        name="boardingGage"
                        value={form.boardingGage}
                        onChange={handleChange}
                      />
                    </Field>
                    <Field label="Total seats">
                      <input
                        className={inputClass}
                        type="number"
                        min="1"
                        name="totalSeats"
                        value={form.totalSeats}
                        onChange={handleChange}
                        required
                      />
                    </Field>
                  </div>
                </>
              ) : null}

              {error ? <p className="text-sm text-red-500">{error}</p> : null}
              {message ? <p className="text-sm text-emerald-600">{message}</p> : null}

              <button type="submit" disabled={saving} className="gradient-button w-full px-5 py-3.5 text-sm font-black">
                {saving ? 'Saving...' : editingId == null ? 'Create' : 'Save changes'}
              </button>
            </form>
          </section>

          <section className="soft-card rounded-[2rem] p-6 sm:p-7">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-black text-slate-950">{TABS.find((item) => item.id === tab)?.label}</h2>
              <button
                type="button"
                onClick={loadAll}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-600"
              >
                Refresh
              </button>
            </div>

            {loading ? (
              <p className="mt-8 text-sm text-slate-500">Loading...</p>
            ) : rows.length === 0 ? (
              <p className="mt-8 text-sm text-slate-500">No records yet.</p>
            ) : (
              <ul className="mt-6 max-h-[42rem] space-y-3 overflow-y-auto pr-1">
                {rows.map((row) => (
                  <li
                    key={row.id}
                    className="rounded-[1.5rem] border border-slate-200/80 bg-white/80 p-4 shadow-sm"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        {tab === 'city' ? (
                          <>
                            <p className="font-black text-slate-950">{row.name}</p>
                            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                              ID {row.id}
                            </p>
                          </>
                        ) : null}
                        {tab === 'airport' ? (
                          <>
                            <p className="font-black text-slate-950">
                              {row.code} — {row.name}
                            </p>
                            <p className="mt-1 text-sm text-slate-500">
                              City: {cityNameById.get(String(row.cityId)) || row.cityId}
                              {row.address ? ` · ${row.address}` : ''}
                            </p>
                          </>
                        ) : null}
                        {tab === 'airplane' ? (
                          <>
                            <p className="font-black text-slate-950">{row.modelNumber}</p>
                            <p className="mt-1 text-sm text-slate-500">
                              Capacity {row.capacity} · ID {row.id}
                            </p>
                          </>
                        ) : null}
                        {tab === 'flight' ? (
                          <>
                            <p className="font-black text-slate-950">{row.flightNumber}</p>
                            <p className="mt-1 text-sm text-slate-500">
                              {row.departureAirportId} → {row.arrivalAirportId} · ₹{row.price} ·{' '}
                              {row.totalSeats} seats
                            </p>
                            <p className="mt-1 text-xs text-slate-400">
                              {row.departureTime ? new Date(row.departureTime).toLocaleString() : '—'} →{' '}
                              {row.arrivalTime ? new Date(row.arrivalTime).toLocaleString() : '—'}
                            </p>
                          </>
                        ) : null}
                      </div>
                      <div className="flex shrink-0 gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(row)}
                          className="rounded-full border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(row.id)}
                          className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-bold text-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}

export default AdminDashboardPage
