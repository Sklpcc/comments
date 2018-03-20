<template>
  <section
    id="app"
    class="section">
    <comment-input
      v-show="!hasErrorOnFetch"
      @addComment="addComment"/>
    <comment-board @errorOnFetch="hasErrorOnFetch = true"/>
  </section>
</template>

<script>
import CommentInput from './components/CommentInput';
import CommentBoard from './components/CommentBoard';
import { mutations, queries, pageSize } from './api';

export default {
  name: 'App',
  components: {
    CommentInput,
    CommentBoard,
  },
  data() {
    return {
      hasErrorOnFetch: false,
    };
  },
  methods: {
    addComment(content) {
      // noinspection JSIgnoredPromiseFromCall, JSCheckFunctionSignatures
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
          const data = store.readQuery({ query: queries.getAllComments, variables: { pageSize, after: '' } });
          data.comments.nodes.unshift(addComment);
          store.writeQuery({ query: queries.getAllComments, variables: { pageSize, after: '' }, data });
        },
      });
    },
  },
};
</script>

<style lang="sass">
  @import '~bulma/sass/utilities/_all'
  @import '~bulma/sass/base/_all'
  @import '~bulma/sass/layout/section'
</style>
