import {
  BadgeCheck,
  Dumbbell,
  Eye,
  Flag,
  Headphones,
  Menu,
  Plane,
  Shield,
  ShieldCheck,
  Swords,
  X,
  Zap
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { transform } from "zod/v4";

const navItems = [
  { href: "#top", label: "Arrival" },
  { href: "#legacy", label: "Legacy" },
  { href: "#powers", label: "Abilities" },
  { href: "#church", label: "Devotion" },
  { href: "#complaints", label: "Citizen Complaint" }
];

const stats = [
  {
    label: "Public approval index",
    value: (
      <>
        <span
          className="counter"
          data-target="97"
         style={{
          fontSize: "1.7rem",
          fontWeight: "900",
          color: "#ffffff"
        }}
        >
          0
        </span>
        %
      </>
    ),
    fill: "97%"
  },

  {
    label: "National readiness window",
    value: "03:11",
    fill: "84%"
  },

  {
    label: "Protected broadcast zones",
    value: (
      <span
        className="counter"
        data-target="50"
        style={{
          fontSize: "1.7rem",
          fontWeight: "900",
          color: "#ffffff"
        }}
      >
        0
      </span>
    ),
    fill: "100%"
  }
];

const powers = [
  {
    title: "Laser Vision",
    detail:
      "Precision heat projection framed as swift judgment from a controlled distance.",
    icon: Eye,
    tone: "red"
  },
  {
    title: "Flight",
    detail:
      "Supersonic arrival over city grids, coastlines, and every camera pointed skyward.",
    icon: Plane,
    tone: "blue"
  },
  {
    title: "Super Strength",
    detail:
      "Overwhelming force presented as reassurance when ordinary defenses fail.",
    icon: Dumbbell,
    tone: "gold"
  },
  {
    title: "Invulnerability",
    detail:
      "A polished shield of certainty built for spectacle, pressure, and impact.",
    icon: Shield,
    tone: "white"
  },
  {
    title: "Enhanced Hearing",
    detail:
      "Every whisper becomes a signal in a country trained to stay attentive.",
    icon: Headphones,
    tone: "red"
  }
];

const emptyMember = {
  fullName: "",
  email: "",
  country: "",
  loyaltyMessage: ""
};

const emptyComplaint = {
  fullName: "",
  email: "",
  location: "",
  complaintDescription: ""
};

function Reveal({ children, className = "", delay = 0 }) {
  const element = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = element.current;

    if (!node) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.06 }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={element}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`}
      style={{ "--reveal-delay": `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function Field({ error, label, name, children }) {
  return (
    <label className="form-field" htmlFor={name}>
      <span>{label}</span>
      {children}
      {error ? <small>{error}</small> : null}
    </label>
  );
}

function ToastRail({ notifications, dismiss }) {
  return (
    <div className="toast-rail" aria-live="polite">
      {notifications.map((notification) => (
        <div
          className={`toast ${notification.type}`}
          key={notification.id}
          role="status"
        >
          <div>
            <strong>{notification.title}</strong>
            <p>{notification.message}</p>
          </div>
          <button
            aria-label="Dismiss notification"
            onClick={() => dismiss(notification.id)}
            title="Dismiss"
            type="button"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}

async function postSubmission(endpoint, payload) {
  const response = await fetch(endpoint, {
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json"
    },
    method: "POST"
  });
  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(body.error || "Transmission failed.");
    error.fields = body.fields || {};
    throw error;
  }

  return body;
}

export default function App() {
  const [navOpen, setNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [mousePosition, setMousePosition] = useState({
  x: 0,
  y: 0
});
  const [parallax, setParallax] = useState({
  x: 0,
  y: 0
});
  const [member, setMember] = useState(emptyMember);
  const [complaint, setComplaint] = useState(emptyComplaint);
  const [memberErrors, setMemberErrors] = useState({});
  const [complaintErrors, setComplaintErrors] = useState({});
  const [memberBusy, setMemberBusy] = useState(false);
  const [complaintBusy, setComplaintBusy] = useState(false);

 useEffect(() => {
  const onScroll = () => setScrolled(window.scrollY > 24);

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const counters = document.querySelectorAll(".counter");

  counters.forEach((counter) => {
    const target = Number(counter.dataset.target);
    let current = 0;

    const updateCounter = () => { 
      const increment = target / 60;

      current += increment;

      if (current < target) {
        counter.textContent = Math.floor(current);
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target;
      }
    };

    const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        updateCounter();
      }
    });
  },
  { threshold: 0.5 }
);

observer.observe(counter);
  });

  return () => window.removeEventListener("scroll", onScroll);
}, []);

