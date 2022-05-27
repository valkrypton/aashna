<template>
  <div id="about" class="outer">
    <div>
      <span>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium adipisci aut consequuntur dolor dolore dolores dolorum ducimus, enim error fugit harum impedit laboriosam minima quaerat soluta sunt tenetur veniam voluptatibus.</span>
    </div>
    <div>
      <span>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium adipisci aut consequuntur dolor dolore dolores dolorum ducimus, enim error fugit harum impedit laboriosam minima quaerat soluta sunt tenetur veniam voluptatibus.</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "About",
  components: {}

}
</script>

<style scoped>
* {
  font-family: "Segoe UI", sans-serif;
}

.outer {
  display: flex;
  flex-direction: row;
  padding: 3% 20%;
  background-color: white;
}

span {
  font-size: 1.5em;
}
</style>