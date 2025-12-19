import { useState, useEffect } from 'react';
import { getVisits, deleteVisit as deleteVisitApi } from '@/api/helper/visits'
import { showToast } from '@/components'

export const useVisits = () => {
  const [fetching, setFetching] = useState(true);
  const [visits, setVisits] = useState([]);

  const fetchVisits = async (enableLoading?: boolean) => {
    if (enableLoading) {
      setFetching(true);
    } else {
      setFetching(false);
    }
    const visitList = await getVisits();
    setVisits(visitList);
    if (enableLoading) {
      setFetching(false);
    }
  }

  const deleteVisit = async (visitId: string) => {
    showToast({
      type: 'warning',
      text1: 'Deleting Gatepass',
      text2: visitId
    })
    const data = await deleteVisitApi(visitId);
    
    await fetchVisits();
    showToast({
      type: data.success ? 'success' : 'error',
      text1: data.success ? 'Gatepass Deleted': 'Failed to delete gatepass',
      text2: data.message
    })
  }

  useEffect(() => {
    const fVisits = async () => {
      await fetchVisits(true);
    }
    fVisits();
  }, [])

  return { visits, fetching, fetchVisits, deleteVisit }
}