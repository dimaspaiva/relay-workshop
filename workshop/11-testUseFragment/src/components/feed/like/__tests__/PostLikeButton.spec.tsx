import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import React from 'react';

// eslint-disable-next-line
import { MockPayloadGenerator } from 'relay-test-utils';
// eslint-disable-next-line
import { usePreloadedQuery, graphql, preloadQuery } from 'react-relay/hooks';

// eslint-disable-next-line
import { Environment } from '../../../../relay';
import PostLikeButton from '../PostLikeButton';

import { withProviders } from '../../../../../test/withProviders';

import { PostLikeButtonSpecQuery } from './__generated__/PostLikeButtonSpecQuery.graphql';

// eslint-disable-next-line
export const getRoot = ({ preloadedQuery }) => {
  const UseQueryWrapper = () => {
    const { post } = usePreloadedQuery<PostLikeButtonSpecQuery>(
      graphql`
        query PostLikeButtonSpecQuery($id: ID!) @relay_test_operation {
          post: node(id: $id) {
            ...PostLikeButton_post
          }
        }
      `,
      preloadedQuery,
    );

    return <PostLikeButton post={post} />;
  };

  return withProviders({
    Component: UseQueryWrapper,
  });
};

it('should render post like button and likes count', async () => {
  const PostLikeButtonSpecQuery = require('./__generated__/PostLikeButtonSpecQuery.graphql');

  const postId = 'postId';
  const query = PostLikeButtonSpecQuery;
  const variables = {
    id: postId,
  };

  const customMockResolvers = {
    Post: () => ({
      id: postId,
      cotent: 'Testing count',
      likesCount: 10,
      meHasLiked: true,
    }),
  };

  Environment.mock.queuePendingOperation(query, variables);

  Environment.mock.queueOperationResolver(operation => MockPayloadGenerator.generate(operation, customMockResolvers));

  const preloadedQuery = preloadQuery(Environment, PostLikeButtonSpecQuery, variables, {
    fetchPolicy: 'store-or-network',
  });

  const Root = getRoot({
    Component: PostLikeButton,
    preloadedQuery,
  });

  // eslint-disable-next-line
  const { debug, getByText, getByTestId } = render(<Root preloadedQuery={preloadQuery} />);

  expect(getByText('10')).toBeTruthy();
  expect(getByTestId('likeCount')).toBeInTheDocument();
});

it('should not render post like count', async () => {
  const PostLikeButtonSpecQuery = require('./__generated__/PostLikeButtonSpecQuery.graphql');

  const postId = 'postId';
  const query = PostLikeButtonSpecQuery;
  const variables = {
    id: postId,
  };

  const customMockResolvers = {
    Post: () => ({
      id: postId,
      cotent: 'Testing count',
      likesCount: 0,
      meHasLiked: true,
    }),
  };

  Environment.mock.queuePendingOperation(query, variables);

  Environment.mock.queueOperationResolver(operation => MockPayloadGenerator.generate(operation, customMockResolvers));

  const preloadedQuery = preloadQuery(Environment, PostLikeButtonSpecQuery, variables, {
    fetchPolicy: 'store-or-network',
  });

  const Root = getRoot({
    Component: PostLikeButton,
    preloadedQuery,
  });

  // eslint-disable-next-line
  const { debug, queryByTestId, queryByText } = render(<Root preloadedQuery={preloadQuery} />);

  debug();

  expect(queryByText('0')).not.toBeInTheDocument();
  expect(queryByTestId('likeCount')).not.toBeInTheDocument();
});
