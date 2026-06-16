'use client';

import { useEffect, useMemo, useState } from 'react';
import { Listing, locations, seedListings, topics } from '@/lib/data';

const currency = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 });

type Section = 'Overview' | 'Directory' | 'Trainer Portal' | 'Admin Portal' | 'Billing & Emails';
type EmailLog = { id: number; type: string; message: string; time: string };

function loadListings(): Listing[] {
  if (typeof window === 'undefined') return seedListings;
  const saved = localStorage.getItem('mh_listings');
  return saved ? JSON.parse(saved) : seedListings;
}

function Sidebar({ section, setSection }: { section: Section; setSection: (section: Section) => void }) {
  const items: { label: Section; icon: string; hint: string }[] = [
    { label: 'Overview', icon: '⌂', hint: 'Launch snapshot' },
    { label: 'Directory', icon: '⌕', hint: 'Public search' },
    { label: 'Trainer Portal', icon: '◉', hint: 'Listings & plans' },
    { label: 'Admin Portal', icon: '✓', hint: 'Approvals & tags' },
    { label: 'Billing & Emails', icon: '↻', hint: 'Stripe webhooks' }
  ];

  return (
    <aside className="sidebar">
      <div className="brand-block">
        <div className="brand-logo">M</div>
        <div>
          <b>MindGuide</b>
          <span>Mental Health Directory</span>
        </div>
      </div>

      <nav className="side-nav">
        {items.map((item) => (
          <button key={item.label} onClick={() => setSection(item.label)} className={section === item.label ? 'active' : ''}>
            <span className="nav-icon">{item.icon}</span>
            <span>
              <b>{item.label}</b>
              <small>{item.hint}</small>
            </span>
          </button>
        ))}
      </nav>

      <div className="side-card">
        <span className="badge">Phase 1 demo</span>
        <h3>Custom build, not WordPress.</h3>
        <p>Next.js prototype showing directory search, trainer subscriptions, approvals and lifecycle emails.</p>
      </div>
    </aside>
  );
}

function Topbar({ section }: { section: Section }) {
  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">Mental health industry MVP</p>
        <h1>{section}</h1>
      </div>
      <div className="top-actions">
        <span className="pill ok">Demo data saved locally</span>
        <button className="btn soft" onClick={() => window.location.reload()}>Refresh</button>
      </div>
    </header>
  );
}

function Metric({ label, value, tone }: { label: string; value: string | number; tone?: 'ok' | 'warn' | 'bad' }) {
  return (
    <div className="metric-card">
      <p>{label}</p>
      <strong>{value}</strong>
      <span className={`mini ${tone || 'ok'}`}>{tone === 'warn' ? 'Needs review' : tone === 'bad' ? 'Action needed' : 'Healthy'}</span>
    </div>
  );
}

function Overview({ listings, emails, setSection }: { listings: Listing[]; emails: EmailLog[]; setSection: (section: Section) => void }) {
  return (
    <section className="stack">
      <div className="hero-panel">
        <div>
          <span className="badge">Investor / client demo</span>
          <h2>Subscription-based professional directory dashboard.</h2>
          <p>
            A polished dashboard-style prototype for a mental health directory where professionals subscribe to list services,
            end users search for free, and admins approve listings before publication.
          </p>
          <div className="hero-actions">
            <button className="btn primary" onClick={() => setSection('Directory')}>View public directory</button>
            <button className="btn" onClick={() => setSection('Trainer Portal')}>Submit trainer listing</button>
          </div>
        </div>
        <div className="launch-box">
          <h3>Phase 1 scope covered</h3>
          <ul>
            <li>Searchable public directory with filters</li>
            <li>Trainer portal and listing management</li>
            <li>Admin approval and tag taxonomy</li>
            <li>Stripe subscription lifecycle simulation</li>
            <li>Transactional email trigger log</li>
          </ul>
        </div>
      </div>

      <div className="metrics-grid">
        <Metric label="Approved listings" value={listings.filter((l) => l.status === 'Approved').length} />
        <Metric label="Pending approvals" value={listings.filter((l) => l.status === 'Pending').length} tone="warn" />
        <Metric label="Subscription tiers" value="2" />
        <Metric label="Email events" value={emails.length} />
      </div>

      <div className="grid two">
        <div className="card stack">
          <div className="row"><h3>Launch checklist</h3><span className="pill ok">Ready for MVP discussion</span></div>
          {['Domain + deployment', 'Directory filters', 'Trainer onboarding', 'Admin approvals', 'Stripe subscription webhooks', 'Transactional emails'].map((item) => (
            <div className="check-row" key={item}><span>✓</span><b>{item}</b></div>
          ))}
        </div>
        <div className="card stack">
          <h3>Recent activity</h3>
          {[...emails].slice(0, 5).map((email) => (
            <div className="activity" key={email.id}>
              <b>{email.type}</b>
              <p>{email.message}</p>
              <small>{email.time}</small>
            </div>
          ))}
          {!emails.length && <p className="muted">No email events yet. Try approving a listing or simulating a Stripe webhook.</p>}
        </div>
      </div>
    </section>
  );
}

