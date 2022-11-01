import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import {
  fetchBlockResult,
  fetchLatestBlocks,
  setAutoRefresh,
} from '../features/blockchain/blockchainSlice';
import UserOrderMatchedEvent from '../components/UserOrderMatchedEvent';
import { formatDate } from '../util';

function BlockRow({ height }) {
  const block = useSelector(state => state.blockchain.blocks[height]);
  const loaded = block && block.loaded;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loaded) {
      dispatch(fetchBlockResult(height));
    }
  }, [height, loaded, dispatch]);

  return (
    <tr
      className="h-[30px] hover:bg-gray-100 cursor-pointer transition"
      onClick={() => navigate(`/blocks/${height}`)}
    >
      <td className="px-2">{height}</td>
      <td className="px-2">
        {!loaded
          ? 'Loading...'
          : block.userOrderMatchedEvents.map(event => (
              <UserOrderMatchedEvent
                event={event}
                key={`${event.attributes.pair_id}:${event.attributes.order_id}`}
              />
            ))}
      </td>
      <td className="px-2">
        <time dateTime={block.time}>{formatDate(block.time)}</time>
      </td>
    </tr>
  );
}

export default function Root() {
  const intervalRef = useRef(null);
  const autoRefresh = useSelector(state => state.blockchain.autoRefresh);
  const latestBlockHeight = useSelector(
    state => state.blockchain.latestBlockHeight
  );
  const blockHeights = useSelector(state => state.blockchain.blockHeights);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchLatestBlocks());
  }, []);

  useEffect(() => {
    if (autoRefresh) {
      intervalRef.current = setInterval(() => {
        dispatch(fetchLatestBlocks());
      }, 5000);
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  }, [autoRefresh]);

  return (
    <div className="p-8">
      <div className="mb-3 flex justify-between">
        <span>
          <strong>Latest block height:</strong> {latestBlockHeight}
        </span>
        <label>
          <input
            type="checkbox"
            value="autorefresh"
            checked={autoRefresh}
            onChange={e => dispatch(setAutoRefresh(e.target.checked))}
          />{' '}
          Auto Refresh (5s)
        </label>
      </div>
      <table className="w-full border-collapse border border-gray-300">
        <thead className="border border-b-gray-300">
          <tr>
            <th className="px-2">Height</th>
            <th className="w-full px-2">Order Matches</th>
            <th className="px-2">Time</th>
          </tr>
        </thead>
        <tbody>
          {latestBlockHeight &&
            blockHeights.map(height => (
              <BlockRow height={height} key={height} />
            ))}
        </tbody>
      </table>
    </div>
  );
}
