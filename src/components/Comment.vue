<template>
  <div class="columns comment">
    <div class="column is-9">
      <p class="has-text-centered">{{ content }}</p>
    </div>
    <div class="column is-3">
      <div class="field is-grouped is-grouped-right is-vertical-centered">
        <div class="control">
          <button
            class="button is-danger"
            @click.prevent="deleteThis">Eliminar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// noinspection JSUnusedGlobalSymbols
export default {
  name: 'Comment',
  props: {
    content: {
      type: String,
      required: true,
      default: '',
    },
  },
  methods: {
    deleteThis() {
      return this.$emit('deleteThis');
    },
  },
};
</script>

<style>
  .comment {
    border-bottom: 1px solid black;
  }
</style>

<style lang="sass">
  @import '~bulma/sass/utilities/_all'
  @import '~bulma/sass/base/_all'
  @import '~bulma/sass/elements/button'
  @import '~bulma/sass/grid/columns'
  @import '~bulma/sass/components/level'

  .comment p
    white-space: pre-line
    word-wrap: break-word

  .is-vertical-centered
    height: 100%
    align-items: center

</style>
