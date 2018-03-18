<template>
  <div id="app">
    <!--suppress HtmlFormInputWithoutLabel -->
    <comment-input @addComment="addComment"/>
    <h2>Comentarios</h2>
    <comment
      v-for="comment in comments"
      :content="comment.content"
      :key="comment.id"
      @deleteThis="deleteComment(comment.id)"/>
  </div>
</template>

<script>
import CommentInput from './components/CommentInput';
import Comment from './components/Comment';

export default {
  name: 'App',
  components: {
    CommentInput,
    Comment,
  },
  data() {
    return {
      comments: [
        {
          id: 1,
          content: 'Primer Comentario.',
          createdAt: 123123123,
        },
      ],
    };
  },
  methods: {
    addComment(content) {
      this.comments.push({
        id: Math.floor(Math.random() * 1000),
        createdAt: 1,
        content,
      });
    },
    deleteComment(id) {
      this.comments = this.comments.filter(e => e.id !== id);
    },
  },
};
</script>

<style>
</style>
