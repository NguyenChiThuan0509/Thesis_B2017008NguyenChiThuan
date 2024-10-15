<template>
  <div id="app">
    <Header />
    <div class="layout">
      <SideBar />
      <div class="main-area">
        <MainContent />
      </div>
    </div>
    <!-- <ChatBox /> -->
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
// import ChatBox from "@/components/ChatBox.vue";
import SideBar from "@/components/SideBar.vue";
import MainContent from "@/components/MainContent.vue";

export default {
  name: "App",
  components: {
    Header,
    // ChatBox,
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

.sidebar {
  position: fixed;
  top: 68px;
  left: 0;
  width: 17%;
  height: calc(100% - 68px);
  overflow-y: auto;
  background-color: #f4f4f4;
}

.main-area {
  flex-grow: 1;
  margin-left: 17%;
  padding: 20px;
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
