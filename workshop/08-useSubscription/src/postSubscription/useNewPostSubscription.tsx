// eslint-disable-next-line
import React, { useMemo } from 'react';
// eslint-disable-next-line
import Button from '@material-ui/core/Button';

import { useSnackbar } from 'notistack';

import { useSubscription } from '@workshop/relay';

import { GraphQLSubscriptionConfig } from 'relay-runtime';

import { AppQueryResponse } from '../__generated__/AppQuery.graphql';

import { PostNew, updater } from './PostNewSubscription';
import { PostNewSubscription, PostNewSubscriptionResponse } from './__generated__/PostNewSubscription.graphql';

// TODO - use @inline for me
type Me = AppQueryResponse['me'];

// eslint-disable-next-line
export const useNewPostSubscription = (me: Me) => {
  // eslint-disable-next-line
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const postNewConfig = useMemo<GraphQLSubscriptionConfig<PostNewSubscription>>(
    () => ({
      subscription: PostNew,
      variables: {
        input: {},
      },
      onCompleted: (...args) => {
        // eslint-disable-next-line
        console.log('onCompleted: ', args);
      },
      onError: (...args) => {
        // eslint-disable-next-line
        console.log('onError: ', args);
      },
      // eslint-disable-next-line
      onNext: ({ PostNew }: PostNewSubscriptionResponse) => {
        const { post } = PostNew;

        const action = (key: string) => (
          <>
            <Button onClick={() => closeSnackbar(key)}>Dissmis</Button>
          </>
        );

        if (me.id === post.author.id) {
          enqueueSnackbar('Post made!', {
            variant: 'success',
            action,
          });
        } else {
          enqueueSnackbar(`New post from ${post.author.name}`, {
            variant: 'success',
            action,
          });
        }
      },
      updater,
    }),
    [],
  );

  useSubscription(postNewConfig);
};
