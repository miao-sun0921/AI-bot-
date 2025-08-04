<template>
  <div>
    <!-- 悬浮球 -->
    <div class="float-ball" @click="open = true">
      <img src="https://cdn.jsdelivr.net/gh/duogongneng/test-public/ai-avatar.png" alt="AI助手" class="avatar" />
    </div>
    <!-- 遮罩和弹窗 -->
    <transition name="slide-right">
      <div v-if="open" class="assistant-sidebar-mask" @click.self="open = false">
        <div class="assistant-sidebar no-radius">
          <div class="window-header">
            <div class="header-center">
              <img src="https://cdn.jsdelivr.net/gh/duogongneng/test-public/alina-logo.png" alt="logo" class="logo-img no-radius" />
              <span class="product-name">Eva</span>
            </div>
            <div class="header-actions">
              <button class="action-icon" @click="clearChat" title="清空对话">🗑️</button>
              <button class="action-icon" @click="toggleFavorites" title="收藏记录">⭐</button>
              <button class="close-btn" @click="open = false">×</button>
            </div>
          </div>
          <div class="window-body no-scrollbar">
            <ChatInsightMini ref="chatComponent" />
          </div>
        </div>
        <!-- 收藏侧边栏 -->
        <transition name="slide">
          <div v-if="showFavorites" class="favorites-panel">
            <div class="favorites-header">
              <span>收藏</span>
              <button class="close-btn" @click="showFavorites = false">×</button>
            </div>
            <div class="favorites-content">
              <div v-if="favorites.length === 0" class="empty-favorites">
                暂无收藏内容
              </div>
              <div v-else>
                <div v-for="(item, index) in favorites" :key="index" class="favorite-card">
                  <div class="card-header">
                    <div class="card-title">{{ item.question || '—' }}</div>
                    <div class="card-actions">
                      <button class="card-menu" title="更多操作">⋯</button>
                    </div>
                  </div>
                  <div class="card-body">
                    <div class="card-answer" v-if="item.answer">
                      <span v-if="!item.expanded">{{ item.answer.length > 80 ? item.answer.slice(0, 80) + '...' : item.answer }}</span>
                      <span v-else>{{ item.answer }}</span>
                      <span v-if="item.answer.length > 80" class="expand-btn" @click="item.expanded = !item.expanded">{{ item.expanded ? '收起' : '展开' }}</span>
                    </div>
                  </div>
                  <div class="card-footer">
                    <span class="favorite-time">{{ item.time }}</span>
                    <div class="favorite-actions">
                      <button class="mini-btn" @click="copyFavorite(item.answer)" title="复制">📋</button>
                      <button class="mini-btn" @click="removeFavorite(index)" title="删除">❌</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ChatInsightMini from './ChatInsightMini.vue'

const open = ref(false)
const showFavorites = ref(false)
const chatComponent = ref(null)
const favorites = ref([])

function clearChat() {
  if (chatComponent.value) {
    chatComponent.value.clearChat()
  }
}

function toggleFavorites() {
  showFavorites.value = !showFavorites.value
  // 从聊天组件获取收藏内容
  if (showFavorites.value && chatComponent.value) {
    favorites.value = chatComponent.value.getFavorites()
  }
}

function copyFavorite(text) {
  navigator.clipboard.writeText(text).then(() => {
    console.log('已复制收藏内容')
  })
}

function removeFavorite(index) {
  favorites.value.splice(index, 1)
  // 同步到聊天组件
  if (chatComponent.value) {
    chatComponent.value.updateFavorites(favorites.value)
  }
}
</script>

<style scoped>
.float-ball {
  position: fixed;
  right: 36px;
  bottom: 60px;
  width: 64px;
  height: 64px;
  background: linear-gradient(120deg, #e9efff 0%, #3e4a89 100%);
  border-radius: 50%;
  box-shadow: 0 4px 24px rgba(44,62,80,0.16);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 2000;
  transition: box-shadow 0.2s, transform 0.2s;
}
.float-ball:hover {
  box-shadow: 0 8px 32px rgba(44,62,80,0.24);
  transform: scale(1.08);
}
.avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #fff;
}
.assistant-sidebar-mask {
  position: fixed;
  inset: 0;
  background: rgba(44,62,80,0.10);
  z-index: 2100;
  display: flex;
  justify-content: flex-end;
  align-items: stretch;
}
.assistant-sidebar {
  width: 600px;
  max-width: 96vw;
  height: 100vh;
  background: #fff;
  border-radius: 18px 0 0 18px;
  box-shadow: -4px 0 32px rgba(44,62,80,0.12);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  animation: sidebarIn 0.3s;
}
.assistant-sidebar.no-radius {
  border-radius: 0;
}
.window-header {
  height: 64px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  box-shadow: 0 2px 8px rgba(44,62,80,0.04);
  font-size: 1.3rem;
  font-weight: 500;
  color: #232946;
  position: relative;
}
.header-center {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  gap: 12px;
}

