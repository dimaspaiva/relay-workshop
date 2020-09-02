import React, { useCallback } from 'react';
import InfiniteScroll from 'react-infinite-scroller';

import { Flex } from 'rebass';
import { Button } from '@workshop/ui';
import { graphql } from 'react-relay';
import { usePaginationFragment } from 'react-relay/hooks';

import Post from './Post';
import Loading from './Loading';

import { Feed_query } from './__generated__/Feed_query.graphql';

type Props = {
  query: Feed_query;
};

const Feed = (props: Props) => {
  const feedQuery = graphql`
    fragment Feed_query on Query
      @argumentDefinitions(first: { type: Int, defaultValue: 1 }, after: { type: String })
      @refetchable(queryName: "FeedPaginationQuery") {
      posts(first: $first, after: $after) @connection(key: "Feed_posts", filters: []) {
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
          node {
            id
            ...Post_post
          }
        }
      }
    }
  `;

  const { data, loadNext, isLoadingNext, hasNext } = usePaginationFragment(feedQuery, props.query);

  const { posts } = data;

  const loadMore = useCallback(() => {
    if (isLoadingNext) {
      return;
    }

    loadNext(1);
  }, [loadNext, isLoadingNext]);

  return (
    <Flex flexDirection='column'>
      <InfiniteScroll pageStart={0} loadMore={loadMore} hasMore={hasNext} loader={<Loading />} useWindow>
        {posts.edges.map(({ node }) => (
          <Post key={node.id} post={node} />
        ))}
      </InfiniteScroll>
      {isLoadingNext && <Loading />}
      <Button mt='10px' onClick={() => loadMore()}>
        Load More
      </Button>
    </Flex>
  );
};

export default Feed;
