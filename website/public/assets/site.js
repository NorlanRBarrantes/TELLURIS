/* Offline research-question drafting only: no NASA requests, data analysis or tracking. */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('research-form');
  if (!form) return;
  const output = document.getElementById('research-result');
  let config;
  try { config = JSON.parse(form.dataset.config); } catch { return; }
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const placeKey = form.elements.point.value;
    const variableKey = form.elements.variable.value;
    if (!['liberia','limon'].includes(placeKey) || !['temperature','precipitation'].includes(variableKey)) return;
    output.textContent = config.resultTemplate
      .replace('{place}', config[placeKey])
      .replace('{variable}', config[variableKey])
      .replace('{period}', config.period);
  });
});
