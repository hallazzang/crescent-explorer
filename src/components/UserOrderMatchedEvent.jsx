import { formatAddress, formatCoin } from '../util';

export default function UserOrderMatchedEvent({ event }) {
  const { order_direction, orderer, pair_id, paid_coin, received_coin } =
    event.attributes;
  const color =
    order_direction === 'ORDER_DIRECTION_BUY' ? 'bg-green-600' : 'bg-red-600';
  return (
    <div className="inline-block m-0.5 pl-2 text-sm rounded-full bg-gray-200">
      {pair_id}: {formatAddress(orderer)}{' '}
      <div className={`inline-block px-2 rounded-full ${color} text-white`}>
        {formatCoin(
          order_direction === 'ORDER_DIRECTION_BUY' ? received_coin : paid_coin
        )}
      </div>
    </div>
  );
}
