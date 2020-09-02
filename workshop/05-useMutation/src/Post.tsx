import React, { useCallback } from 'react';
import { useFragment, graphql } from 'react-relay/hooks';
import { Text } from 'rebass';
import { Card, CardActions, theme } from '@workshop/ui';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import IconButton from '@material-ui/core/IconButton';

import { useMutation } from '@workshop/relay';

import { likeOptimisticResponse, PostLike } from './PostLikeMutation';

import { Post_post } from './__generated__/Post_post.graphql';
import { PostLikeMutation } from './__generated__/PostLikeMutation.graphql';

type Props = {
  post: Post_post;
};

const Post = (props: Props) => {
  const postQuery = graphql`
    fragment Post_post on Post {
      id
      content
      author {
        name
      }
      meHasLiked
      likesCount
    }
  `;

  const post = useFragment(postQuery, props.post);

  const [postLike] = useMutation<PostLikeMutation>(PostLike);

  const Icon = post.meHasLiked ? FavoriteIcon : FavoriteBorderIcon;

  const handleLike = useCallback(() => {
    // eslint-disable-next-line
    const config = {
      variables: {
        input: {
          post: post.id,
        },
      },
      opmisticResponse: likeOptimisticResponse,
    };

    if (!post.meHasLiked) {
      postLike(config);
    }
  }, [post]);

  return (
    <Card mt='10px' flexDirection='column' p='10px'>
      <Text>id: {post.id}</Text>
      <Text>content: {post.content}</Text>
      <Text>Author: {post.author.name}</Text>
      <CardActions>
        <IconButton onClick={handleLike}>
          <Icon style={{ color: theme.relayDark }} />
        </IconButton>
        {post.likesCount > 0 ? <Text>{post.likesCount}</Text> : null}
      </CardActions>
    </Card>
  );
};

export default Post;
