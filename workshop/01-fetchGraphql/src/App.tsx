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
  const [after, setAfter] = useState(null);
  const [before, setBefore] = useState(null);

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
        variables: {
          after,
          before,
        },
      }),
    });

    return response.json();
  };

  const handlePosts = data => {
    const posts = data.posts.edges.map(({ node }: { node: Post }) => ({ id: node.id, content: node.content }));
    const { hasNextPage, hasPreviousPage, endCursor } = data.posts.pageInfo;

    if (hasNextPage) {
      setAfter(endCursor);
    } else {
      setAfter(null);
    }

    if (hasPreviousPage) {
      setBefore(endCursor);
    } else {
      setBefore(null);
    }

    setPosts(posts);
  };

  const handleRequestPosts = () => {
    const query = `
    query getPosts ($after: String, $before: String) {
      posts(first: 10 after: $after before: $before) {
        edges {
          node {
            id
            content
          }
        }
        pageInfo {
          endCursor
          hasNextPage
          hasPreviousPage
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
      {before && <Button onClick={() => handleRequestPosts()}>Prev</Button>}
      {after && <Button onClick={() => handleRequestPosts()}>Next</Button>}
    </Content>
  );
};

export default App;
