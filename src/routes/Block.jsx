import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import api from '../api';
import UserOrderMatchedEvent from '../components/UserOrderMatchedEvent';

function Event({ type, attributes }) {
  return (
    <div className="my-2 px-3 py-1 rounded border border-gray-200 shadow">
      <div className="mb-1 font-bold">{type}</div>
      <ul className="text-sm">
        {attributes.map(({ key, value }) => (
          <li
            className="inline-block m-0.5 pl-2 bg-gray-100 rounded-full"
            key={key}
          >
            <b>{atob(key)} </b>
            <span className="inline-block px-2 rounded-full bg-gray-200">
              {atob(value)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Block() {
  const { height } = useParams();
  const [typeFilter, setTypeFilter] = useState('');
  const [userOrderMatchedEvents, setUserOrderMatchedEvents] = useState([]);
  const [data, setData] = useState(null);

  const filteredBeginBlockEvents =
    data && data.begin_block_events
      ? data.begin_block_events
          .filter(event => event.type.includes(typeFilter))
          .map(event => (
            <Event type={event.type} attributes={event.attributes} />
          ))
      : [];
  const filteredEndBlockEvents =
    data && data.end_block_events
      ? data.end_block_events
          .filter(event => event.type.includes(typeFilter))
          .map(event => (
            <Event type={event.type} attributes={event.attributes} />
          ))
      : [];

  useEffect(() => {
    (async () => {
      const { userOrderMatchedEvents, data } = await api.fetchBlockResult(
        height
      );
      setUserOrderMatchedEvents(userOrderMatchedEvents);
      setData(data);
    })();
  }, [height]);

  return (
    <div className="p-8">
      <h1 className="mb-8 text-4xl font-bold">Block #{height}</h1>
      <h2 className="mb-2 text-2xl font-bold">
        Order Matches ({userOrderMatchedEvents && userOrderMatchedEvents.length}
        )
      </h2>
      {userOrderMatchedEvents.map(event => (
        <UserOrderMatchedEvent event={event} />
      ))}
      <div className="my-4 text-right">
        <input
          className="min-w-[300px] px-2 py-1 border-2 rounded-lg"
          placeholder="Search for event type..."
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
        />
      </div>
      <details className="mb-4">
        <summary className="text-2xl font-bold">
          Begin Block Events ({filteredBeginBlockEvents.length} /{' '}
          {data && data.begin_block_events && data.begin_block_events.length})
        </summary>
        {filteredBeginBlockEvents}
      </details>
      <details>
        <summary className="text-2xl font-bold">
          End Block Events ({filteredEndBlockEvents.length} /{' '}
          {data && data.end_block_events && data.end_block_events.length})
        </summary>
        {filteredEndBlockEvents}
      </details>
    </div>
  );
}
