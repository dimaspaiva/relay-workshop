import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import React from 'react';
// eslint-disable-next-line
import { MockPayloadGenerator } from 'relay-test-utils';

// eslint-disable-next-line
import { preloadQuery } from 'react-relay/hooks';

import { JSResource } from '@workshop/route';

// eslint-disable-next-line
import { Environment } from '../../../../relay';
import PostDetail from '../PostDetail';

import { withProviders } from '../../../../../test/withProviders';

it('should render post like button', async () => {
  const postId = 'postId';
  const routes = [
    {
      component: JSResource('Component', () => new Promise(resolve => resolve(PostDetail))),
      path: '/post/:id',
    },
  ];

  const initialEntries = [`/post/${postId}`];
  const PostDetailQuery = require('../__generated__/PostDetailQuery.graphql');

  const query = PostDetailQuery;
  const variables = {
    id: postId,
  };

  const customMockResolvers = {
    Post: () => ({
      id: postId,
      content: 'somePost',
      author: {
        id: 'authorId',
        name: 'authorName',
      },
      meHasLiked: true,
      likesCount: 9,
    }),
  };

  Environment.mock.queuePendingOperation(query, variables);

  Environment.mock.queueOperationResolver(operation => MockPayloadGenerator.generate(operation, customMockResolvers));

  const Root = withProviders({
    routes,
    initialEntries,
    Component: PostDetail,
  });

  const prepared = {
    postDetailQuery: preloadQuery(Environment, PostDetailQuery, variables, {
      fetchPolicy: 'store-or-network',
    }),
  };

  const { getByText, getByTestId } = render(<Root prepared={prepared} />);

  // uncomment to check DOM
  // debug();

  expect(getByText('somePost')).toBeTruthy();
  expect(getByTestId('likeButton')).toBeTruthy();
});

it('should not render a post', async () => {
  const postId = 'postId2';
  const routes = [
    {
      component: JSResource('Component', () => new Promise(resolve => resolve(PostDetail))),
      path: '/post/:id',
    },
  ];

  const initialEntries = [`/post/${postId}`];
  const PostDetailQuery = require('../__generated__/PostDetailQuery.graphql');

  const query = PostDetailQuery;
  const variables = {
    id: postId,
  };

  const customMockResolvers = {
    Post: () => null,
  };

  Environment.mock.queuePendingOperation(query, variables);

  Environment.mock.queueOperationResolver(operation => MockPayloadGenerator.generate(operation, customMockResolvers));

  const Root = withProviders({
    routes,
    initialEntries,
    Component: PostDetail,
  });

  const prepared = {
    postDetailQuery: preloadQuery(Environment, PostDetailQuery, variables, {
      fetchPolicy: 'olny-network',
    }),
  };

  const { debug, getByText } = render(<Root prepared={prepared} />);

  // uncomment to check DOM
  debug();

  expect(getByText('Post not found')).toBeTruthy();
});
