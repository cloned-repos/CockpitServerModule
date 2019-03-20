import {
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';
import GraphQLJSON from 'graphql-type-json';
import { SignalType } from '../types';
import { Signal } from '../../models';
import SignalStateEnum from '../types/enum/SignalState';


export const args = {
  cloneId: { type: new GraphQLNonNull(GraphQLString) },
  state: { type: new GraphQLNonNull(SignalStateEnum) },
  context: { type: GraphQLJSON },
  orderData: { type: GraphQLJSON },
  reason: { type: GraphQLJSON },
};

const resolve = (parent, {
  cloneId,
  state,
  context,
  orderData,
  reason,
}) => {
  const date = Date.now();
  const signal = Object.assign(
    (state) ? { state } : {},
    (cloneId) ? { cloneId } : {},
    (context) ? { context } : {},
    (orderData) ? { orderData } : {},
  );
  const changeLog = Object.assign(
    (reason) ? { reason } : {},
    (state) ? { state } : {},
    (context) ? { context } : {},
    (orderData) ? { orderData } : {},
    { date },
  );
  signal.changeLogs = [changeLog];

  const newSignal = new Signal(signal);

  return new Promise((res, rej) => {
    newSignal.save((err) => {
      if (err) {
        rej(err);
        return;
      }
      res(newSignal);
    });
  });
};

const mutation = {
  createSignal: {
    type: SignalType,
    args,
    resolve,
  },
};

export default mutation;
