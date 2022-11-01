import { transformEvent } from './util';

async function fetchBlockResult(height) {
  const resp = await fetch(
    `https://mainnet.crescent.network:26657/block_results?height=${height}`
  );
  const data = await resp.json();
  const userOrderMatchedEvents = (data.result.end_block_events || [])
    .filter(({ type }) => type === 'user_order_matched')
    .map(transformEvent);
  return { data: data.result, userOrderMatchedEvents };
}

export default {
  fetchBlockResult,
};
