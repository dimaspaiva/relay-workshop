import React from 'react';
import { Text } from 'rebass';
import { Card } from '@workshop/ui';
import { useFragment, graphql } from 'react-relay/hooks';

import { Post_app$key } from './__generated__/Post_app.graphql';

/**
 * TODO
 * useFragment to let Post declare its data requirement
 */

interface Props {
  app: Post_app$key;
}

const Post = ({ app }: Props) => {
  const query = graphql`
    fragment Post_app on Post {
      id
      content
      author {
        name
      }
    }
  `;

  const post = useFragment(query, app);

  return (
    <Card mt='10px' flexDirection='column' p='10px'>
      <Text>id: {post.id}</Text>
      <Text>Content: {post.content}</Text>
      <Text>Author: {post.author?.name}</Text>
    </Card>
  );
};

export default Post;
