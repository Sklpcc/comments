<template>
  <div class="container">
    <div class="field">
      <div class="control">
        <textarea
          v-model="content"
          :class="characterCountClass"
          class="textarea"
          placeholder="Escribe aquí tu comentario!"/>
      </div>
      <p
        :class="characterCountClass"
        class="help">
        {{ caracterCount }} / {{ maxCaracterCount }}
        <span
          v-show="caracterCount > maxCaracterCount"
          class="is-danger">
          [Solo se permite hasta 255 caracteres]
        </span>
      </p>
    </div>
    <div class="field is-grouped is-grouped-right">
      <div class="control">
        <button
          :disabled="caracterCount > maxCaracterCount"
          class="button is-primary"
          @click.prevent="addComment">Enviar Comentario</button>
      </div>
    </div>
  </div>
</template>

<script>
const maxCaracterCount = 255;

export default {
  name: 'CommentInput',
  data() {
    return {
      content: '',
      maxCaracterCount,
    };
  },
  computed: {
    caracterCount() {
      return this.content.length;
    },
    characterCountClass() {
      const safeLimit = this.maxCaracterCount * 0.92;
      const warningLimit = this.maxCaracterCount;

      if (this.caracterCount <= safeLimit) {
        return 'is-success';
      } else if (this.caracterCount <= warningLimit) {
        return 'is-warning';
      }
      return 'is-danger';
    },
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
