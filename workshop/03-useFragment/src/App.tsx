import React from 'react';

import { Flex, Text } from 'rebass';
import { Content } from '@workshop/ui';

import { useLazyLoadQuery, graphql } from 'react-relay/hooks';

import Post from './Post';

import { AppQuery } from './__generated__/AppQuery.graphql';

const App = () => {
  const { posts } = useLazyLoadQuery<AppQuery>(
    graphql`
      query AppQuery {
        posts(first: 10) {
          edges {
            node {
              id
              ...Post_app
            }
          }
        }
      }
    `,
    {},
    {
      fetchPolicy: 'network-only',
    },
  );

  return (
    <Content>
      <Flex flexDirection='column'>
        <Text>Posts</Text>
        <Flex flexDirection='column'>
          {posts.edges.map(({ node }) => (
            <Post key={node.id} app={node} />
          ))}
        </Flex>
      </Flex>
    </Content>
  );
};

export default App;
