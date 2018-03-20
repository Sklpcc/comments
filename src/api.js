import gql from 'graphql-tag';

export const queries = {
  getAllComments: gql`query ($pageSize: Int!, $after: String){
  comments (first: $pageSize, after: $after, orderBy: {direction:DESC,field:CREATED_AT}){
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
            id
            content
            createdAt
          }
        totalCount
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
