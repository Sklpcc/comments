<template>
  <div>
    <div v-if="initialLoading">
      Cargando...
    </div>
    <div v-else-if="hasErrorOnFetch">
      Ha ocurrido un error al tratar de obtener los comentarios del servidor.
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
        v-if="!noInfinteScroll"
        :distance="50"
        spinner="spiral"
        @infinite="loadMoreComments">
        <span slot="no-more">
          Ya no hay mas comentarios.
        </span>
        <span slot="no-results">
          No hay mas comentarios.
        </span>
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
      hasMoreComments: false,
      initialLoading: true,
      hasErrorOnFetch: false,
      noInfinteScroll: false,
    };
  },
  computed: {
    count() {
      return this.comments.length;
    },
  },
  watch: {
    comments(newVal) {
      this.initialLoading = false;
      if (!this.initialLoading && newVal instanceof Array && newVal.length === 0) {
        this.noInfinteScroll = true;
      }
    },
  },
  methods: {
    deleteComment(id) {
      // noinspection JSIgnoredPromiseFromCall, JSCheckFunctionSignatures
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
      });
    },
    loadMoreComments($state) {
      if (this.hasMoreComments) {
        // Workaround to avoid use variables(), cause "This will re-fetch the query each
        // time a parameter changes" https://github.com/Akryum/vue-apollo/blame/master/README.md#L382
        const variables = {
          pageSize,
          after: this.currentEndCursor,
        };

        let hasNextPage = true;

        this.$apollo.queries.comments.fetchMore({
          variables,
          updateQuery: (previousQueryResult, { fetchMoreResult }) => {
            const newComments = fetchMoreResult.comments.nodes;
            // noinspection JSUnresolvedVariable
            hasNextPage = fetchMoreResult.comments.pageInfo.hasNextPage;
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
        })
          .then(() => {
            if (!hasNextPage) {
              $state.complete();
            } else {
              $state.loaded();
            }
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
      result({ data }) {
        // noinspection JSUnresolvedVariable
        this.currentEndCursor = data.comments.pageInfo.endCursor;
        // noinspection JSUnresolvedVariable
        this.hasMoreComments = data.comments.pageInfo.hasNextPage;
        this.comments = data.comments.nodes;
        if (this.initialLoading && !this.hasMoreComments) {
          this.noInfinteScroll = true;
        }
      },
      variables: {
        pageSize,
        after: '',
      },
      error() {
        this.initialLoading = false;
        this.hasErrorOnFetch = true;
        this.$emit('errorOnFetch');
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
