export function transformEvent(event) {
  const { type, attributes } = event;
  return {
    type,
    attributes: Object.fromEntries(
      attributes.map(({ key, value }) => [atob(key), atob(value)])
    ),
  };
}

export function formatAddress(address) {
  return address.slice(0, 9) + '...' + address.slice(-5);
}

export function formatCoin(coin) {
  const [_, amount, denom] = coin.split(/^(\d+)/);
  return `${amount}${formatDenom(denom)}`;
}

export function formatDenom(denom) {
  if (denom.length <= 10) {
    return denom;
  }
  return denom.slice(0, 8) + '...' + denom.slice(-4);
}

export function formatDate(date) {
  return new Date(date).toLocaleTimeString('en-US', { hour12: false });
}
