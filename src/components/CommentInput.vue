<template>
  <div class="container">
    <div class="field">
      <div class="control">
        <textarea
          v-model="content"
          class="textarea"
          placeholder="Escribe aquí tu comentario!"/>
      </div>
    </div>
    <div class="field is-grouped is-grouped-right">
      <div class="control">
        <button
          class="button is-primary"
          @click.prevent="addComment">Enviar Comentario</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CommentInput',
  data() {
    return {
      content: '',
    };
  },
  methods: {
    addComment() {
      this.$emit('addComment', this.content);
      this.content = '';
    },
  },
};
</script>

<style lang="sass">
  @import '~bulma/sass/utilities/_all'
  @import '~bulma/sass/base/_all'
  @import '~bulma/sass/elements/form'
</style>