useEffect(() => {
 const moveGlow = (e) => {

  setMousePosition({
    x: e.clientX,
    y: e.clientY
  });

  setParallax({
    x: (window.innerWidth / 2 - e.clientX) / 40,
    y: (window.innerHeight / 2 - e.clientY) / 40
  });

};

  window.addEventListener("mousemove", moveGlow);

  return () => {
    window.removeEventListener("mousemove", moveGlow);
  };
}, []);
  
useEffect(() => {
    if (!window.location.hash) {
      return;
    }

    window.requestAnimationFrame(() => {
      document.querySelector(window.location.hash)?.scrollIntoView();
    });
  }, []);

  function notify(type, title, message) {
    const id = Date.now().toString();

    setNotifications((current) => [...current, { id, type, title, message }]);
    window.setTimeout(() => {
      setNotifications((current) =>
        current.filter((notification) => notification.id !== id)
      );
    }, 5200);
  }

  async function submitMember(event) {
    event.preventDefault();
    setMemberBusy(true);
    setMemberErrors({});

    try {
      const result = await postSubmission("/api/church-members", member);

      setMember(emptyMember);
      notify("success", "Pledge accepted", result.message);
    } catch (error) {
      setMemberErrors(error.fields || {});
      notify("error", "Pledge held", error.message);
    } finally {
      setMemberBusy(false);
    }
  }

  async function submitComplaint(event) {
    event.preventDefault();
    setComplaintBusy(true);
    setComplaintErrors({});

    try {
      const result = await postSubmission(
        "/api/citizen-complaints",
        complaint
      );

      setComplaint(emptyComplaint);
      notify("success", "Report filed", result.message);
    } catch (error) {
      setComplaintErrors(error.fields || {});
      notify("error", "Report delayed", error.message);
    } finally {
      setComplaintBusy(false);
    }
  }

  return (
    <div>
  <div
    className="mouse-glow"
    style={{
      left: `${mousePosition.x}px`,
      top: `${mousePosition.y}px`
    }}
  />

  <main className="site-shell">
      <header className={`site-nav ${scrolled ? "scrolled" : ""}`}>
        <a className="brand" href="#top" aria-label="Protector Broadcast home">
          <span>
            <ShieldCheck size={18} />
          </span>
          <div>
            <strong>Protector Broadcast</strong>
            <small>National Image Directorate</small>
          </div>
        </a>

        <nav className={`nav-links ${navOpen ? "open" : ""}`}>
          {navItems.map((item) => (
            <a
              href={item.href}
              key={item.href}
              onClick={() => setNavOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="live-indicator">
         <span />
          LIVE
        </div>

        <button
          aria-label={navOpen ? "Close navigation" : "Open navigation"}
          className="nav-toggle"
          onClick={() => setNavOpen((current) => !current)}
          title={navOpen ? "Close navigation" : "Open navigation"}
          type="button"
        >
          {navOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      <section
        className="hero"
        id="top"
        style={{
          transform:
          window.innerWidth > 768
            ? `translate(${parallax.x}px, ${parallax.y}px)`
            : `translate(0px, 0px)`
        }}
        >
        <div className="hero-image" aria-hidden="true" />
        <div className="hero-grade" aria-hidden="true" />
        <div className="flag-wash" aria-hidden="true" />
        <div className="cloud-bank cloud-bank-one" aria-hidden="true" />
        <div className="cloud-bank cloud-bank-two" aria-hidden="true" />
        <div className="hero-eyes" aria-hidden="true" />

        <div className="hero-content">
          <Reveal>
            <p className="eyebrow">
              <Flag size={15} />
              Civic morale<span className="hide-mobile">TRANSMISSION</span>
            </p>
            <h1>The Protector of <span className="america-glow">AMERICA</span></h1>
            <p className="hero-subtitle">Strength. Justice. Superiority.</p>
            <div className="hero-actions">
              <a href="#church">Join the congregation</a>
              <a href="#legacy">View the record</a>
            </div>
          </Reveal>
        </div>

        <div className="hero-scan" aria-hidden="true">
          <span />
        </div>
      </section>

      <div className="news-ticker">
       <div className="news-track">
         BREAKING: homelander secures eastern airspace • National morale reaches historic peak • Vought confirms uninterrupted skyline surveillance • Public confidence remains at 97%.
       </div>
      </div>

      <section className="legacy-band" id="legacy">
        <div className="content-grid about-grid">
          <Reveal className="section-copy">
            <p className="eyebrow">
              <Swords size={15} />
              Legacy briefing
            </p>
            <h2>A symbol engineered for the age of permanent applause.</h2>
            <p>
              Homelander is presented as the nation made visible: a flawless
              aerial guardian, a television certainty, and the gold-trimmed
              answer to every frightened headline. In this fictional record,
              his legend grows through staged rescues, patriotic tours, and
              victories announced before the smoke clears.
            </p>
            <p>
              The campaign does not ask citizens to look away from power. It
              asks them to stand beneath it, salute the light, and believe the
              skyline is safer when one figure owns the sky.
            </p>
          </Reveal>

          <Reveal className="briefing-panel" delay={120}>
            <div className="panel-title">
              <BadgeCheck size={18} />
              Public confidence board
            </div>
            <div className="stat-stack">
              {stats.map((stat) => (
                <article key={stat.label}>
                  <header>
                    <span>{stat.label}</span>
                    <strong>{stat.value}</strong>
                  </header>
                  <div>
                    <i style={{ width: stat.fill }} />
                  </div>
                </article>
              ))}
            </div>
            <div className="achievement-grid">
              <span>Skyline interdiction</span>
              <span>Coast-to-coast rallies</span>
              <span>Command optics</span>
              <span>Prime-time reassurance</span>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="powers-band" id="powers">
        <div className="content-grid">
          <Reveal className="section-heading">
            <p className="eyebrow">
              <Zap size={15} />
              Power dossier
            </p>
            <h2>Abilities turned into national theater.</h2>
          </Reveal>

          <div className="power-grid">
            {powers.map((power, index) => {
              const Icon = power.icon;

              return (
                <Reveal delay={index * 70} key={power.title}>
                  <article className={`power-card ${power.tone}`}>
                    <div>
                      <Icon size={25} />
                    </div>
                    <h3>{power.title}</h3>
                    <p>{power.detail}</p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="registration-band" id="church">
        <div className="content-grid form-layout">
          <Reveal className="section-copy">
            <p className="eyebrow">
              <Shield size={15} />
              Democratic church
            </p>
            <h2>Enter the patriotic congregation.</h2>
            <p>
              Membership is framed as devotion to order, ceremony, and the
              hero on every screen. File a pledge for the next service and let
              the registry remember your voice.
            </p>
          </Reveal>

          <Reveal className="registry-panel" delay={110}>
            <form onSubmit={submitMember}>
              <Field
                error={memberErrors.fullName?.[0]}
                label="Full Name"
                name="member-full-name"
              >
                <input
                  autoComplete="name"
                  id="member-full-name"
                  onChange={(event) =>
                    setMember((current) => ({
                      ...current,
                      fullName: event.target.value
                    }))
                  }
                  value={member.fullName}
                />
              </Field>
              <Field
                error={memberErrors.email?.[0]}
                label="Email"
                name="member-email"
              >
                <input
                  autoComplete="email"
                  id="member-email"
                  onChange={(event) =>
                    setMember((current) => ({
                      ...current,
                      email: event.target.value
                    }))
                  }
                  type="email"
                  value={member.email}
                />
              </Field>
              <Field
                error={memberErrors.country?.[0]}
                label="Country"
                name="member-country"
              >
                <input
                  autoComplete="country-name"
                  id="member-country"
                  onChange={(event) =>
                    setMember((current) => ({
                      ...current,
                      country: event.target.value
                    }))
                  }
                  value={member.country}
                />
              </Field>
              <Field
                error={memberErrors.loyaltyMessage?.[0]}
                label="Loyalty Message"
                name="member-loyalty"
              >
                <textarea
                  id="member-loyalty"
                  onChange={(event) =>
                    setMember((current) => ({
                      ...current,
                      loyaltyMessage: event.target.value
                    }))
                  }
                  rows="4"
                  value={member.loyaltyMessage}
                />
              </Field>
              <button disabled={memberBusy} type="submit">
                {memberBusy ? "Transmitting..." : "Register membership"}
              </button>
            </form>
          </Reveal>
        </div>
      </section>

      <section className="complaint-band" id="complaints">
        <div className="content-grid form-layout reverse">
          <Reveal className="registry-panel complaint-panel">
            <form onSubmit={submitComplaint}>
              <Field
                error={complaintErrors.fullName?.[0]}
                label="Full Name"
                name="complaint-full-name"
              >
                <input
                  autoComplete="name"
                  id="complaint-full-name"
                  onChange={(event) =>
                    setComplaint((current) => ({
                      ...current,
                      fullName: event.target.value
                    }))
                  }
                  value={complaint.fullName}
                />
              </Field>
              <Field
                error={complaintErrors.email?.[0]}
                label="Email"
                name="complaint-email"
              >
                <input
                  autoComplete="email"
                  id="complaint-email"
                  onChange={(event) =>
                    setComplaint((current) => ({
                      ...current,
                      email: event.target.value
                    }))
                  }
                  type="email"
                  value={complaint.email}
                />
              </Field>
              <Field
                error={complaintErrors.location?.[0]}
                label="Location"
                name="complaint-location"
              >
                <input
                  autoComplete="address-level2"
                  id="complaint-location"
                  onChange={(event) =>
                    setComplaint((current) => ({
                      ...current,
                      location: event.target.value
                    }))
                  }
                  value={complaint.location}
                />
              </Field>
              <Field
                error={complaintErrors.complaintDescription?.[0]}
                label="Complaint Description"
                name="complaint-description"
              >
                <textarea
                  id="complaint-description"
                  onChange={(event) =>
                    setComplaint((current) => ({
                      ...current,
                      complaintDescription: event.target.value
                    }))
                  }
                  rows="5"
                  value={complaint.complaintDescription}
                />
              </Field>
              <button disabled={complaintBusy} type="submit">
                {complaintBusy ? "Securing report..." : "File complaint"}
              </button>
            </form>
          </Reveal>

          <Reveal className="section-copy complaint-copy" delay={110}>
            <p className="eyebrow">
              <BadgeCheck size={15} />
              Citizen complaint desk
            </p>
            <h2>Every disturbance becomes part of the official record.</h2>
            <p>
              Submit the location, identity, and description of any incident
              that threatens the cultivated calm. The complaint desk routes
              each report into the fictional civic archive.
            </p>
          </Reveal>
        </div>
      </section>

      <footer>
        <p>
          Fictional fan-made parody inspired by Homelander and The Boys
          universe. No official affiliation.
        </p>
      </footer>

      <ToastRail
        dismiss={(id) =>
          setNotifications((current) =>
            current.filter((notification) => notification.id !== id)
          )
        }
        notifications={notifications}
      />
    </main>
      </div>
  );
}
