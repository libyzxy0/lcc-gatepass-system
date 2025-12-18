import { useState, useEffect } from 'react';
import { getVisits } from '@/api/helper/get-visits'

export const useVisits = () => {
  const [fetching, setFetching] = useState(true);
  const [visits, setVisits] = useState([]);

  const fetchVisits = async () => {
    setFetching(true);
    const visitList = await getVisits();
    setVisits(visitList);
    setFetching(false);
  }

  useEffect(() => {
    const fVisits = async () => {
      await fetchVisits();
    }
    fVisits();
  }, [])
  
  return { visits, fetching, fetchVisits }
}