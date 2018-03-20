<template>
  <div>
    <div v-if="initialLoading">
      Cargando...
    </div>
    <article
      v-else-if="count > 0"
      id="comments-container">
      <h3 class="title is-3">Comentarios</h3>
      <comment
        v-for="comment in comments"
        :content="comment.content"
        :key="comment.id"
        @deleteThis="deleteComment(comment.id)"/>
      <infinite-loading
        spinner="spiral"
        @infinite="loadMoreComments">
      </infinite-loading>
    </article>
    <div v-else>
      No hay ningun comentario, ingresa alguno.
    </div>
  </div>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading';
import Comment from './Comment';
import { queries, mutations, pageSize } from '../api';

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'CommentBoard',
  components: {
    Comment,
    InfiniteLoading,
  },
  data() {
    return {
      comments: [],
      currentEndCursor: '',
      hasMoreComments: true,
      initialLoading: true,
    };
  },
  computed: {
    count() {
      return this.comments.length;
    },
  },
  watch: {
    comments() {
      this.initialLoading = false;
    },
  },
  created() {
    // Just in case GraphQL query fail
    // TODO: better to use promise reject and an error view
    setTimeout(() => { this.initialLoading = false; }, 5000);
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
            __typename: 'CommentNode',
            id,
            content: '',
            createdAt: 1,
          },
        },
        update(store, { data: { deleteComment } }) {
          const data = store.readQuery({ query: queries.getAllComments, variables: { pageSize, after: '' } });
          const index = data.comments.nodes.findIndex(el => el.id === deleteComment.id);
          if (index !== -1) {
            data.comments.nodes.splice(index, 1);
            store.writeQuery({ query: queries.getAllComments, variables: { pageSize, after: '' }, data });
          }
        },
      })
        // eslint-disable-next-line no-console,no-console
        .then(response => console.log(response))
      // eslint-disable-next-line no-console,no-console
        .catch(reason => console.error(reason));
    },
    loadMoreComments($state) {
      if (this.hasMoreComments) {
        // Workaround to avoid use variables(), cause "This will re-fetch the query each
        // time a parameter changes" https://github.com/Akryum/vue-apollo/blame/master/README.md#L382
        const variables = {
          pageSize,
          after: this.currentEndCursor,
        };
        this.$apollo.queries.comments.fetchMore({
          variables,
          updateQuery: (previousQueryResult, { fetchMoreResult }) => {
            const newComments = fetchMoreResult.comments.nodes;
            // noinspection JSUnresolvedVariable
            this.hasMoreComments = fetchMoreResult.comments.pageInfo.hasNextPage;
            // noinspection JSUnresolvedVariable
            this.currentEndCursor = fetchMoreResult.comments.pageInfo.endCursor;

            if (!this.hasMoreComments) {
              $state.complete();
            } else {
              $state.loaded();
            }
            return newComments.length ? {
              comments: {
                // eslint-disable-next-line no-underscore-dangle
                __typename: previousQueryResult.comments.__typename,
                nodes: [
                  ...previousQueryResult.comments.nodes,
                  ...newComments,
                ],
                pageInfo: fetchMoreResult.comments.pageInfo,
                totalCount: fetchMoreResult.comments.totalCount,
              },
            } : previousQueryResult;
          },
        });
      } else {
        $state.complete();
      }
    },
  },
  apollo: {
    comments: {
      query: queries.getAllComments,
      manual: true,
      update: data => data.comments.nodes,
      result({ data }) {
        // noinspection JSUnresolvedVariable
        this.currentEndCursor = data.comments.pageInfo.endCursor;
        // noinspection JSUnresolvedVariable
        this.hasMoreComments = data.comments.pageInfo.hasNextPage;
        this.comments = data.comments.nodes;
      },
      variables: {
        pageSize,
        after: '',
      },
    },
  },
};
</script>

<style lang="sass">
  @import '~bulma/sass/utilities/_all'
  @import '~bulma/sass/base/_all'
  @import '~bulma/sass/elements/title'

  #comments-container
    max-height: 100%

</style>
