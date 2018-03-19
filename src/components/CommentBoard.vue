<template>
  <div>
    <h2>Comentarios</h2>
    <comment
      v-for="comment in comments"
      :content="comment.content"
      :key="comment.id"
      @deleteThis="deleteComment(comment.id)"/>
  </div>
</template>

<script>
import Comment from './Comment';
import { queries, mutations } from '../api';

export default {
  name: 'CommentBoard',
  components: {
    Comment,
  },
  props: {
    comments: {
      type: Array,
      required: true,
    },
  },
  methods: {
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
};
</script>

<style scoped>

</style>
