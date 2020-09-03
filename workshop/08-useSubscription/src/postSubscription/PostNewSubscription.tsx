// eslint-disable-next-line
import { graphql } from 'react-relay';
// eslint-disable-next-line
import { RecordSourceSelectorProxy, ROOT_ID, ConnectionHandler, RecordProxy } from 'relay-runtime';

// eslint-disable-next-line
import { connectionUpdater } from '@workshop/relay';

export const PostNew = graphql`
  subscription PostNewSubscription($input: PostNewInput!) {
    PostNew(input: $input) {
      post {
        id
        content
        author {
          id
          name
        }
        meHasLiked
        likesCount
        ...PostComments_post
      }
    }
  }
`;

/**
 * TODO
 * fill updater to get the new post and add to Feed_posts connection
 * avoid duplication of post
 */
// eslint-disable-next-line
const hasPostStore = (node: RecordProxy, store: RecordSourceSelectorProxy) => {
  const id = node.getDataID();

  if (!id) {
    return;
  }

  return store.get(id);
};

const getConnection = (store: RecordSourceSelectorProxy) => {
  const parentProxy = store.getRoot();

  if (!parentProxy) {
    return;
  }

  return ConnectionHandler.getConnection(parentProxy, 'Feed_posts'); // QueryName_edgeName
};

export const updater = (store: RecordSourceSelectorProxy) => {
  const postNode = store.getRootField('PostNew')?.getLinkedRecord('post');

  if (!postNode) {
    return;
  }

  if (!hasPostStore(postNode, store)) {
    const connection = getConnection(store);

    if (!connection) {
      return;
    }

    const postEdge = ConnectionHandler.createEdge(store, connection, postNode, 'PostEdge');

    connectionUpdater({
      store,
      parentId: ROOT_ID,
      connectionName: 'Feed_posts',
      edge: postEdge,
      before: true,
    });
  }
};
