<script setup>
import Form from '../components/Form.vue';
import Table from '../components/Table.vue';
</script>

<template>
  <div class="container">
    <Form style="background-color: aliceblue; width: 100%;"/>
    <Table style="margin-top: 2rem; background-color: aliceblue; width: 100%;"/>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}
</style>
