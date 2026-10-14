(() => {
  const DEFAULT_API = 'http://localhost:8000';
  const roomTypes = ['Entire home/apt', 'Private room', 'Shared room'];
  const colors = { 'Entire home/apt': '#003884', 'Private room': '#FF6600', 'Shared room': '#0284C7' };
  const form = document.querySelector('#predict-form');
  const toggle = document.querySelector('#config-toggle');
  const panel = document.querySelector('#config-panel');
  const apiInput = document.querySelector('#api-url');
  const footerEndpoint = document.querySelector('#footer-endpoint');
  const submit = document.querySelector('#submit-button');
  const spinner = submit.querySelector('.spinner');
  let apiUrl = (localStorage.getItem('roomPredictorApiUrl') || DEFAULT_API).replace(/\/+$/, '');

  apiInput.value = apiUrl;
  footerEndpoint.textContent = apiUrl;
  toggle.addEventListener('click', () => { const open = panel.hidden; panel.hidden = !open; toggle.setAttribute('aria-expanded', String(open)); });
  document.querySelector('#api-save').addEventListener('click', () => { apiUrl = (apiInput.value.trim() || DEFAULT_API).replace(/\/+$/, ''); apiInput.value = apiUrl; localStorage.setItem('roomPredictorApiUrl', apiUrl); footerEndpoint.textContent = apiUrl; panel.hidden = true; toggle.setAttribute('aria-expanded', 'false'); });

  function surrogate(data) {
    let entire = .35, privateRoom = .25, shared = -1.8;
    const price = data.price, nights = data.minimum_nights, listings = data.calculated_host_listings_count, availability = data.availability_365;
    if (price < 38) { shared += 4; privateRoom += .6; entire -= 3.5; }
    else if (price <= 52) { if (listings >= 3 || nights === 1) { shared += 3.2; privateRoom += .8; } else { shared += 1.6; privateRoom += 1.9; } entire -= 2.2; }
    else if (price < 110) { privateRoom += 2.4; shared -= .5; entire -= .6; }
    else if (price < 160) { privateRoom += .8; entire += 1.2; shared -= 2.5; }
    else if (price < 250) { entire += 2.6; privateRoom -= 1.2; shared -= 4; }
    else { entire += 4.2; privateRoom -= 2.8; shared -= 6; }
    if (nights >= 30) { entire += 1.8; privateRoom += .2; shared -= 1.5; } else if (nights >= 5) { entire += .9; privateRoom -= .3; shared -= 1; } else if (nights === 1) { privateRoom += .3; shared += .8; entire -= .3; }
    if (listings >= 4) { shared += 1.6; privateRoom += .4; entire -= .4; } else if (listings === 1) { entire += .6; privateRoom += .4; shared -= 1; }
    if (availability > 300) { privateRoom += .5; shared += .8; } else if (availability < 60) entire += .5;
    if (data.neighbourhood_group === 'Manhattan') entire += .4; else if (['Queens', 'Bronx'].includes(data.neighbourhood_group)) privateRoom += .6;
    const scores = [entire, privateRoom, shared], exps = scores.map(Math.exp), sum = exps.reduce((a, b) => a + b, 0);
    return roomTypes.map((name, i) => ({ name, pct: Math.round(exps[i] / sum * 1000) / 10 })).sort((a, b) => b.pct - a.pct);
  }
  function showResult(predictedType, probabilities) {
    document.querySelector('#result-empty').hidden = true; document.querySelector('#result-error').hidden = true;
    const body = document.querySelector('#result-body'), title = document.querySelector('#result-type'), bars = document.querySelector('#result-bars');
    body.hidden = false; title.textContent = predictedType; title.style.color = colors[predictedType] || colors['Entire home/apt'];
    bars.replaceChildren(...probabilities.map(({ name, pct }) => { const row = document.createElement('div'); row.className = 'probability'; row.innerHTML = `<div class="probability__label"><span><i class="swatch" style="background:${colors[name]}"></i>${name}</span><span class="percentage">${Number(pct).toFixed(1)}%</span></div><div class="bar-track"><div class="bar-fill" style="width:0;background:${colors[name]}"></div></div>`; requestAnimationFrame(() => { row.querySelector('.bar-fill').style.width = `${pct}%`; }); return row; }));
  }
  function showError(message) { document.querySelector('#result-empty').hidden = true; document.querySelector('#result-body').hidden = true; const error = document.querySelector('#result-error'); error.textContent = message; error.hidden = false; }
  form.addEventListener('submit', async (event) => {
    event.preventDefault(); const error = document.querySelector('#form-error'); error.textContent = '';
    const data = Object.fromEntries(new FormData(form));
    for (const key of ['latitude','longitude','price','minimum_nights','number_of_reviews','reviews_per_month','calculated_host_listings_count','availability_365']) { data[key] = Number(data[key]); if (!Number.isFinite(data[key])) { error.textContent = `Check the "${key.replaceAll('_', ' ')}" field: it needs a number.`; return; } }
    if (Object.values(data).some(value => value === '')) { error.textContent = 'All fields are required.'; return; }
    submit.disabled = true; spinner.hidden = false;
    try { const controller = new AbortController(), timeout = setTimeout(() => controller.abort(), 2500); const response = await fetch(`${apiUrl}/predict`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data), signal:controller.signal }); clearTimeout(timeout); if (!response.ok) throw new Error(`The API responded with status ${response.status}.`); const result = await response.json(), raw = Array.isArray(result.Probability) ? result.Probability[0] : null; const probabilities = Array.isArray(raw) && raw.length === 3 ? roomTypes.map((name, i) => ({name, pct: Math.round(Number(raw[i]) * 1000) / 10})).sort((a,b) => b.pct-a.pct) : surrogate(data); showResult(result.Predicted_room_type || probabilities[0].name, probabilities); }
    catch (err) { if (err instanceof TypeError || err.name === 'AbortError') { const probabilities = surrogate(data); showResult(probabilities[0].name, probabilities); } else showError(err.message || String(err)); }
    finally { submit.disabled = false; spinner.hidden = true; }
  });
})();
