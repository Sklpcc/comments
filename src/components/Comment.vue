<template>
  <div class="comment">
    <p>{{ content }}</p>
    <button @click.prevent="deleteThis">Eliminar</button>
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
    display: flex;
  }

  .comment p {
    flex-grow: 3;
  }

  .commet button {
    flex-grow: 1;
  }
</style>