.header-actions {
  display: flex;
  gap: 12px;
  margin-left: auto;
}
.logo-img {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: #fff;
  object-fit: contain;
  box-shadow: 0 2px 8px rgba(44,62,80,0.06);
}
.logo-img.no-radius {
  border-radius: 0;
}
.product-name {
  font-size: 1.15rem;
  font-weight: bold;
  color: #232946;
  letter-spacing: 1px;
}
.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 2;
}
.action-icon {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background 0.2s;
  opacity: 0.8;
}
.action-icon:hover {
  background: rgba(255,255,255,0.2);
  opacity: 1;
}
.close-btn {
  background: none;
  border: none;
  font-size: 2rem;
  color: #232946;
  cursor: pointer;
  line-height: 1;
}
.window-body {
  flex: 1;
  padding: 0;
  overflow-y: auto;
  background: #f6f8fc;
  display: flex;
  flex-direction: column;
}
.window-body.no-scrollbar {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.window-body.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.favorites-panel {
  width: 300px;
  height: 100vh;
  background: #fff;
  border-radius: 18px 18px 0 0;
  box-shadow: 0 8px 32px rgba(44,62,80,0.18);
  margin: 0 12px 0 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.favorites-header {
  height: 56px;
  background: linear-gradient(90deg, #e9efff 0%, #3e4a89 100%);
  color: #232946;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  font-size: 1.1rem;
  font-weight: 600;
}
.favorites-content {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  background: #f6f8fc;
}
.empty-favorites {
  text-align: center;
  color: #6b7a99;
  padding: 40px 20px;
  font-size: 0.9rem;
}
.favorite-card {
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 2px 12px rgba(44,62,80,0.08);
  margin-bottom: 18px;
  padding: 18px 20px 12px 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
}
.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 6px;
}
.card-title {
  font-weight: bold;
  font-size: 1.08rem;
  color: #232946;
  line-height: 1.4;
  word-break: break-all;
}
.card-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}
.card-menu {
  background: none;
  border: none;
  font-size: 1.4rem;
  color: #bfc8e6;
  cursor: pointer;
  padding: 0 4px;
  border-radius: 4px;
  transition: background 0.2s;
}
.card-menu:hover {
  background: #e9efff;
  color: #3e4a89;
}
.card-body {
  font-size: 0.98rem;
  color: #232946;
  line-height: 1.7;
  margin-bottom: 4px;
  white-space: pre-line;
}
.card-answer {
  margin-bottom: 2px;
}
.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.92rem;
  color: #6b7a99;
  margin-top: 2px;
}
.favorite-time {
  color: #6b7a99;
  font-size: 0.9rem;
}
.expand-btn {
  color: #3e4a89;
  cursor: pointer;
  font-size: 0.95rem;
  margin-left: 8px;
  user-select: none;
}
.expand-btn:hover {
  text-decoration: underline;
}
.favorite-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}
.mini-btn {
  background: none;
  border: none;
  font-size: 0.98rem;
  cursor: pointer;
  padding: 2px;
  border-radius: 2px;
  transition: background 0.2s;
}
.mini-btn:hover {
  background: #e9efff;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.slide-enter-active, .slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from, .slide-leave-to {
  transform: translateX(100%);
}
.slide-right-enter-active, .slide-right-leave-active {
  transition: transform 0.3s cubic-bezier(.4,0,.2,1);
}
.slide-right-enter-from, .slide-right-leave-to {
  transform: translateX(100%);
}
.slide-right-enter-to, .slide-right-leave-from {
  transform: translateX(0);
}
.favorite-q {
  color: #3e4a89;
  font-size: 0.92rem;
  margin-bottom: 2px;
  word-break: break-all;
}
.favorite-a {
  color: #232946;
  font-size: 0.92rem;
  margin-bottom: 2px;
  word-break: break-all;
}
</style>