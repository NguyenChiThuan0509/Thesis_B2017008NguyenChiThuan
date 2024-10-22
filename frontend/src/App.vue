<template>
  <div id="app">
    <Header />
    <div class="layout">
      <SideBar />
      <div class="main-area">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
import SideBar from "@/components/SideBar.vue";
import MainContent from "@/components/MainContent.vue";

export default {
  name: "App",
  components: {
    Header,
    SideBar,
    MainContent,
  }
}
</script>

<style>
.layout {
  display: flex;
  margin-top: 68px;
}

.main-area {
  flex-grow: 1;
  padding: 20px;
  margin-left: 17%;
  color: black;
}

@media (max-width: 768px) {
  .sidebar {
    display: none;
  }

  .main-area {
    margin-left: 0;
  }
}
</style>
