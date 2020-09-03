import React from 'react';
import { graphql, useFragment } from 'react-relay/hooks';
import { Flex, Text } from 'rebass';

import { theme } from '@workshop/ui';

import UserAvatar from './UserAvatar';

import { PostComments_post$key } from './__generated__/PostComments_post.graphql';

type Props = {
  post: PostComments_post$key;
};
const PostComments = (props: Props) => {
  const first = 3;

  // eslint-disable-next-line relay/generated-flow-types
  const post = useFragment<PostComments_post$key>(
    graphql`
      fragment PostComments_post on Post
        @argumentDefinitions(first: { type: Int, defaultValue: 3 }, after: { type: String }) {
        id
        comments(first: $first, after: $after) @connection(key: "PostComments_comments", filters: []) {
          endCursorOffset
          startCursorOffset
          count
          pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
          }
          edges {
            cursor
            node {
              id
              body
              user {
                id
                name
                ...UserAvatar_user
              }
            }
          }
        }
      }
    `,
    props.post,
  );

  const { comments } = post;
  const { edges } = comments;

  if (edges.length === 0) {
    return null;
  }

  const commentsAmount = (comments.count || 0) + (comments.edges.length - first);

  return (
    <Flex flex={1} p='16px' flexDirection='column'>
      <Text>Comments: {commentsAmount}</Text>
      {comments.edges.map(({ node }) => {
        return (
          <Flex mt='10px' key={node.id}>
            <UserAvatar showName={false} user={node.user} />
            <Flex backgroundColor='#F2F3F5' borderRadius={10} p='10px' ml='10px'>
              <Text fontWeight='600px' color={theme.relayDark}>
                {node.user.name}
              </Text>
              <Text ml='10px'>{node.body}</Text>
            </Flex>
          </Flex>
        );
      })}
    </Flex>
  );
};

export default PostComments;
