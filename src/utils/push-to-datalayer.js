export default function (eventData) {
  if (window.dataLayer) return window.dataLayer.push(eventData);
}
