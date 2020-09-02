import { graphql } from 'react-relay';

import { SelectorStoreUpdater, RecordSourceSelectorProxy, ConnectionHandler, RecordProxy } from 'relay-runtime';

import { PostCommentCreateInput } from './__generated__/PostCommentCreateMutation.graphql';
import { PostCommentComposer_me } from './__generated__/PostCommentComposer_me.graphql';

export const PostCommentCreate = graphql`
  mutation PostCommentCreateMutation($input: PostCommentCreateInput!) {
    PostCommentCreate(input: $input) {
      success
      error
      post {
        commentsCount
      }
      commentEdge {
        node {
          id
          body
          user {
            id
            name
          }
        }
      }
    }
  }
`;

const getConnection = (parentId: string, store: RecordSourceSelectorProxy) => {
  const parentProxy = store.get(parentId);

  if (!parentProxy) {
    return;
  }

  return ConnectionHandler.getConnection(parentProxy, 'PostComments_comments');
};

const insertEdge = (edge: RecordProxy, parentId: string, store: RecordSourceSelectorProxy) => {
  const connection = getConnection(parentId, store);

  if (!connection) {
    return;
  }

  ConnectionHandler.insertEdgeBefore(connection, edge);
};

export const updater = (parentId: string): SelectorStoreUpdater => (store: RecordSourceSelectorProxy) => {
  const newEdge = store.getRootField('PostCommentCreate')?.getLinkedRecord('commentEdge');

  if (!newEdge) {
    return;
  }

  insertEdge(newEdge, parentId, store);
};

let tempID = 0;

const createNode = (store: RecordSourceSelectorProxy, me: PostCommentComposer_me, input: PostCommentCreateInput) => {
  const id = 'client:newComment:' + tempID++;
  const node = store.create(id, 'Comment');

  const nodeProxy = store.get(me.id);

  if (!nodeProxy) {
    return;
  }

  node.setValue(id, 'id');
  node.setValue(input.body, 'body');
  node.setLinkedRecord(nodeProxy, 'user');

  return node;
};

export const optimisticUpdater = (input: PostCommentCreateInput, me: PostCommentComposer_me) => (
  store: RecordSourceSelectorProxy,
) => {
  const node = createNode(store, me, input);

  if (!node) {
    return;
  }

  const edgeId = 'client:newEdge' + tempID++;

  const newEdge = store.create(edgeId, 'CommentEdge');
  newEdge.setLinkedRecord(node, 'node');

  insertEdge(newEdge, input.post, store);
};
