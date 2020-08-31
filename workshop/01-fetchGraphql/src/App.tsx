import React, { useEffect, useState } from 'react';

import { Flex, Text } from 'rebass';
import { Card, Content, Button } from '@workshop/ui';

import config from './config';

interface Post {
  content: string;
  id: string;
}

const App = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(false);
  const [nextPage, setNextPage] = useState(false);

  const handleFetch = async (query: string) => {
    setError(false);

    const response = await fetch(config.GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        query,
      }),
    });

    return response.json();
  };

  const handlePosts = data => {
    const posts = data.posts.edges.map(({ node }: { node: Post }) => ({ id: node.id, content: node.content }));
    const { hasNextPage, endCursor } = data.posts.pageInfo;
    if (hasNextPage) {
      setNextPage(endCursor);
    }
    setNextPage(false);
    setPosts(posts);
  };

  const handleRequestPosts = (pagination?: string) => {
    const queryVars =
      pagination === 'after'
        ? {
            declare: '($nexPage: String)',
            value: `after: ${nextPage}`,
          }
        : {
            declare: '($prevPage: String)',
            value: `before: ${nextPage}`,
          };

    const query = `
    query getPosts ${nextPage ? queryVars.declare : ''} {
      posts(first: 10 ${nextPage ? queryVars.value : ''}) {
        edges {
          node {
            id
            content
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  `;

    handleFetch(query)
      .then(({ data }) => {
        handlePosts(data);
      })
      .catch(() => setError(true));
  };

  useEffect(() => {
    handleRequestPosts();
  }, []);

  if (error) {
    return (
      <Content>
        <Text>Error: {error}</Text>
        <Button mt='10px' onClick={() => handleRequestPosts()}>
          retry
        </Button>
      </Content>
    );
  }

  return (
    <Content>
      <Flex flexDirection='column'>
        <Text>Posts</Text>
        <Flex flexDirection='column'>
          {posts.map((post: Post) => (
            <Card key={post.id} mt='10px' flexDirection='column' p='10px'>
              <Text>id: {post.id}</Text>
              <Text>content: {post.content}</Text>
            </Card>
          ))}
        </Flex>
      </Flex>
      {nextPage && <Button onClick={() => handleRequestPosts('before')}>Prev</Button>}
      {nextPage && <Button onClick={() => handleRequestPosts('after')}>Next</Button>}
    </Content>
  );
};

export default App;
