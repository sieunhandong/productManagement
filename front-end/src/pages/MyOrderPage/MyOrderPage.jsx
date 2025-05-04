import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import * as OrderService from '../../services/OrderService'
import Loading from '../../components/LoadingComponent/Loading';
import { useSelector } from 'react-redux';

function MyOrderPage() {
  const user = useSelector((state) => state.user)
  const fetchMyOrder = async () => {
    const res = await OrderService.getOrderByUserId(user?.id, user?.access_token)
    return res?.data
  }
  const queryOrder = useQuery({
    queryKey: ['users'],
    queryFn: fetchMyOrder,
    enabled: !!user?.id && !!user?.access_token
  })
  const { isLoading, data } = queryOrder
  console.log('data', data)
  return (
    <Loading isLoading={isLoading}>
      <div style={{ background: '#f5f5fa', width: '100%', height: '100vh' }}>
        MyOrder
      </div>
    </Loading>
  );
}

export default MyOrderPage;
