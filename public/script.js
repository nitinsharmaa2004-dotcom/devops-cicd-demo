function formatUptime(totalSeconds) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${h}h ${m}m ${s}s`;
}

function setText(id, value) {
  document.getElementById(id).textContent = value;
}

async function loadServerInfo() {
  const badge = document.getElementById('status-badge');
  try {
    const [infoRes, healthRes] = await Promise.all([fetch('/api/info'), fetch('/health')]);
    if (!infoRes.ok || !healthRes.ok) throw new Error('Bad response from server');

    const info = await infoRes.json();
    const health = await healthRes.json();

    setText('info-hostname', info.hostname);
    setText('info-environment', info.environment);
    setText('info-node', info.nodeVersion);
    setText('info-platform', info.platform);
    setText('info-version', `v${info.version}`);
    setText('info-uptime', formatUptime(info.uptimeSeconds));
    setText('info-time', new Date(info.timestamp).toLocaleString());

    badge.classList.toggle('down', health.status !== 'UP');
    setText('status-text', health.status === 'UP' ? 'Running Successfully' : 'Unhealthy');
  } catch (err) {
    badge.classList.add('down');
    setText('status-text', 'Server Unreachable');
    console.error('Failed to load server info:', err);
  }
}

loadServerInfo();
setInterval(loadServerInfo, 10000);
