<template>
  <div id="app">
    <!--suppress HtmlFormInputWithoutLabel -->
    <comment-input @addComment="addComment"/>
    <h2>Comentarios</h2>
    <comment
      v-for="comment in comments"
      :content="comment.content"
      :key="comment.id"
      @deleteThis="deleteComment(comment.id)"/>
  </div>
</template>

<script>
import CommentInput from './components/CommentInput';
import Comment from './components/Comment';
import { mutations, queries } from './api';

export default {
  name: 'App',
  components: {
    CommentInput,
    Comment,
  },
  data() {
    return {
      comments: [],
    };
  },
  methods: {
    addComment(content) {
      // noinspection JSCheckFunctionSignatures
      this.$apollo.mutate({
        mutation: mutations.addComment,
        variables: {
          content,
        },
        // It seems redundant code
        optimisticResponse: {
          __typename: 'Mutation',
          addComment: {
            __typename: 'Comment',
            id: -1,
            content,
            createdAt: +new Date(),
          },
        },
        update(store, { data: { addComment } }) {
          const data = store.readQuery({ query: queries.getAllComments });
          data.comments.push(addComment);
          store.writeQuery({ query: queries.getAllComments, data });
        },
      })
        // eslint-disable-next-line no-console
        .then(response => console.log(response))
        // eslint-disable-next-line no-console
        .catch(reason => console.error(reason));

      // TODO: refactor then and catch functions above
    },
    deleteComment(id) {
      // noinspection JSCheckFunctionSignatures
      this.$apollo.mutate({
        mutation: mutations.deleteComment,
        variables: {
          id,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          deleteComment: {
            __typename: 'Comment',
            id,
            content: '',
            createdAt: 1,
          },
        },
        update(store, { data: { deleteComment } }) {
          const data = store.readQuery({ query: queries.getAllComments });
          const index = data.comments.findIndex(el => el.id === deleteComment.id);
          if (index !== -1) {
            data.comments.splice(index, 1);
            store.writeQuery({ query: queries.getAllComments, data });
          }
        },
      })
        // eslint-disable-next-line no-console,no-console
        .then(response => console.log(response))
        // eslint-disable-next-line no-console,no-console
        .catch(reason => console.error(reason));
    },
  },
  apollo: {
    comments: queries.getAllComments,
  },
};
</script>

<style>
</style>
