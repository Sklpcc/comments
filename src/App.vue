<template>
  <section
    id="app"
    class="section">
    <comment-input @addComment="addComment"/>
    <comment-board :comments="comments"/>
  </section>
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
            __typename: 'CommentNode',
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

<style lang="sass">
  @import '~bulma/sass/utilities/_all'
  @import '~bulma/sass/base/_all'
  @import '~bulma/sass/layout/section'
</style>
