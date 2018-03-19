import gql from 'graphql-tag';

export const queries = {
  getAllComments: gql`query {
      comments {
        id
        content
        createdAt
      }
    }`,
};

export const mutations = {
  addComment: gql`mutation ($content: String!) {
      addComment(content: $content) {
        id
        content
        createdAt
      }
    }`,
  deleteComment: gql`mutation ($id: Int!) {
      deleteComment(id: $id) {
        id
        content
        createdAt
      }
    }`,
};
