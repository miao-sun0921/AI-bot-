<template>
  <div class="ad-management-view">
    <h2>广告管理</h2>
    <p class="desc">统一管理广告投放计划与素材。</p>
    <div class="ad-list">
      <div class="ad-item" v-for="ad in ads" :key="ad.id">
        <div class="ad-title">{{ ad.title }}</div>
        <div class="ad-status">状态：{{ ad.status }}</div>
        <button class="manage-btn">管理</button>
      </div>
    </div>
    <div class="add-entry">
      <button class="add-btn">新建广告</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const ads = ref([
  { id: 1, title: '品牌曝光-7月', status: '投放中' },
  { id: 2, title: '新品推广-夏季', status: '已结束' },
])
</script>

<style scoped>
.ad-management-view {
  max-width: 900px;
  margin: 0 auto;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 24px rgba(44,62,80,0.08);
  padding: 48px 32px;
}
.desc {
  color: #6b7a99;
  margin-bottom: 32px;
}
.ad-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 40px;
}
.ad-item {
  background: linear-gradient(100deg, #e9efff 0%, #f6f8fc 100%);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(44,62,80,0.04);
  padding: 24px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.ad-title {
  font-size: 1.1rem;
  color: #232946;
  font-weight: 500;
}
.ad-status {
  color: #3e4a89;
}
.manage-btn {
  background: #232946;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 8px 20px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}
.manage-btn:hover {
  background: #3e4a89;
}
.add-entry {
  text-align: right;
}
.add-btn {
  background: #3e4a89;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 12px 32px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}
.add-btn:hover {
  background: #232946;
}
</style> 