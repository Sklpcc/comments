<template>
  <div id="app">
    <!--suppress HtmlFormInputWithoutLabel -->
    <comment-input @addComment="addComment"/>
    <comment-board :comments="comments"/>
  </div>
</template>

<script>
import CommentInput from './components/CommentInput';
import CommentBoard from './components/CommentBoard';
import { mutations, queries } from './api';

export default {
  name: 'App',
  components: {
    CommentInput,
    CommentBoard,
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
  },
  apollo: {
    comments: queries.getAllComments,
  },
};
</script>

<style>
</style>
