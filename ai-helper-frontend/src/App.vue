<script setup>
// 预留脚本
import FloatAssistant from './components/FloatAssistant.vue'
</script>

<template>
  <div class="app-layout">
    <aside class="sidebar">
      <div class="logo">AI助手</div>
      <nav>
        <router-link to="/ad-management">广告管理</router-link>
      </nav>
    </aside>
    <div class="main-content">
      <header class="topbar">
        <span class="title">AI广告投放助手</span>
        <!-- 可扩展：用户头像、设置等 -->
      </header>
      <main class="content-area">
        <router-view />
      </main>
    </div>
    <FloatAssistant />
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  height: 100vh;
  background: linear-gradient(120deg, #f6f8fc 0%, #e9efff 100%);
}
.sidebar {
  width: 220px;
  background: #232946;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 0;
  box-shadow: 2px 0 8px rgba(44,62,80,0.04);
}
.logo {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 48px;
  letter-spacing: 2px;
}
nav {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  align-items: center;
}
nav a {
  color: #fff;
  text-decoration: none;
  font-size: 1.1rem;
  padding: 8px 24px;
  border-radius: 8px;
  transition: background 0.2s;
}
nav a.router-link-active {
  background: #3e4a89;
}
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.topbar {
  height: 64px;
  background: #fff;
  display: flex;
  align-items: center;
  padding: 0 32px;
  box-shadow: 0 2px 8px rgba(44,62,80,0.04);
  font-size: 1.3rem;
  font-weight: 500;
  color: #232946;
}
.content-area {
  flex: 1;
  padding: 40px;
  background: transparent;
  overflow-y: auto;
}
</style>