function Directory({ listings }: { listings: Listing[] }) {
  const [q, setQ] = useState('');
  const [topic, setTopic] = useState('');
  const [location, setLocation] = useState('');
  const [format, setFormat] = useState('');
  const [accredited, setAccredited] = useState('');

  const approved = listings.filter((l) => l.status === 'Approved');
  const filtered = useMemo(() => approved.filter((l) =>
    (!q || `${l.name} ${l.title} ${l.bio}`.toLowerCase().includes(q.toLowerCase())) &&
    (!topic || l.topic === topic) &&
    (!location || l.location === location) &&
    (!format || l.format === format) &&
    (!accredited || String(l.accredited) === accredited)
  ), [approved, q, topic, location, format, accredited]);

  return (
    <section className="stack">
      <div className="card stack">
        <div className="row">
          <div><h2>Public directory search</h2><p className="muted">End users can search without creating an account.</p></div>
          <span className="pill ok">{filtered.length} results</span>
        </div>
        <div className="filters">
          <input className="input" placeholder="Search by name, topic or need" value={q} onChange={(e) => setQ(e.target.value)} />
          <select value={topic} onChange={(e) => setTopic(e.target.value)}><option value="">All topics</option>{topics.map((t) => <option key={t}>{t}</option>)}</select>
          <select value={location} onChange={(e) => setLocation(e.target.value)}><option value="">All locations</option>{locations.map((t) => <option key={t}>{t}</option>)}</select>
          <select value={format} onChange={(e) => setFormat(e.target.value)}><option value="">Any format</option><option>Online</option><option>In-person</option><option>Hybrid</option></select>
          <select value={accredited} onChange={(e) => setAccredited(e.target.value)}><option value="">Any accreditation</option><option value="true">Accredited only</option><option value="false">Non-accredited</option></select>
        </div>
      </div>

      <div className="directory-grid">
        {filtered.map((l) => (
          <article className="profile-card" key={l.id}>
            <div className="avatar">{l.name.split(' ').map((x) => x[0]).join('')}</div>
            <div className="profile-main">
              <div className="row"><h3>{l.name}</h3><b>{currency.format(l.price)}</b></div>
              <p className="muted"><b>{l.title}</b></p>
              <p>{l.bio}</p>
              <div>{[l.topic, l.location, l.format].map((x) => <span className="pill" key={x}>{x}</span>)}{l.accredited && <span className="pill ok">Accredited</span>}</div>
              <div className="profile-footer"><span>★ {l.rating}</span><button className="btn soft">View profile</button></div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function TrainerPortal({ listings, setListings, addEmail }: { listings: Listing[]; setListings: (listings: Listing[]) => void; addEmail: (type: string, message: string) => void }) {
  const [plan, setPlan] = useState<'Starter' | 'Professional'>('Starter');
  const [name, setName] = useState('New Trainer');
  const [topic, setTopic] = useState('Anxiety');
  const [location, setLocation] = useState('Remote');
  const [price, setPrice] = useState(65);

  function submit() {
    const next: Listing = {
      id: Date.now(), name, topic, location, price,
      title: `${topic} Support Professional`, format: location === 'Remote' ? 'Online' : 'Hybrid',
      accredited: plan === 'Professional', status: 'Pending', tier: plan,
      bio: 'Submitted through the trainer portal and waiting for admin approval.', rating: 4.5
    };
    const updated = [next, ...listings];
    setListings(updated);
    localStorage.setItem('mh_listings', JSON.stringify(updated));
    addEmail('Listing submitted', `${name} submitted a new ${plan} listing for admin review.`);
  }

  return (
    <section className="grid two">
      <div className="card stack">
        <h2>Trainer-facing portal</h2>
        <p className="muted">Account creation, listing submission, plan selection and subscription state preview.</p>
        <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Professional name" />
        <div className="grid two compact">
          <select value={topic} onChange={(e) => setTopic(e.target.value)}>{topics.map((t) => <option key={t}>{t}</option>)}</select>
          <select value={location} onChange={(e) => setLocation(e.target.value)}>{locations.map((l) => <option key={l}>{l}</option>)}</select>
        </div>
        <input className="input" type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} placeholder="Session price" />
        <div className="pricing-grid">
          <button className={`price-card ${plan === 'Starter' ? 'selected' : ''}`} onClick={() => setPlan('Starter')}>
            <span>Starter</span><b>£29/mo</b><small>Basic directory listing</small>
          </button>
          <button className={`price-card ${plan === 'Professional' ? 'selected' : ''}`} onClick={() => setPlan('Professional')}>
            <span>Professional</span><b>£79/mo</b><small>Featured placement + badge</small>
          </button>
        </div>
        <button className="btn primary" onClick={submit}>Submit listing for approval</button>
      </div>

      <div className="card stack">
        <div className="row"><h2>Trainer listings</h2><span className="pill warn">approval workflow</span></div>
        {listings.slice(0, 7).map((l) => (
          <div className="list-row" key={l.id}>
            <div><b>{l.name}</b><p>{l.topic} • {l.tier} • {currency.format(l.price)}</p></div>
            <span className={`pill ${l.status === 'Approved' ? 'ok' : l.status === 'Pending' ? 'warn' : 'bad'}`}>{l.status}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function AdminPortal({ listings, setListings, addEmail }: { listings: Listing[]; setListings: (listings: Listing[]) => void; addEmail: (type: string, message: string) => void }) {
  const [tag, setTag] = useState('Neurodiversity');
  const [localTags, setLocalTags] = useState(topics);

  function updateStatus(id: number, status: Listing['status']) {
    const updated = listings.map((l) => l.id === id ? { ...l, status } : l);
    setListings(updated);
    localStorage.setItem('mh_listings', JSON.stringify(updated));
    addEmail(status === 'Approved' ? 'Listing approved' : 'Listing status changed', `Listing #${id} has been marked as ${status}.`);
  }

  return (
    <section className="stack">
      <div className="metrics-grid">
        <Metric label="Pending queue" value={listings.filter((l) => l.status === 'Pending').length} tone="warn" />
        <Metric label="Approved" value={listings.filter((l) => l.status === 'Approved').length} />
        <Metric label="Rejected" value={listings.filter((l) => l.status === 'Rejected').length} tone="bad" />
        <Metric label="Taxonomy tags" value={localTags.length} />
      </div>

      <div className="grid two wide-left">
        <div className="card stack">
          <h2>Listing approval queue</h2>
          <table className="table">
            <thead><tr><th>Professional</th><th>Status</th><th>Plan</th><th>Actions</th></tr></thead>
            <tbody>
              {listings.map((l) => (
                <tr key={l.id}>
                  <td><b>{l.name}</b><br /><span className="muted">{l.topic} • {l.location}</span></td>
                  <td><span className={`pill ${l.status === 'Approved' ? 'ok' : l.status === 'Pending' ? 'warn' : 'bad'}`}>{l.status}</span></td>
                  <td>{l.tier}</td>
                  <td className="action-cell"><button className="btn soft" onClick={() => updateStatus(l.id, 'Approved')}>Approve</button><button className="btn" onClick={() => updateStatus(l.id, 'Rejected')}>Reject</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="card stack">
          <h2>Tag taxonomy</h2>
          <p className="muted">Admin can manage topics used across listings and public filters.</p>
          <div className="row input-row"><input className="input" value={tag} onChange={(e) => setTag(e.target.value)} /><button className="btn primary" onClick={() => { setLocalTags([tag, ...localTags]); addEmail('Admin updated tags', `New taxonomy tag added: ${tag}`); }}>Add</button></div>
          <div>{localTags.map((t) => <span className="pill" key={t}>{t}</span>)}</div>
          <div className="notice"><b>Production note</b><p>Admin portal would include RBAC, audit logs, trainer suspension, subscription overrides and moderation history.</p></div>
        </div>
      </div>
    </section>
  );
}

function BillingEmails({ emails, addEmail }: { emails: EmailLog[]; addEmail: (type: string, message: string) => void }) {
  const events = [
    ['checkout.session.completed', 'Subscription activated. Trainer account set to Active.'],
    ['invoice.payment_failed', 'Payment failed. Trainer notified and account moved to Past Due.'],
    ['customer.subscription.deleted', 'Subscription cancelled. Listing hidden from public directory.'],
    ['renewal.reminder', 'Renewal reminder email queued 7 days before billing date.']
  ];

  return (
    <section className="grid two">
      <div className="card stack">
        <h2>Stripe subscription lifecycle</h2>
        <p className="muted">Mock webhook events update trainer account state and trigger transactional emails.</p>
        {events.map(([type, message]) => <button className="webhook-button" key={type} onClick={() => addEmail(type, message)}><b>{type}</b><span>{message}</span></button>)}
      </div>
      <div className="card stack">
        <div className="row"><h2>Email trigger log</h2><span className="pill">Resend-ready flow</span></div>
        {emails.map((e) => (
          <div className="email-log" key={e.id}>
            <b>{e.type}</b>
            <p>{e.message}</p>
            <small>{e.time}</small>
          </div>
        ))}
        {!emails.length && <p className="muted">No events yet. Click a webhook event to simulate account updates and emails.</p>}
      </div>
    </section>
  );
}

export default function App() {
  const [section, setSection] = useState<Section>('Overview');
  const [listings, setListings] = useState<Listing[]>(seedListings);
  const [emails, setEmails] = useState<EmailLog[]>([]);

  useEffect(() => {
    setListings(loadListings());
    const saved = localStorage.getItem('mh_emails');
    if (saved) setEmails(JSON.parse(saved));
  }, []);

  function addEmail(type: string, message: string) {
    const next = [{ id: Date.now(), type, message, time: new Date().toLocaleString() }, ...emails].slice(0, 10);
    setEmails(next);
    localStorage.setItem('mh_emails', JSON.stringify(next));
  }

  return (
    <div className="app-shell">
      <Sidebar section={section} setSection={setSection} />
      <main className="main-panel">
        <Topbar section={section} />
        <div className="content-area">
          {section === 'Overview' && <Overview listings={listings} emails={emails} setSection={setSection} />}
          {section === 'Directory' && <Directory listings={listings} />}
          {section === 'Trainer Portal' && <TrainerPortal listings={listings} setListings={setListings} addEmail={addEmail} />}
          {section === 'Admin Portal' && <AdminPortal listings={listings} setListings={setListings} addEmail={addEmail} />}
          {section === 'Billing & Emails' && <BillingEmails emails={emails} addEmail={addEmail} />}
        </div>
      </main>
    </div>
  );
}
