import React, { useTransition } from 'react';
import { graphql, useRefetchableFragment } from 'react-relay/hooks';
import { Flex, Text } from 'rebass';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import { theme } from '@workshop/ui';

import UserAvatar from './UserAvatar';

import { PostComments_post$key } from './__generated__/PostComments_post.graphql';
import { PostCommentsRefetchQuery } from './__generated__/PostCommentsRefetchQuery.graphql';

type Props = {
  post: PostComments_post$key;
};
const PostComments = (props: Props) => {
  const [startTransition, isPending] = useTransition();

  const [post, refetchPost] = useRefetchableFragment<PostCommentsRefetchQuery, any>(
    graphql`
      fragment PostComments_post on Post
        @argumentDefinitions(
          first: { type: Int, defaultValue: 3 }
          last: { type: Int }
          before: { type: String }
          after: { type: String }
        )
        @refetchable(queryName: "PostCommentsRefetchQuery") {
        id
        comments(first: $first, last: $last, before: $before, after: $after)
          @connection(key: "PostComments_comments", filters: []) {
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
  const { edges, pageInfo } = comments;

  if (edges.length === 0) {
    return null;
  }

  const loadMore = (type: string) => {
    startTransition(() => {
      const { id } = post;
      const { endCursor, startCursor } = pageInfo;

      const variables =
        type === 'new'
          ? {
              id,
              last: 1,
              before: startCursor,
            }
          : {
              id,
              first: 1,
              after: endCursor,
            };

      refetchPost(variables, {
        fetchPolicy: 'store-and-network',
      });
    });
  };

  const isDisabledOld = !pageInfo.hasNextPage;
  const isDisabledNew = !pageInfo.hasPreviousPage;

  return (
    <Flex flex={1} p='16px' flexDirection='column'>
      {post.comments.edges.map(({ node }) => {
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
      {isPending && (
        <Flex mt='10px' justifyContent='center'>
          <CircularProgress />
        </Flex>
      )}
      <Flex flex={1} justifyContent='flex-end' mt='10px'>
        <Button
          variant='contained'
          color='primary'
          style={{ margin: '0 15px' }}
          onClick={() => loadMore('new')}
          disabled={isDisabledNew}
        >
          Show newer
        </Button>
        <Button variant='contained' color='primary' onClick={() => loadMore('old')} disabled={isDisabledOld}>
          Show older
        </Button>
      </Flex>
    </Flex>
  );
};

export default PostComments;
