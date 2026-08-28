import { useEffect, useState } from 'react'
import './App.css'

const API = 'http://127.0.0.1:8000/api/'
const emptyCourse = { title: '', description: '', instructor: '', level: 'Pemula', duration: 1, price: 0, is_published: true }
const emptyParticipant = { name: '', email: '', course: '', status: 'Aktif' }
const emptyActivity = { message: '', action: 'Pembaruan', course: '' }

async function request(url, options = {}) {
  const response = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...options })
  if (response.status === 204) return null
  const data = await response.json().catch(() => null)
  if (!response.ok) throw new Error(data?.detail || `API mengembalikan error ${response.status}.`)
  return data
}

function ResourceHeader({ eyebrow, title, search, setSearch, action, actionLabel }) {
  return <div className="resource-header"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1></div><div className="resource-tools">{search !== undefined && <input className="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari..." />}{action && <button className="primary" onClick={action}>+ {actionLabel}</button>}</div></div>
}

function App() {
  const [activeTab, setActiveTab] = useState('courses')
  const [courses, setCourses] = useState([])
  const [participants, setParticipants] = useState([])
  const [activities, setActivities] = useState([])
  const [courseForm, setCourseForm] = useState(emptyCourse)
  const [participantForm, setParticipantForm] = useState(emptyParticipant)
  const [activityForm, setActivityForm] = useState(emptyActivity)
  const [editing, setEditing] = useState(null)
  const [search, setSearch] = useState('')
  const [city, setCity] = useState('Jakarta')
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)
  const [weatherLoading, setWeatherLoading] = useState(false)
  const [error, setError] = useState('')

  const loadData = async () => {
    try {
      setLoading(true)
      const [courseData, participantData, activityData] = await Promise.all([request(`${API}courses/`), request(`${API}participants/`), request(`${API}activities/`)])
      setCourses(courseData); setParticipants(participantData); setActivities(activityData); setError('')
    } catch (err) { setError(err.message) } finally { setLoading(false) }
  }
  useEffect(() => { loadData() }, [])

  const saveResource = async (type, form, numeric = false) => {
    try {
      const id = editing?.type === type ? editing.id : null
      const payload = numeric ? { ...form, duration: Number(form.duration), price: Number(form.price) } : { ...form, course: form.course ? Number(form.course) : null }
      await request(`${API}${type}/${id ? `${id}/` : ''}`, { method: id ? 'PUT' : 'POST', body: JSON.stringify(payload) })
      setEditing(null); setCourseForm(emptyCourse); setParticipantForm(emptyParticipant); setActivityForm(emptyActivity); await loadData()
    } catch (err) { setError(err.message) }
  }
  const remove = async (type, id) => {
    if (!window.confirm('Hapus data ini?')) return
    try { await request(`${API}${type}/${id}/`, { method: 'DELETE' }); await loadData() } catch (err) { setError(err.message) }
  }
  const loadWeather = async (event) => {
    event?.preventDefault()
    try { setWeatherLoading(true); setWeather(await request(`${API}weather/?city=${encodeURIComponent(city)}`)); setError('') } catch (err) { setError(err.message) } finally { setWeatherLoading(false) }
  }
  const startEdit = (type, item) => { setEditing({ type, id: item.id }); if (type === 'courses') setCourseForm(item); if (type === 'participants') setParticipantForm({ ...item, course: item.course || '' }); if (type === 'activities') setActivityForm({ ...item, course: item.course || '' }) }
  const filteredCourses = courses.filter((item) => `${item.title} ${item.instructor}`.toLowerCase().includes(search.toLowerCase()))
  const filteredParticipants = participants.filter((item) => `${item.name} ${item.email} ${item.course_title}`.toLowerCase().includes(search.toLowerCase()))
  const filteredActivities = activities.filter((item) => `${item.message} ${item.action} ${item.course_title}`.toLowerCase().includes(search.toLowerCase()))

  const renderCourses = () => <><ResourceHeader eyebrow="KATALOG KURSUS" title="Semua kelas" search={search} setSearch={setSearch} /><div className="stats"><div><strong>{courses.length}</strong><span>Total kursus</span></div><div><strong>{courses.filter((item) => item.is_published).length}</strong><span>Dipublikasikan</span></div><div><strong>{courses.filter((item) => !item.is_published).length}</strong><span>Draft</span></div></div><div className="workspace"><ResourceForm title={editing?.type === 'courses' ? 'Perbarui detail' : 'Mulai kelas baru'} eyebrow={editing?.type === 'courses' ? 'EDIT KURSUS' : 'KURSUS BARU'} onSubmit={(event) => { event.preventDefault(); saveResource('courses', courseForm, true) }}><label>Judul kursus<input required value={courseForm.title} onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })} /></label><label>Deskripsi<textarea required rows="4" value={courseForm.description} onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })} /></label><label>Instruktur<input required value={courseForm.instructor} onChange={(e) => setCourseForm({ ...courseForm, instructor: e.target.value })} /></label><div className="form-row"><label>Level<select value={courseForm.level} onChange={(e) => setCourseForm({ ...courseForm, level: e.target.value })}><option>Pemula</option><option>Menengah</option><option>Lanjutan</option></select></label><label>Durasi<input min="1" type="number" value={courseForm.duration} onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })} /></label></div><label>Harga (Rp)<input min="0" type="number" value={courseForm.price} onChange={(e) => setCourseForm({ ...courseForm, price: e.target.value })} /></label><label className="toggle"><input type="checkbox" checked={courseForm.is_published} onChange={(e) => setCourseForm({ ...courseForm, is_published: e.target.checked })} /><span className="switch" /> Publikasikan sekarang</label></ResourceForm><div className="course-grid">{filteredCourses.map((item) => <article className="course-card" key={item.id}><div className="card-top"><span className="level">{item.level}</span><span className={item.is_published ? 'published' : 'draft'}>{item.is_published ? '● Live' : '○ Draft'}</span></div><h3>{item.title}</h3><p>{item.description}</p><div className="meta"><span>{item.instructor}</span><span>{item.duration} jam</span></div><div className="card-bottom"><strong>Rp {Number(item.price).toLocaleString('id-ID')}</strong><div><button className="icon-button" onClick={() => startEdit('courses', item)}>✎</button><button className="icon-button danger" onClick={() => remove('courses', item.id)}>×</button></div></div></article>)}</div></div></>

  const renderWeather = () => <section className="weather-page"><p className="eyebrow">LIVE WEATHER</p><h1>Langit hari ini.</h1><p className="page-copy">Cek kondisi cuaca kota mana pun untuk membantu merencanakan sesi belajar.</p><form className="weather-search" onSubmit={loadWeather}><input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Nama kota" /><button className="primary">{weatherLoading ? 'Memuat...' : 'Cek cuaca'} <span>↗</span></button></form>{weather?.main && <div className="weather-result weather-large"><div className="weather-temp">{Math.round(weather.main.temp)}°<small>C</small></div><div><strong>{weather.name}</strong><p>{weather.weather?.[0]?.description}</p></div><div className="weather-details"><span>Terasa {Math.round(weather.main.feels_like)}°C</span><span>Angin {weather.wind?.speed ?? 0} m/s</span><span>Kelembapan {weather.main.humidity}%</span></div></div>}</section>

  const renderParticipants = () => <><ResourceHeader eyebrow="COMMUNITY" title="Peserta kursus" search={search} setSearch={setSearch} action={() => { setEditing(null); setParticipantForm(emptyParticipant) }} actionLabel="Tambah peserta" /><div className="resource-layout"><ResourceForm title={editing?.type === 'participants' ? 'Edit peserta' : 'Peserta baru'} eyebrow="DATA PESERTA" onSubmit={(event) => { event.preventDefault(); saveResource('participants', participantForm) }}><label>Nama lengkap<input required value={participantForm.name} onChange={(e) => setParticipantForm({ ...participantForm, name: e.target.value })} /></label><label>Email<input required type="email" value={participantForm.email} onChange={(e) => setParticipantForm({ ...participantForm, email: e.target.value })} /></label><label>Kursus<select required value={participantForm.course} onChange={(e) => setParticipantForm({ ...participantForm, course: e.target.value })}><option value="">Pilih kursus</option>{courses.map((course) => <option key={course.id} value={course.id}>{course.title}</option>)}</select></label><label>Status<select value={participantForm.status} onChange={(e) => setParticipantForm({ ...participantForm, status: e.target.value })}><option>Aktif</option><option>Selesai</option></select></label></ResourceForm><DataTable headers={['Nama', 'Email', 'Kursus', 'Status', 'Aksi']} rows={filteredParticipants.map((item) => [item.name, item.email, item.course_title, item.status, <><button className="table-action" onClick={() => startEdit('participants', item)}>Edit</button><button className="table-action danger" onClick={() => remove('participants', item.id)}>Hapus</button></>])} /></div></>

  const renderActivities = () => <><ResourceHeader eyebrow="TIMELINE" title="Aktivitas terbaru" search={search} setSearch={setSearch} action={() => { setEditing(null); setActivityForm(emptyActivity) }} actionLabel="Tambah aktivitas" /><div className="resource-layout"><ResourceForm title={editing?.type === 'activities' ? 'Edit aktivitas' : 'Aktivitas baru'} eyebrow="CATATAN AKTIVITAS" onSubmit={(event) => { event.preventDefault(); saveResource('activities', activityForm) }}><label>Pesan aktivitas<textarea required rows="3" value={activityForm.message} onChange={(e) => setActivityForm({ ...activityForm, message: e.target.value })} placeholder="Contoh: Sari menyelesaikan kelas..." /></label><label>Jenis aktivitas<select value={activityForm.action} onChange={(e) => setActivityForm({ ...activityForm, action: e.target.value })}><option>Pendaftaran</option><option>Publikasi</option><option>Pembaruan</option></select></label><label>Kursus terkait<select value={activityForm.course} onChange={(e) => setActivityForm({ ...activityForm, course: e.target.value })}><option value="">Tanpa kursus</option>{courses.map((course) => <option key={course.id} value={course.id}>{course.title}</option>)}</select></label></ResourceForm><DataTable headers={['Aktivitas', 'Jenis', 'Kursus', 'Aksi']} rows={filteredActivities.map((item) => [item.message, item.action, item.course_title || '-', <><button className="table-action" onClick={() => startEdit('activities', item)}>Edit</button><button className="table-action danger" onClick={() => remove('activities', item.id)}>Hapus</button></>])} /></div></>

  const tabs = [{ id: 'courses', label: 'Koleksi kursus', icon: '▱' }, { id: 'weather', label: 'Cuaca hari ini', icon: '☼' }, { id: 'participants', label: 'Peserta', icon: '♧' }, { id: 'activities', label: 'Aktivitas', icon: '◷' }]
  return <div className="app-frame"><aside className="sidebar"><div className="side-brand"><span className="side-logo">K</span><span>KURSUS<br /><b>Studio</b></span></div><nav className="side-nav">{tabs.map((tab) => <button className={activeTab === tab.id ? 'side-tab active' : 'side-tab'} key={tab.id} onClick={() => { setActiveTab(tab.id); setSearch('') }}><span className="side-icon">{tab.icon}</span>{tab.label}</button>)}</nav><div className="side-footer"><span className="avatar">KS</span><span><b>Kursus Studio</b><small>Content manager</small></span></div></aside><main className="shell"><header className="topbar"><div className="brand"><span className="brand-mark">K</span><span>Kelas<span className="brand-accent">Kita</span></span></div><span className="api-status"><i /> API online</span></header>{error && <div className="alert">{error}<button onClick={() => setError('')}>Tutup</button></div>}<div className="content-area">{loading ? <p className="empty">Memuat data...</p> : activeTab === 'courses' ? renderCourses() : activeTab === 'weather' ? renderWeather() : activeTab === 'participants' ? renderParticipants() : renderActivities()}</div></main></div>
}

function ResourceForm({ title, eyebrow, onSubmit, children }) { return <form className="resource-form course-form" onSubmit={onSubmit}><div className="form-heading"><p className="eyebrow">{eyebrow}</p><h2>{title}</h2></div>{children}<div className="form-actions"><button className="primary" type="submit">Simpan data <span>→</span></button></div></form> }
function DataTable({ headers, rows }) { return <div className="data-table-wrap"><table className="data-table"><thead><tr>{headers.map((header) => <th key={header}>{header}</th>)}</tr></thead><tbody>{rows.length ? rows.map((row, index) => <tr key={index}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>) : <tr><td className="empty" colSpan={headers.length}>Belum ada data.</td></tr>}</tbody></table></div> }

export default App
// Test comment for pull request