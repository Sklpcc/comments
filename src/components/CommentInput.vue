<template>
  <div>
    <!--suppress HtmlFormInputWithoutLabel -->
    <textarea
      v-model="content"/>
    <button @click.prevent="addComment">Enviar Comentario</button>
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

<style scoped>

</style>
