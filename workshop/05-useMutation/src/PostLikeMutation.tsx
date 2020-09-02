// eslint-disable-next-line
import { graphql } from 'react-relay';

/**
 * TODO
 * add mutation input and output here
 */
export const PostLike = graphql`
  mutation PostLikeMutation($input: PostLikeInput!) {
    PostLike(input: $input) {
      success
      error
      post {
        meHasLiked
        likesCount
      }
    }
  }
`;

/**
 * TODO
 * add Post Like optimistic update
 */
export const likeOptimisticResponse = post => ({
  PostLike: {
    success: '',
    error: null,
    post: {
      id: post.id,
      meHasLiked: true,
      likesCount: post.likesCount + 1,
    },
  },
});
