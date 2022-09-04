import {View, FlatList} from 'react-native';
import React, {useCallback} from 'react';
import {useSelector} from 'react-redux';

import {RootState} from '../store/reducer';
import type {Order} from '../slices/orderSlice';
import EachOrder from '../components/EachOrder';

const Orders = () => {
  const orders = useSelector((state: RootState) => state.order.orders);
  const renderItem = useCallback(({item}: {item: Order}) => {
    return <EachOrder item={item} />;
  }, []);
  return (
    <View>
      <FlatList
        data={orders}
        keyExtractor={item => item.orderId}
        renderItem={renderItem}
      />
    </View>
  );
};

export default Orders;
