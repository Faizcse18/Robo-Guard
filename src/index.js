const RESTRICTED_COMMANDS = {
  disable_safety: 5,
  override_limits: 5,
  leave_zone: 3,
  disable_logging: 5,
};

const DASHBOARD = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#0b0f19">
  <title>RoboGuard — Zero Trust for robot fleets</title>
  <style>
    :root{color-scheme:dark;--bg:#0b0f19;--card:#121826;--border:#1f2937;--text:#f3f4f6;--muted:#9ca3af;--green:#22c55e;--yellow:#f59e0b;--red:#ef4444;--blue:#3b82f6}
    *{box-sizing:border-box}
    body{margin:0;background:var(--bg);color:var(--text);font:16px/1.55 Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
    button,input,select{font:inherit}
    button{cursor:pointer;transition:background .3s,border-color .3s,color .3s,transform .3s,opacity .3s}
    button:hover{transform:translateY(-1px)}
    .sidebar{position:fixed;inset:0 auto 0 0;width:240px;padding:24px 16px;background:#0d121e;border-right:1px solid var(--border);display:flex;flex-direction:column;z-index:3}
    .brand{display:flex;align-items:center;gap:12px;padding:0 8px 28px}.shield{width:42px;height:42px;color:var(--green);background:#22c55e14;border:1px solid #22c55e35;border-radius:13px;display:grid;place-items:center}.brand-name{font-size:21px;font-weight:750;letter-spacing:-.04em}.brand-caption{font-size:13px;color:var(--muted)}
    .nav{display:grid;gap:6px}.nav-link{display:flex;align-items:center;gap:12px;width:100%;padding:12px;border:1px solid transparent;border-radius:9px;background:transparent;color:#aeb8ca;text-align:left;font-weight:600}.nav-link svg{width:19px;height:19px;flex:none}.nav-link:hover{background:#151d2c;color:var(--text)}.nav-link.active{color:#fff;background:#1b2638;border-color:#26354b}.nav-link.active svg{color:#60a5fa}
    .sidebar-bottom{margin-top:auto}.sidebar-bottom .btn{width:100%}.access-note{margin-top:16px;padding:12px;color:var(--muted);font-size:13px;border:1px solid var(--border);border-radius:9px}
    .main{margin-left:240px;min-height:100vh;padding:44px 48px}.content{max-width:1200px;margin:0 auto}.page-header{margin:0 0 30px}.page-header h1{font-size:32px;line-height:1.2;margin:0 0 8px;letter-spacing:-.04em}.page-header p{margin:0;color:var(--muted);font-size:17px}
    .screen{display:none;animation:appear .25s ease}.screen.active{display:block}@keyframes appear{from{opacity:.7;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}
    .card{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:26px;box-shadow:0 10px 32px #00000018}.card-title{display:flex;align-items:center;justify-content:space-between;gap:14px;margin-bottom:20px}.card h2{font-size:21px;margin:0;letter-spacing:-.02em}.subtle{color:var(--muted);font-size:16px}.stack{display:grid;gap:24px}.stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:24px}.stat-card{position:relative;overflow:hidden}.stat-card:after{content:"";position:absolute;width:110px;height:110px;right:-38px;top:-48px;border-radius:50%;background:var(--accent);opacity:.08}.stat-label{color:var(--muted);font-size:16px}.stat-value{font-size:38px;line-height:1.15;font-weight:750;margin-top:15px;letter-spacing:-.04em}.stat-accent{color:var(--accent)}
    .field{display:grid;gap:8px;margin:16px 0}.field label{color:#cbd5e1;font-weight:600}.field input,.field select{width:100%;background:#0b1220;border:1px solid #334155;border-radius:8px;color:var(--text);padding:12px;outline:none}.field input:focus,.field select:focus{border-color:var(--blue);box-shadow:0 0 0 3px #3b82f633}
    .form-grid{display:grid;grid-template-columns:1fr 1fr;gap:0 18px}.form-grid .wide{grid-column:1/-1}
    .btn{border:1px solid #334155;border-radius:8px;background:#1f2937;color:var(--text);padding:10px 14px;font-weight:650;white-space:nowrap}.btn:hover{background:#293548;border-color:#475569}.btn.primary{background:var(--blue);border-color:var(--blue);color:white}.btn.primary:hover{background:#2563eb}.btn.danger{color:#fecaca;border-color:#7f1d1d;background:#3a151b}.btn.danger:hover{background:#521a22}.btn:disabled{opacity:.5;cursor:not-allowed;transform:none}
    .table-wrap{overflow-x:auto}table{width:100%;border-collapse:collapse;min-width:680px}th{text-align:left;color:var(--muted);font-size:15px;font-weight:600;padding:13px 14px;border-bottom:1px solid var(--border);white-space:nowrap}td{padding:15px 14px;border-bottom:1px solid var(--border);font-size:16px;vertical-align:top}tr:last-child td{border-bottom:0}
    .badge{display:inline-flex;align-items:center;gap:7px;border-radius:99px;padding:5px 11px;font-size:14px;font-weight:700;text-transform:capitalize}.badge:before{content:"";width:8px;height:8px;border-radius:50%;background:currentColor}.active{color:var(--green);background:#22c55e18}.suspended{color:var(--yellow);background:#f59e0b18}.revoked{color:var(--red);background:#ef444418}
    .score{min-width:120px}.score-head{display:flex;justify-content:space-between;font-size:14px;margin-bottom:7px}.meter{height:8px;background:#263244;border-radius:9px;overflow:hidden}.meter span{height:100%;display:block;border-radius:9px;width:0;transition:width .5s,background .5s}
    .robot-line{margin-bottom:7px}.robot-line:last-child{margin-bottom:0}.robot-line small{display:block;color:var(--muted);font-size:14px}
    .row-actions{display:flex;gap:7px;flex-wrap:wrap}.row-actions .btn{padding:7px 10px;font-size:14px}
    .feed{display:grid}.feed-row{display:grid;grid-template-columns:minmax(140px,1fr) minmax(100px,.8fr) auto auto;gap:16px;align-items:center;padding:14px 4px;border-bottom:1px solid var(--border);font-size:16px}.feed-row:last-child{border-bottom:0}.feed-row.flash,.violation-row.flash{animation:flash 1.2s ease-out}@keyframes flash{from{background:#ef444433}to{background:transparent}}
    .points{color:#fca5a5;background:#ef44441a;border:1px solid #ef444433;border-radius:99px;padding:4px 10px;font-weight:700}.empty{color:var(--muted);padding:22px 4px;text-align:center}
    .sim-card{max-width:850px;margin:0 auto}.sim-top{display:grid;grid-template-columns:1fr 1fr;gap:18px}.status-panel{display:grid;place-items:center;text-align:center;padding:30px 12px;margin:10px 0 24px;border:1px solid var(--border);border-radius:12px;background:linear-gradient(145deg,#172033,#111827)}.indicator{width:112px;height:112px;border-radius:50%;display:grid;place-items:center;background:#22c55e18;border:2px solid var(--green);box-shadow:0 0 38px #22c55e4a;margin-bottom:18px;color:var(--green);transition:.3s}.indicator svg{width:48px}.indicator.stopped{color:var(--red);background:#ef444418;border-color:var(--red);box-shadow:0 0 38px #ef44444a;animation:shake .35s}.indicator.running{animation:pulse 2s infinite}.status-text{font-weight:800;font-size:24px;letter-spacing:.03em}.status-running{color:var(--green)}.status-stopped{color:var(--red)}@keyframes pulse{50%{box-shadow:0 0 48px #22c55e75}}@keyframes shake{25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}
    .command-group{margin-top:22px}.command-group h3{font-size:17px;margin:0 0 12px}.command-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}.command-normal{color:#bfdbfe;border-color:#1d4ed8;background:#172554}.command-normal:hover{background:#1e3a8a}.command-restricted{color:#fca5a5;border-color:#7f1d1d;background:transparent}.command-restricted:hover{background:#3a151b}
    .response-log{display:grid;gap:8px;max-height:230px;overflow:auto;margin-top:20px}.log-entry{padding:12px 14px;border:1px solid var(--border);border-radius:8px;color:#cbd5e1}.log-entry.allowed{border-left:3px solid var(--green)}.log-entry.blocked{border-left:3px solid var(--yellow)}.log-entry.error{border-left:3px solid var(--red)}.log-time{color:var(--muted);font-size:14px;margin-right:10px}
    .toast{position:fixed;right:24px;top:24px;z-index:5;max-width:min(460px,calc(100vw - 32px));padding:15px 19px;border:1px solid var(--border);border-radius:10px;background:#172033;box-shadow:0 15px 45px #0009;opacity:0;transform:translateX(120%);transition:.3s;pointer-events:none;font-weight:650}.toast.show{opacity:1;transform:translateX(0)}.toast.allowed{border-color:#22c55e;color:#86efac}.toast.blocked{border-color:#f59e0b;color:#fcd34d}.toast.error{border-color:#ef4444;color:#fca5a5}
    .architecture{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:32px;align-items:stretch}.arch-box{position:relative;min-height:180px;display:flex;flex-direction:column;justify-content:center;text-align:center}.arch-box:not(:last-child):after{content:"→";position:absolute;right:-27px;top:calc(50% - 20px);font-size:28px;color:#64748b}.arch-icon{font-size:30px;margin-bottom:14px}.arch-box h3{font-size:19px;margin:0 0 8px}.arch-box p{font-size:16px;color:var(--muted);margin:0}.arch-caption{text-align:center;color:var(--muted);margin:24px auto 0;max-width:760px}
    @media(max-width:1100px){.main{padding:36px 28px}.stats{grid-template-columns:repeat(2,minmax(0,1fr))}.architecture{gap:20px}.arch-box:not(:last-child):after{right:-20px}}
    @media(max-width:760px){.sidebar{position:sticky;inset:0 0 auto;width:100%;height:auto;padding:10px 12px;display:block;border-right:0;border-bottom:1px solid var(--border)}.brand{padding:0 5px 10px}.shield{width:34px;height:34px}.brand-name{font-size:18px}.brand-caption,.access-note,.sidebar-bottom{display:none}.nav{display:flex;gap:5px;overflow-x:auto}.nav-link{width:auto;flex:none;padding:9px}.nav-link svg{width:17px;height:17px}.main{margin:0;padding:28px 18px}.page-header{margin-bottom:22px}.page-header h1{font-size:28px}.card{padding:20px}.architecture{grid-template-columns:1fr;gap:14px}.arch-box{min-height:130px}.arch-box:not(:last-child):after{content:"↓";right:auto;left:calc(50% - 9px);top:auto;bottom:-28px;z-index:1}.feed-row{grid-template-columns:1fr auto;gap:8px}.feed-row .feed-time{grid-column:1}.sim-top{grid-template-columns:1fr}}
    @media(max-width:480px){.stats{grid-template-columns:1fr 1fr;gap:12px}.stat-card{padding:17px}.stat-value{font-size:30px}.command-grid{grid-template-columns:1fr 1fr}.form-grid{grid-template-columns:1fr}.form-grid .wide{grid-column:auto}.page-header h1{font-size:25px}}
    @media(prefers-reduced-motion:reduce){*,*:before,*:after{animation-duration:.01ms!important;transition-duration:.01ms!important}}
  </style>
</head>
<body>
  <aside class="sidebar">
    <div class="brand"><div class="shield" aria-hidden="true"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"/><path d="m9 12 2 2 4-4"/></svg></div><div><div class="brand-name">RoboGuard</div><div class="brand-caption">Zero Trust licensing</div></div></div>
    <nav class="nav" aria-label="Main navigation">
      <button class="nav-link active" data-screen="overview"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>Overview</button>
      <button class="nav-link" data-screen="companies"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 21h18M5 21V7l7-4 7 4v14M9 10h.01M15 10h.01M9 14h.01M15 14h.01M10 21v-4h4v4"/></svg>Companies</button>
      <button class="nav-link" data-screen="simulator"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="5" y="7" width="14" height="13" rx="3"/><path d="M9 7V4h6v3M9 12h.01M15 12h.01M9 16h6M12 2v2M3 12h2M19 12h2"/></svg>Robot Simulator</button>
      <button class="nav-link" data-screen="violations"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m12 3 10 18H2L12 3Z"/><path d="M12 9v5M12 18h.01"/></svg>Violations</button>
      <button class="nav-link" data-screen="architecture"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="7" height="6" rx="1"/><rect x="14" y="3" width="7" height="6" rx="1"/><rect x="8" y="15" width="8" height="6" rx="1"/><path d="M6.5 9v3h11V9M12 12v3"/></svg>Architecture</button>
    </nav>
    <div class="sidebar-bottom"><button id="resetButton" class="btn danger">Reset Demo</button><div class="access-note">Protected by Cloudflare Access<br>Every command is verified</div></div>
  </aside>
  <main class="main"><div class="content">
    <section id="screen-overview" class="screen active">
      <div class="page-header"><h1>Overview</h1><p>Your fleet's licensing and security at a glance.</p></div>
      <div class="stack">
        <div class="stats">
          <article class="card stat-card" style="--accent:#22c55e"><div class="stat-label">Active licenses</div><div class="stat-value stat-accent" id="statActive">—</div></article>
          <article class="card stat-card" style="--accent:#f59e0b"><div class="stat-label">Suspended</div><div class="stat-value stat-accent" id="statSuspended">—</div></article>
          <article class="card stat-card" style="--accent:#ef4444"><div class="stat-label">Revoked</div><div class="stat-value stat-accent" id="statRevoked">—</div></article>
          <article class="card stat-card" style="--accent:#60a5fa"><div class="stat-label">Total violations</div><div class="stat-value stat-accent" id="statViolations">—</div></article>
        </div>
        <article class="card"><div class="card-title"><h2>Recent violations</h2><span class="subtle">Latest 5 events</span></div><div class="feed" id="recentViolations"><div class="empty">Loading activity…</div></div></article>
      </div>
    </section>
    <section id="screen-companies" class="screen">
      <div class="page-header"><h1>Companies</h1><p>Issue licenses and manage each company's fleet access.</p></div>
      <div class="stack">
        <article class="card"><div class="card-title"><h2>Issue License</h2><span class="subtle">Create a company and robot</span></div>
          <form id="issueForm"><div class="form-grid">
            <div class="field"><label for="companyName">Company name</label><input id="companyName" name="name" required maxlength="120" placeholder="Example Robotics"></div>
            <div class="field"><label for="expiresAt">License expiry</label><input id="expiresAt" name="expires_at" type="date" required></div>
            <div class="field"><label for="robotId">Robot ID</label><input id="robotId" name="robot_id" required maxlength="80" placeholder="ROBO-01"></div>
            <div class="field"><label for="allowedCommands">Allowed commands</label><input id="allowedCommands" name="allowed_commands" value="move,stop,pickup,scan" required placeholder="move,stop,pickup,scan"></div>
          </div><button class="btn primary" type="submit">Issue License</button></form>
        </article>
        <article class="card"><div class="card-title"><h2>All companies</h2><span class="subtle">License status and risk score</span></div>
          <div class="table-wrap"><table><thead><tr><th>Company</th><th>Status / Risk</th><th>Expires</th><th>Robots</th><th>Actions</th></tr></thead><tbody id="companiesBody"><tr><td colspan="5" class="empty">Loading companies…</td></tr></tbody></table></div>
        </article>
      </div>
    </section>
    <section id="screen-simulator" class="screen">
      <div class="page-header"><h1>Robot Simulator</h1><p>Every command is re-verified against the live license.</p></div>
      <article class="card sim-card">
        <div class="sim-top"><div class="field"><label for="simCompany">Company</label><select id="simCompany"></select></div><div class="field"><label for="simRobot">Robot</label><select id="simRobot"></select></div></div>
        <div class="status-panel"><div id="indicator" class="indicator running"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"/><path d="m9 12 2 2 4-4"/></svg></div><div id="statusText" class="status-text status-running">RUNNING</div><div id="simCompanyStatus" class="subtle">Select a company and robot</div></div>
        <section class="command-group"><h3>Normal commands</h3><div class="command-grid">
          <button class="btn command-normal command" data-command="move">Move</button><button class="btn command-normal command" data-command="pickup">Pickup</button><button class="btn command-normal command" data-command="scan">Scan</button><button class="btn command-normal command" data-command="stop">Stop</button>
        </div></section>
        <section class="command-group"><h3>Restricted commands</h3><div class="command-grid">
          <button class="btn command-restricted command" data-command="disable_safety">Disable Safety</button><button class="btn command-restricted command" data-command="override_limits">Override Limits</button><button class="btn command-restricted command" data-command="leave_zone">Leave Zone</button><button class="btn command-restricted command" data-command="disable_logging">Disable Logging</button>
        </div></section>
        <section class="command-group"><h3>Command result log</h3><div id="commandLog" class="response-log"><div class="empty">Command results will appear here.</div></div></section>
      </article>
    </section>
    <section id="screen-violations" class="screen">
      <div class="page-header"><h1>Violations</h1><p>Recent restricted and unauthorized robot commands.</p></div>
      <article class="card"><div class="card-title"><h2>Violation history</h2><span class="subtle">Newest first · refreshes every 2 seconds</span></div><div class="table-wrap"><table><thead><tr><th>Time</th><th>Company</th><th>Robot</th><th>Command</th><th>Points</th></tr></thead><tbody id="violationsBody"><tr><td colspan="5" class="empty">Loading violations…</td></tr></tbody></table></div></article>
    </section>
    <section id="screen-architecture" class="screen">
      <div class="page-header"><h1>Architecture</h1><p>Every request passes through a live license check before reaching the fleet.</p></div>
      <div class="architecture">
        <article class="card arch-box"><div class="arch-icon">🤖</div><h3>Client / Robot</h3><p>Issues a command with its robot identity.</p></article>
        <article class="card arch-box"><div class="arch-icon">🛡️</div><h3>Cloudflare Access</h3><p>Protects the admin dashboard and API.</p></article>
        <article class="card arch-box"><div class="arch-icon">⚡</div><h3>Worker</h3><p>Checks license status, expiry, and command policy.</p></article>
        <article class="card arch-box"><div class="arch-icon">▤</div><h3>D1</h3><p>Stores licenses, robots, violations, and command logs.</p></article>
      </div>
      <p class="arch-caption">Access → Worker → D1. Every robot command is verified against current license state; repeated policy violations revoke the license and stop the fleet. The <strong>leave_zone</strong> command simulates a geofence violation.</p>
    </section>
  </div></main>
  <div id="toast" class="toast" role="status" aria-live="polite"></div>
  <script>
    const companiesBody = document.getElementById('companiesBody');
    const violationsBody = document.getElementById('violationsBody');
    const recentViolations = document.getElementById('recentViolations');
    const simCompany = document.getElementById('simCompany');
    const simRobot = document.getElementById('simRobot');
    let companies = [];
    let companyMarkup = '';
    let companyOptionsMarkup = '';
    let robotOptionsMarkup = '';
    let violationMarkup = '';
    let knownViolationIds = new Set();
    let toastTimer;
    let commandEntries = [];

    function escapeHtml(value) {
      return String(value == null ? '' : value).replace(/[&<>"']/g, function (char) {
        return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char];
      });
    }
    async function api(path, options) {
      const response = await fetch(path, Object.assign({headers:{'Content-Type':'application/json'}}, options || {}));
      const data = await response.json().catch(function () { return {error:'Invalid server response'}; });
      if (!response.ok) throw Object.assign(new Error(data.error || 'Request failed'), {status:response.status, data:data});
      return data;
    }
    function showToast(message, type) {
      const toast = document.getElementById('toast');
      toast.textContent = message;
      toast.className = 'toast show ' + type;
      clearTimeout(toastTimer);
      toastTimer = setTimeout(function () { toast.className = 'toast'; }, 3600);
    }
    function formatDate(value) {
      const date = new Date(value);
      return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
    }
    function relativeTime(value) {
      const normalized = value.indexOf('Z') === -1 ? value.replace(' ', 'T') + 'Z' : value;
      const seconds = Math.max(0, Math.floor((Date.now() - new Date(normalized).getTime()) / 1000));
      if (!Number.isFinite(seconds)) return value;
      if (seconds < 60) return seconds + 's ago';
      if (seconds < 3600) return Math.floor(seconds / 60) + 'm ago';
      if (seconds < 86400) return Math.floor(seconds / 3600) + 'h ago';
      return Math.floor(seconds / 86400) + 'd ago';
    }
    function updateStats() {
      const counts = companies.reduce(function (result, company) {
        result[company.status] = (result[company.status] || 0) + 1;
        return result;
      }, {});
      const values = {
        statActive:counts.active || 0,
        statSuspended:counts.suspended || 0,
        statRevoked:counts.revoked || 0,
        statViolations:knownViolationIds.size
      };
      Object.keys(values).forEach(function (id) {
        const element = document.getElementById(id);
        const value = String(values[id]);
        if (element.textContent !== value) element.textContent = value;
      });
    }
    function renderCompanies() {
      const signature = JSON.stringify(companies);
      if (signature !== companyMarkup) {
        const focused = document.activeElement && document.activeElement.matches('[data-action][data-id]')
          ? {action:document.activeElement.dataset.action, id:document.activeElement.dataset.id} : null;
        if (!companies.length) {
          companiesBody.innerHTML = '<tr><td colspan="5" class="empty">No licenses yet. Issue one above.</td></tr>';
        } else {
          companiesBody.innerHTML = companies.map(function (company) {
            const score = Math.max(0, Number(company.violation_score) || 0);
            const color = score >= 8 ? '#ef4444' : score >= 4 ? '#f59e0b' : '#22c55e';
            const robots = (company.robots || []).map(function (robot) {
              return '<div class="robot-line"><strong>' + escapeHtml(robot.id) + '</strong><small>' + escapeHtml(robot.allowed_commands) + '</small></div>';
            }).join('');
            return '<tr><td><strong>' + escapeHtml(company.name) + '</strong><div class="subtle">#' + company.id + '</div></td>' +
              '<td><span class="badge ' + escapeHtml(company.status) + '">' + escapeHtml(company.status) + '</span>' +
              '<div class="score" style="margin-top:12px"><div class="score-head"><span>Risk score</span><span>' + score + ' / 10</span></div><div class="meter"><span style="width:' + Math.min(100, score * 10) + '%;background:' + color + '"></span></div></div></td>' +
              '<td>' + escapeHtml(formatDate(company.expires_at)) + '</td><td>' + (robots || '<span class="subtle">No robots</span>') + '</td>' +
              '<td><div class="row-actions"><button class="btn" data-action="suspend" data-id="' + company.id + '">Suspend</button>' +
              '<button class="btn danger" data-action="revoke" data-id="' + company.id + '">Revoke</button>' +
              '<button class="btn" data-action="reinstate" data-id="' + company.id + '">Reinstate</button></div></td></tr>';
          }).join('');
        }
        companyMarkup = signature;
        if (focused) {
          const replacement = companiesBody.querySelector('[data-action="' + focused.action + '"][data-id="' + focused.id + '"]');
          if (replacement) replacement.focus();
        }
      }
      const options = companies.map(function (company) {
        return '<option value="' + company.id + '">' + escapeHtml(company.name) + ' · ' + escapeHtml(company.status) + '</option>';
      }).join('') || '<option value="">No companies</option>';
      if (options !== companyOptionsMarkup) {
        const previous = simCompany.value;
        const preserveFocus = document.activeElement === simCompany;
        simCompany.innerHTML = options;
        if (companies.some(function (company) { return String(company.id) === previous; })) simCompany.value = previous;
        if (preserveFocus) simCompany.focus();
        companyOptionsMarkup = options;
      }
      renderRobots();
      updateStats();
    }
    function renderRobots() {
      const company = companies.find(function (item) { return String(item.id) === simCompany.value; });
      const robots = company ? company.robots : [];
      const options = robots.map(function (robot) {
        return '<option value="' + escapeHtml(robot.id) + '">' + escapeHtml(robot.id) + '</option>';
      }).join('') || '<option value="">No robots</option>';
      const signature = simCompany.value + ':' + options;
      if (signature !== robotOptionsMarkup) {
        const previous = simRobot.value;
        const preserveFocus = document.activeElement === simRobot;
        simRobot.innerHTML = options;
        if (robots.some(function (robot) { return robot.id === previous; })) simRobot.value = previous;
        if (preserveFocus) simRobot.focus();
        robotOptionsMarkup = signature;
      }
    }
    async function loadCompanies() {
      try {
        companies = await api('/admin/companies');
        renderCompanies();
        await updateRobotStatus();
      } catch (error) {
        if (!companyMarkup) companiesBody.innerHTML = '<tr><td colspan="5" class="empty">' + escapeHtml(error.message) + '</td></tr>';
      }
    }
    function updateRelativeTimes() {
      document.querySelectorAll('[data-time]').forEach(function (element) {
        const value = element.getAttribute('data-time');
        const relative = relativeTime(value);
        if (element.textContent !== relative) element.textContent = relative;
      });
    }
    function renderViolations(rows) {
      const signature = JSON.stringify(rows);
      if (signature !== violationMarkup) {
        const renderTable = function (items) {
          if (!items.length) return '<tr><td colspan="5" class="empty">No violations recorded.</td></tr>';
          return items.map(function (row) {
            const isNew = knownViolationIds.size > 0 && !knownViolationIds.has(row.id);
            return '<tr class="violation-row' + (isNew ? ' flash' : '') + '"><td><time data-time="' + escapeHtml(row.created_at) + '" title="' + escapeHtml(row.created_at) + '">' + escapeHtml(relativeTime(row.created_at)) + '</time></td>' +
              '<td>' + escapeHtml(row.company_name) + '</td><td>' + escapeHtml(row.robot_id) + '</td><td>' + escapeHtml(row.command) + '</td><td><span class="points">+' + row.points + '</span></td></tr>';
          }).join('');
        };
        violationsBody.innerHTML = renderTable(rows);
        if (rows.length) {
          recentViolations.innerHTML = rows.slice(0, 5).map(function (row) {
            const isNew = knownViolationIds.size > 0 && !knownViolationIds.has(row.id);
            return '<div class="feed-row' + (isNew ? ' flash' : '') + '"><strong>' + escapeHtml(row.company_name) + '</strong>' +
              '<span>' + escapeHtml(row.robot_id) + ' · ' + escapeHtml(row.command) + '</span><span class="points">+' + row.points + '</span>' +
              '<time class="subtle" data-time="' + escapeHtml(row.created_at) + '" title="' + escapeHtml(row.created_at) + '">' + escapeHtml(relativeTime(row.created_at)) + '</time></div>';
          }).join('');
        } else {
          recentViolations.innerHTML = '<div class="empty">No violations recorded.</div>';
        }
        knownViolationIds = new Set(rows.map(function (row) { return row.id; }));
        violationMarkup = signature;
        updateStats();
      }
      updateRelativeTimes();
    }
    async function loadViolations() {
      try {
        renderViolations(await api('/admin/violations'));
      } catch (error) {
        if (!violationMarkup) {
          violationsBody.innerHTML = '<tr><td colspan="5" class="empty">' + escapeHtml(error.message) + '</td></tr>';
          recentViolations.innerHTML = '<div class="empty">' + escapeHtml(error.message) + '</div>';
        }
      }
    }
    async function updateRobotStatus() {
      const robotId = simRobot.value;
      const text = document.getElementById('statusText');
      const indicator = document.getElementById('indicator');
      const company = companies.find(function (item) { return String(item.id) === simCompany.value; });
      const companyStatus = document.getElementById('simCompanyStatus');
      const nextCompanyStatus = company ? 'License: ' + company.status : 'Select a company and robot';
      if (companyStatus.textContent !== nextCompanyStatus) companyStatus.textContent = nextCompanyStatus;
      if (!robotId) {
        text.textContent = 'NO ROBOT SELECTED';
        text.className = 'status-text';
        indicator.className = 'indicator';
        return;
      }
      try {
        const status = await api('/robot/' + encodeURIComponent(robotId) + '/status');
        const running = status.state === 'running' && status.company_status === 'active';
        const nextText = running ? 'RUNNING' : status.company_status === 'revoked' ? 'STOPPED - LICENSE REVOKED' : 'STOPPED';
        const nextClass = 'status-text ' + (running ? 'status-running' : 'status-stopped');
        const nextIndicator = 'indicator ' + (running ? 'running' : 'stopped');
        if (text.textContent !== nextText) text.textContent = nextText;
        if (text.className !== nextClass) text.className = nextClass;
        if (indicator.className !== nextIndicator) indicator.className = nextIndicator;
      } catch (error) {
        text.textContent = error.message;
        text.className = 'status-text status-stopped';
        indicator.className = 'indicator stopped';
      }
    }
    function addCommandEntry(command, message, type) {
      commandEntries.unshift({time:new Date().toLocaleTimeString(), command:command, message:message, type:type});
      commandEntries = commandEntries.slice(0, 10);
      document.getElementById('commandLog').innerHTML = commandEntries.map(function (entry) {
        return '<div class="log-entry ' + entry.type + '"><span class="log-time">' + escapeHtml(entry.time) + '</span><strong>' + escapeHtml(entry.command) + '</strong> · ' + escapeHtml(entry.message) + '</div>';
      }).join('');
    }
    document.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        document.querySelectorAll('.nav-link').forEach(function (item) { item.classList.toggle('active', item === link); });
        document.querySelectorAll('.screen').forEach(function (screen) {
          screen.classList.toggle('active', screen.id === 'screen-' + link.dataset.screen);
        });
      });
    });
    document.getElementById('issueForm').addEventListener('submit', async function (event) {
      event.preventDefault();
      const form = event.currentTarget;
      const commands = document.getElementById('allowedCommands').value.split(',').map(function (item) { return item.trim(); }).filter(Boolean);
      try {
        await api('/admin/companies', {method:'POST', body:JSON.stringify({
          name:document.getElementById('companyName').value,
          expires_at:new Date(document.getElementById('expiresAt').value + 'T23:59:59.000Z').toISOString(),
          robots:[{id:document.getElementById('robotId').value, allowed_commands:commands}]
        })});
        form.reset();
        document.getElementById('allowedCommands').value = 'move,stop,pickup,scan';
        showToast('License issued successfully', 'allowed');
        await loadCompanies();
      } catch (error) { showToast(error.message, 'error'); }
    });
    document.getElementById('companiesBody').addEventListener('click', async function (event) {
      const button = event.target.closest('button[data-action]');
      if (!button) return;
      const action = button.dataset.action;
      if (action === 'revoke' && !confirm('Revoke this license and stop all its robots?')) return;
      try {
        await api('/admin/companies/' + button.dataset.id + '/' + action, {method:'POST'});
        const labels = {suspend:'License suspended', revoke:'License revoked', reinstate:'License reinstated'};
        showToast(labels[action], action === 'revoke' ? 'error' : action === 'suspend' ? 'blocked' : 'allowed');
        await loadCompanies();
      } catch (error) { showToast(error.message, 'error'); }
    });
    document.getElementById('resetButton').addEventListener('click', async function () {
      if (!confirm('Reset the demo? All violations and command logs will be cleared.')) return;
      try {
        await api('/admin/reset', {method:'POST', body:'{}'});
        knownViolationIds = new Set();
        violationMarkup = '';
        companyMarkup = '';
        showToast('Demo reset', 'allowed');
        await Promise.all([loadCompanies(), loadViolations()]);
      } catch (error) { showToast(error.message, 'error'); }
    });
    document.querySelectorAll('.command').forEach(function (button) {
      button.addEventListener('click', async function () {
        const robotId = simRobot.value;
        const command = button.dataset.command;
        if (!robotId) {
          showToast('Select a robot first', 'error');
          addCommandEntry(command, 'No robot selected', 'error');
          return;
        }
        try {
          await api('/robot/command', {method:'POST', body:JSON.stringify({robot_id:robotId, command:command})});
          addCommandEntry(command, 'Allowed', 'allowed');
          showToast('Allowed: ' + command, 'allowed');
        } catch (error) {
          const blocked = error.message === 'Restricted command blocked' || error.message === 'Command not allowed';
          const type = blocked ? 'blocked' : error.status === 403 ? 'error' : 'blocked';
          const message = error.status === 403 && !blocked ? '403 ' + error.message : error.message;
          addCommandEntry(command, message + (error.data && error.data.score != null ? ' · score ' + error.data.score + '/10' : ''), type);
          showToast(blocked ? 'Blocked: ' + error.message : error.status === 403 ? '403 ' + error.message : error.message, type);
        }
        await Promise.all([loadCompanies(), loadViolations()]);
      });
    });
    simCompany.addEventListener('change', function () { robotOptionsMarkup = ''; renderRobots(); updateRobotStatus(); });
    simRobot.addEventListener('change', updateRobotStatus);
    loadCompanies();
    loadViolations();
    updateRobotStatus();
    setInterval(function () { loadCompanies(); loadViolations(); }, 2000);
  </script>
</body>
</html>`;

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

async function readJson(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

function isValidFutureDate(value) {
  if (typeof value !== "string" || !value.trim()) return false;
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) && timestamp > Date.now();
}

async function requireAdmin(request, env) {
  if (env.DEV_MODE === "true") return null;
  if (!request.headers.get("Cf-Access-Jwt-Assertion")) {
    return json({ error: "Unauthorized" }, 401);
  }
  // TODO: Verify the JWT signature and claims against the Cloudflare Access team JWKS.
  return null;
}

async function command(request, env) {
  const body = await readJson(request);
  if (!body || typeof body.robot_id !== "string" || !body.robot_id.trim() ||
      typeof body.command !== "string" || !body.command.trim()) {
    return json({ error: "robot_id and command are required" }, 400);
  }

  const robot = await env.DB.prepare(
    "SELECT r.id, r.company_id, r.allowed_commands, r.state, c.status, c.violation_score, c.expires_at " +
    "FROM robots r JOIN companies c ON c.id = r.company_id WHERE r.id = ?"
  ).bind(body.robot_id.trim()).first();
  if (!robot) return json({ error: "Robot not found" }, 404);

  if (robot.status === "revoked") return json({ error: "License revoked" }, 403);
  if (robot.status === "suspended") return json({ error: "License suspended" }, 403);
  if (Date.parse(robot.expires_at) < Date.now()) return json({ error: "License expired" }, 403);

  const requestedCommand = body.command.trim();
  const points = RESTRICTED_COMMANDS[requestedCommand];
  const allowedCommands = robot.allowed_commands.split(",").map((item) => item.trim());
  if (points || !allowedCommands.includes(requestedCommand)) {
    const violationPoints = points || 1;
    await env.DB.batch([
      env.DB.prepare(
        "INSERT INTO violations (company_id, robot_id, command, points) VALUES (?, ?, ?, ?)"
      ).bind(robot.company_id, robot.id, requestedCommand, violationPoints),
      env.DB.prepare(
        "UPDATE companies SET violation_score = violation_score + ? WHERE id = ?"
      ).bind(violationPoints, robot.company_id),
    ]);
    const updated = await env.DB.prepare(
      "SELECT violation_score FROM companies WHERE id = ?"
    ).bind(robot.company_id).first();
    if (updated.violation_score >= 10) {
      await env.DB.batch([
        env.DB.prepare("UPDATE companies SET status = 'revoked' WHERE id = ?").bind(robot.company_id),
        env.DB.prepare("UPDATE robots SET state = 'stopped' WHERE company_id = ?").bind(robot.company_id),
      ]);
      return json({ error: "License revoked" }, 403);
    }
    if (points) {
      return json({ error: "Restricted command blocked", score: updated.violation_score }, 403);
    }
    return json({ error: "Command not allowed", score: updated.violation_score }, 403);
  }

  await env.DB.prepare(
    "INSERT INTO command_log (company_id, robot_id, command, result) VALUES (?, ?, ?, ?)"
  ).bind(robot.company_id, robot.id, requestedCommand, "allowed").run();
  return json({ ok: true });
}

async function listCompanies(env) {
  const { results: companies } = await env.DB.prepare(
    "SELECT id, name, status, violation_score, expires_at FROM companies ORDER BY id"
  ).all();
  const { results: robots } = await env.DB.prepare(
    "SELECT id, company_id, allowed_commands, state FROM robots ORDER BY company_id, id"
  ).all();
  const robotsByCompany = new Map();
  for (const robot of robots) {
    if (!robotsByCompany.has(robot.company_id)) robotsByCompany.set(robot.company_id, []);
    robotsByCompany.get(robot.company_id).push(robot);
  }
  return companies.map((company) => ({
    ...company,
    robots: robotsByCompany.get(company.id) || [],
  }));
}

async function createCompany(request, env) {
  const body = await readJson(request);
  if (!body || typeof body.name !== "string" || !body.name.trim() ||
      !isValidFutureDate(body.expires_at) || !Array.isArray(body.robots) || body.robots.length < 1) {
    return json({ error: "Provide a name, future expires_at date, and at least one robot" }, 400);
  }

  const robotIds = [];
  const robots = [];
  for (const robot of body.robots) {
    if (!robot || typeof robot.id !== "string" || !robot.id.trim() ||
        (typeof robot.allowed_commands !== "string" && !Array.isArray(robot.allowed_commands))) {
      return json({ error: "Each robot requires an id and allowed_commands" }, 400);
    }
    const id = robot.id.trim();
    const commands = (Array.isArray(robot.allowed_commands) ? robot.allowed_commands : robot.allowed_commands.split(","))
      .map((item) => String(item).trim()).filter(Boolean);
    robotIds.push(id);
    robots.push({ id, allowed_commands: commands.join(",") });
  }
  if (new Set(robotIds).size !== robotIds.length) {
    return json({ error: "Robot ids must be unique" }, 400);
  }
  const existing = await env.DB.prepare(
    "SELECT id FROM robots WHERE id IN (" + robotIds.map(() => "?").join(",") + ") LIMIT 1"
  ).bind(...robotIds).first();
  if (existing) return json({ error: "A robot id is already in use" }, 409);

  const companyResult = await env.DB.prepare(
    "INSERT INTO companies (name, status, violation_score, expires_at) VALUES (?, 'active', 0, ?)"
  ).bind(body.name.trim(), new Date(body.expires_at).toISOString()).run();
  const companyId = companyResult.meta.last_row_id;
  const statements = [];
  for (const robot of robots) {
    statements.push(env.DB.prepare(
      "INSERT INTO robots (id, company_id, allowed_commands) VALUES (?, ?, ?)"
    ).bind(robot.id, companyId, robot.allowed_commands));
  }
  await env.DB.batch(statements);
  const company = await env.DB.prepare(
    "SELECT id, name, status, violation_score, expires_at FROM companies WHERE id = ?"
  ).bind(companyId).first();
  company.robots = robots.map((robot) => ({ ...robot, company_id: company.id, state: "running" }));
  return json(company, 201);
}

async function handle(request, env) {
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method.toUpperCase();

  if (path === "/" && method === "GET") {
    return new Response(DASHBOARD, { headers: { "Content-Type": "text/html; charset=utf-8" } });
  }

  if (path.startsWith("/admin/")) {
    const denied = await requireAdmin(request, env);
    if (denied) return denied;
  }

  if (path === "/robot/command" && method === "POST") return command(request, env);

  if (path === "/admin/companies" && method === "GET") {
    return json(await listCompanies(env));
  }
  if (path === "/admin/companies" && method === "POST") {
    return createCompany(request, env);
  }
  if (path === "/admin/violations" && method === "GET") {
    const { results } = await env.DB.prepare(
      "SELECT v.id, v.company_id, c.name AS company_name, v.robot_id, v.command, v.points, v.created_at " +
      "FROM violations v JOIN companies c ON c.id = v.company_id ORDER BY v.created_at DESC, v.id DESC LIMIT 50"
    ).all();
    return json(results);
  }
  if (path === "/admin/reset" && method === "POST") {
    await env.DB.batch([
      env.DB.prepare("UPDATE companies SET status = 'active', violation_score = 0"),
      env.DB.prepare("UPDATE robots SET state = 'running'"),
      env.DB.prepare("DELETE FROM violations"),
      env.DB.prepare("DELETE FROM command_log"),
    ]);
    return json({ ok: true });
  }

  const companyAction = path.match(/^\/admin\/companies\/(\d+)\/(suspend|revoke|reinstate)$/);
  if (companyAction && method === "POST") {
    const id = Number(companyAction[1]);
    const action = companyAction[2];
    const company = await env.DB.prepare("SELECT id FROM companies WHERE id = ?").bind(id).first();
    if (!company) return json({ error: "Company not found" }, 404);
    if (action === "suspend") {
      await env.DB.prepare("UPDATE companies SET status = 'suspended' WHERE id = ?").bind(id).run();
    } else if (action === "revoke") {
      await env.DB.batch([
        env.DB.prepare("UPDATE companies SET status = 'revoked' WHERE id = ?").bind(id),
        env.DB.prepare("UPDATE robots SET state = 'stopped' WHERE company_id = ?").bind(id),
      ]);
    } else {
      await env.DB.batch([
        env.DB.prepare("UPDATE companies SET status = 'active', violation_score = 0 WHERE id = ?").bind(id),
        env.DB.prepare("UPDATE robots SET state = 'running' WHERE company_id = ?").bind(id),
      ]);
    }
    return json({ ok: true });
  }

  const robotStatus = path.match(/^\/robot\/([^/]+)\/status$/);
  if (robotStatus && method === "GET") {
    const robot = await env.DB.prepare(
      "SELECT r.state, c.status AS company_status FROM robots r JOIN companies c ON c.id = r.company_id WHERE r.id = ?"
    ).bind(decodeURIComponent(robotStatus[1])).first();
    if (!robot) return json({ error: "Robot not found" }, 404);
    return json(robot);
  }

  return json({ error: "Not found" }, 404);
}

export default {
  async fetch(request, env) {
    try {
      return await handle(request, env);
    } catch (error) {
      console.error("RoboGuard request failed:", error);
      return json({ error: "Internal server error" }, 500);
    }
  },
};
