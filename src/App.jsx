import { useEffect, useState } from "react";

const causes = [
  { name: "A brighter start", category: "EDUCATION", text: "Books, school supplies and the support to keep showing up.", raised: "₹6.2L", target: "₹8L", progress: 78, color: "gold", photo: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=1000&q=85", alt: "A child smiling in warm sunlight" },
  { name: "Care that reaches you", category: "HEALTHCARE", text: "Mobile health clinics bringing check-ups closer to home.", raised: "₹5.1L", target: "₹6L", progress: 85, color: "green", photo: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1000&q=85", alt: "A healthcare worker caring for a patient" },
  { name: "A safe place to land", category: "SAFE SHELTER", text: "Helping families rebuild with safe homes and essentials.", raised: "₹4.1L", target: "₹10L", progress: 41, color: "blue", photo: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1000&q=85", alt: "Children gathering together outdoors" },
];
const amounts = [500, 1000, 2500, 5000];

function App() {
  const [amount, setAmount] = useState(1000);
  const [donor, setDonor] = useState({ name: "", email: "" });
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => { document.documentElement.dataset.theme = dark ? "dark" : "light"; }, [dark]);

  async function submitPledge(event) {
    event.preventDefault();
    setBusy(true); setStatus("");
    try {
      const response = await fetch("/api/donations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...donor, amount, cause: "Where it is needed most" }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not save your pledge.");
      setStatus(`Thank you, ${donor.name.trim()} — your ₹${amount.toLocaleString("en-IN")} pledge has been received. We’ll email you with next steps.`);
      setDonor({ name: "", email: "" });
    } catch (error) {
      setStatus(error.message === "Failed to fetch" ? "The donation service is offline. Start the backend with npm run server and try again." : error.message);
    } finally { setBusy(false); }
  }

  return <>
    <nav className="nav"><div className="container nav-inner"><a href="#home" className="brand"><span className="brand-mark">a.</span><span>Aasha<span className="brand-light"> Trust</span></span></a>
      <button className="menu-toggle" aria-label="Toggle navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>☰</button>
      <div className={`nav-links ${menuOpen ? "open" : ""}`}><a href="#causes" onClick={() => setMenuOpen(false)}>Our work</a><a href="#story" onClick={() => setMenuOpen(false)}>Our approach</a><a href="#transparency" onClick={() => setMenuOpen(false)}>Transparency</a></div>
      <div className="nav-actions"><button className="theme-toggle" aria-label="Toggle dark mode" onClick={() => setDark(!dark)}>{dark ? "☀" : "◐"}</button><a className="button button-dark nav-donate" href="#donate">Give with hope <span>↗</span></a></div>
    </div></nav>

    <main id="home">
      <section className="hero"><div className="container hero-grid"><div className="hero-copy"><div className="eyebrow"><span className="eyebrow-line"/> HOPE, MADE PRACTICAL</div><h1>A little hope<br/>goes <em>a long way.</em></h1><p className="hero-lede">We connect generous people with the communities who need them most. Every gift makes room for a brighter tomorrow.</p><div className="hero-actions"><a className="button button-dark" href="#donate">Make a difference <span>↗</span></a><a className="text-link" href="#causes">Explore our work <span>↓</span></a></div><div className="hero-proof"><div className="avatar-stack"><i>R</i><i>A</i><i>P</i><i>+</i></div><span><b>8,500+</b> people giving hope together</span></div></div>
      <div className="hero-art"><img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=90" alt="Children smiling together in their community"/><div className="image-wash"/><div className="hero-note"><span className="note-spark">✳</span><div><b>Hope looks good on everyone.</b><small>One community at a time.</small></div></div><div className="impact-stamp"><b>95%</b><span>of every rupee<br/>goes to programs</span></div><span className="art-caption">A future full of possibility <span>✳</span></span></div></div>
      <div className="container trust-strip"><span>Small acts. Lasting change.</span><div><i>✳</i> 80G eligible</div><div><i>✳</i> Verified programs</div><div><i>✳</i> Transparent giving</div><div><i>✳</i> Secure donations</div></div></section>

      <section className="causes-section section-pad" id="causes"><div className="container"><div className="section-heading"><div><div className="eyebrow"><span className="eyebrow-line"/> WHERE YOUR KINDNESS GOES</div><h2>Good things grow<br/>when we <em>show up.</em></h2></div><p>Choose a cause close to your heart. We’ll make sure your generosity reaches people doing the work on the ground.</p></div>
        <div className="cause-grid">{causes.map((cause, index) => <article className="cause-card" key={cause.name}><div className="cause-image"><img src={cause.photo} alt={cause.alt} loading="lazy"/><span className={`cause-index ${cause.color}`}>0{index + 1}</span><span className="cause-category">{cause.category}</span></div><div className="cause-body"><h3>{cause.name}</h3><p>{cause.text}</p><div className="progress-meta"><b>{cause.raised} <small>raised</small></b><span>Goal {cause.target}</span></div><div className="progress-track"><i className={cause.color} style={{ width: `${cause.progress}%` }}/></div><a className="cause-link" href="#donate">Support this cause <span>↗</span></a></div></article>)}</div>
        <div className="causes-footnote"><span>More good things are happening every day.</span><a href="#donate">Help where it’s needed most <span>↗</span></a></div></div></section>

      <section className="story-section" id="story"><div className="container story-grid"><div className="story-visual"><div className="story-photo"><img src="https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1000&q=85" alt="A teacher sharing a moment with students" loading="lazy"/></div><div className="story-tag"><span>✳</span> Rooted in community</div><div className="story-number"><b>01</b><span>Listen first.<br/>Act together.</span></div></div><div className="story-copy"><div className="eyebrow"><span className="eyebrow-line"/> HOW WE MAKE IT COUNT</div><h2>Good intentions.<br/><em>Grounded action.</em></h2><p>Real change starts by listening. We partner with people who understand their communities, then bring resources and care where they can do the most good.</p><div className="principles"><div><span>01</span><p><b>People before projects</b><small>Local voices shape every decision.</small></p></div><div><span>02</span><p><b>Every rupee, accounted for</b><small>Clear updates on the impact you make.</small></p></div><div><span>03</span><p><b>Better, together</b><small>Long-term partnerships create lasting change.</small></p></div></div><a className="text-link" href="#transparency">See how we work <span>↗</span></a></div></div></section>

      <section className="impact-band" id="transparency"><div className="container impact-inner"><div className="impact-intro"><div className="eyebrow"><span className="eyebrow-line"/> BUILT ON TRUST</div><h2>Hope you can<br/><em>feel good about.</em></h2><p>We believe doing good should feel good, too. That means being open about every step.</p></div><div className="impact-stat"><span>EVERY ₹100</span><b>₹95</b><p>goes directly to community programs</p><div className="impact-bar"><i/></div><small>The remaining ₹5 supports careful, accountable operations.</small></div><div className="impact-details"><div><span>✳</span><p><b>Clear from day one</b><small>Know where your contribution goes.</small></p></div><div><span>✳</span><p><b>Updates that matter</b><small>See real progress from the ground.</small></p></div><div><span>✳</span><p><b>Giving with purpose</b><small>Eligible donations receive 80G receipts.</small></p></div><a href="#donate">Read our approach <span>↗</span></a></div></div></section>

      <section className="donate-section section-pad" id="donate"><div className="container donate-grid"><div className="donate-copy"><div className="eyebrow"><span className="eyebrow-line"/> YOUR KINDNESS STARTS HERE</div><h2>Make room for<br/><em>more hope.</em></h2><p>Choose a pledge amount and we’ll be in touch with the next steps to complete your donation.</p><div className="donate-aside"><span>✳</span><p><b>Every gift matters.</b><small>Your contribution helps local teams keep doing what works.</small></p></div></div><form className="donate-form" onSubmit={submitPledge}><div className="form-top"><div><small>MAKE A PLEDGE</small><h3>Give with heart.</h3></div><span>♥</span></div><label className="field-label">Choose an amount</label><div className="amount-grid">{amounts.map(value => <button type="button" key={value} className={`amount-option ${amount === value ? "selected" : ""}`} onClick={() => setAmount(value)}>₹{value.toLocaleString("en-IN")}</button>)}</div><div className="input-grid"><label>Your name<input required minLength="2" maxLength="80" autoComplete="name" placeholder="e.g. Asha Kumar" value={donor.name} onChange={e => setDonor({ ...donor, name: e.target.value })}/></label><label>Email address<input required type="email" maxLength="254" autoComplete="email" placeholder="you@example.com" value={donor.email} onChange={e => setDonor({ ...donor, email: e.target.value })}/></label></div><button className="button button-dark submit-button" disabled={busy}>{busy ? "Saving your pledge…" : <>Continue with ₹{amount.toLocaleString("en-IN")} <span>↗</span></>}</button><p className="form-note">Your pledge is recorded securely. Payment processing will be added when a payment provider is configured.</p>{status && <p className="form-status" role="status">{status}</p>}</form></div></section>
    </main>
    <footer>
  <div className="container footer-inner">

    <a href="#home" className="brand">
      <span className="brand-mark">a.</span>
      <span>
        Aasha<span className="brand-light"> Trust</span>
      </span>
    </a>

    <span>Hope grows when we give it room.</span>

    <div className="footer-contact">
      <span><b>Designed by</b> Abi </span>
      <span>Roll No: 2312119</span>
      <span>📞 9597116122</span>
    </div>

    <span>
      © 2026 Aasha Trust <i>·</i> Registered charitable trust
    </span>

  </div>
</footer>
  </>;
}

export default App;
