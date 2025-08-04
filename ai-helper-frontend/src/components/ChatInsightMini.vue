<template>
  <div class="chat-mini-view no-scrollbar">
    <div v-if="chatList.length === 1 && chatList[0].role === 'ai' && !loading" class="welcome-area">
      <img src="/assets/logo.svg" class="welcome-logo no-radius" alt="logo" />
      <div class="welcome-title">Eva 全天待命，广告问题随时问~</div>
    </div>
    <div v-else class="chat-list">
      <div v-for="(msg, i) in chatList" :key="i" 
           :class="['msg', msg.role, { 'with-actions': msg.role==='ai' && msg.showActions }]"
           @mouseenter="msg.role==='ai' && msg.showActions ? handleMouseEnter(i) : null"
           @mouseleave="msg.role==='ai' && msg.showActions ? handleMouseLeave(i) : null">
        <span v-if="msg.role==='ai'" class="ai-avatar">🤖</span>
        <span v-else class="user-avatar">🧑</span>
        <div class="msg-content">
          <span class="msg-text">{{ msg.text }}</span>
          <!-- 只有AI回复且有操作按钮时才显示操作区域 -->
          <div v-if="msg.role==='ai' && msg.showActions && msg.hovered" class="msg-actions">
            <button class="action-btn" @click="markResolved(i)" title="已解决">👍</button>
            <button class="action-btn" @click="markUnresolved(i)" title="未解决">👎</button>
            <button class="action-btn" @click="copyText(msg.text)" title="复制">📋</button>
            <button class="action-btn" @click="quoteText(msg.text)" title="引用">💬</button>
            <button class="action-btn" @click="toggleFavorite(i)" :class="{ active: msg.favorite }" title="收藏">⭐</button>
          </div>
        </div>
      </div>
      
      <div v-if="loading" class="msg ai">
        <span class="ai-avatar">🤖</span>
        <span class="msg-text">AI助手正在输入...</span>
      </div>
    </div>
    <div class="suggest-list" v-if="!loading && input === ''">
      <div class="suggest-item" v-for="(q, idx) in (showAllQuestions ? questions : questions.slice(0,2))" :key="q" @click="onSuggestClick(q)">{{ q }}</div>
      <div v-if="questions.length > 2" class="toggle-questions" @click="toggleShowAllQuestions">
        <span>{{ showAllQuestions ? '收起' : '展开更多' }}</span>
      </div>
    </div>
    <div class="combined-input-container">
      <div class="dropdown-container">
        <div class="dropdown-wrapper">
          <select v-model="selectedAccount" class="account-dropdown">
            <option v-for="account in accounts" :key="account.id" :value="account.id">{{ account.name }}</option>
          </select>
        </div>
        <div class="dropdown-wrapper">
          <select v-model="selectedModule" class="module-dropdown">
            <option v-for="module in modules" :key="module.id" :value="module.id">{{ module.name }}</option>
          </select>
        </div>
      </div>
      <div class="chat-input-area beautify-input">
        <input class="chat-input" v-model="input" :maxlength="500" placeholder="请输入想要了解的内容" @keyup.enter="onSend" :disabled="loading" />
        <button class="send-btn beautify-btn" :disabled="!input.trim() || loading" @click="onSend">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.5 18.5L18.5 11L3.5 3.5V9.5L15.5 11L3.5 12.5V18.5Z" fill="currentColor"/></svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
const input = ref('')
// 账号列表模拟数据
const accounts = ref([
  { id: 'account1', name: '账号1' },
  { id: 'account2', name: '账号2' },
  { id: 'account3', name: '账号3' }
])
// 模块列表
const modules = ref([
  { id: 'global', name: '全局模式' },
  { id: 'data-analysis', name: '数据分析' },
  { id: 'meta-data', name: '元数据分析' },
  { id: 'operation-guide', name: '操作指引' }
])
// 选中的账号和模块
const selectedAccount = ref('account1')
const selectedModule = ref('global')
const questions = [
  '为何不建议预算充足的客户设置时间定向？',
  '同一计划下，哪些广告配置会被判定为重复？',
  '为何需要回传全链路事件数据？',
  '上传广告模板时，对图片格式和透明区域有啥具体要求？',
  '创意排行榜的主要功能是什么？',
]
const showAllQuestions = ref(false)

const chatList = ref([
  { role: 'ai', text: 'HI！我是你的智能投放助手，你可以尝试这样问我', favorite: false, showActions: false, hovered: false }
])
const loading = ref(false)
const historyList = ref([])

// 添加鼠标悬停事件处理
function handleMouseEnter(index) {
  if (chatList.value[index] && chatList.value[index].showActions) {
    chatList.value[index].hovered = true
  }
}

function handleMouseLeave(index) {
  if (chatList.value[index] && chatList.value[index].showActions) {
    chatList.value[index].hovered = false
  }
}

onMounted(() => {
  console.log('ChatInsightMini mounted, chatList:', chatList.value)
})

// 在simulateStreamAnswer中记录当前问题
let lastQuestion = ''
function send(msg) {
  if (!msg.trim()) return
  chatList.value.push({ role: 'user', text: msg })
  lastQuestion = msg
  input.value = ''
  simulateStreamAnswer(msg)
}

function onSuggestClick(q) {
  send(q)
}

function onSend() {
  send(input.value)
}

// 清空对话
function clearChat() {
  // 清空前先保存到历史记录
  if (chatList.value.length > 0 && (chatList.value.length > 1 || chatList.value[0].text !== 'HI！我是你的智能投放助手，你可以尝试这样问我')) {
    historyList.value.push({
      time: new Date().toLocaleString(),
      session: JSON.parse(JSON.stringify(chatList.value))
    })
  }
  chatList.value = [
    { role: 'ai', text: 'HI！我是你的智能投放助手，你可以尝试这样问我', favorite: false, showActions: false, hovered: false }
  ]
  input.value = ''
  loading.value = false
}

function getHistory() {
  return historyList.value
}

// 获取收藏内容
function getFavorites() {
  return chatList.value
    .filter(msg => msg.favorite)
    .map(msg => ({ question: msg.favoriteQuestion, answer: msg.text, time: msg.favoriteTime }))
}

// 更新收藏状态
function updateFavorites(favorites) {
  // 这里可以根据需要同步收藏状态
  console.log('更新收藏:', favorites)
}

// 模拟流式输出
function simulateStreamAnswer(question) {
  loading.value = true
  // 取最近3轮对话作为上下文
  const context = chatList.value.slice(-5).map(m => (m.role === 'user' ? '用户：' : 'AI：') + m.text).join('\n')
  let answer = getMockAnswer(question, context)
  let idx = 0
  let aiMsg = { role: 'ai', text: '', favorite: false, showActions: true, hovered: false }
  chatList.value.push(aiMsg)
  const interval = setInterval(() => {
    if (idx < answer.length) {
      aiMsg.text += answer[idx]
      idx++
    } else {
      clearInterval(interval)
      loading.value = false
    }
  }, 30)
}

function getMockAnswer(q, context = '') {
  // 多轮上下文示例：如用户连续追问，AI会参考上一轮内容
  if (q.includes('预算')) return '预算充足时，建议不设置时间定向，以便广告系统充分分配预算，提升投放效率。这样可以让系统根据实时流量和受众表现动态调整广告展示，避免因时间定向导致预算消耗不均或错失高效流量。同时，灵活的投放时间有助于捕捉更多潜在客户，提升整体ROI。若确有特殊需求，可结合历史数据分析后再做定向设置。' + (context.includes('ROI') ? '\n顺便补充，ROI提升还需关注转化率和素材创意的持续优化。' : '')
  if (q.includes('重复')) return '同一计划下，广告素材、定向、出价等配置完全一致时会被判定为重复。重复广告会影响系统的投放分配，可能导致部分广告无法获得有效曝光。建议在同一计划内，合理区分广告创意和定向策略，提升整体投放多样性和效果。系统会优先推送表现更优的广告，重复配置可能造成资源浪费。' + (context.includes('多样性') ? '\n多样化的广告内容有助于覆盖更广泛的受众群体。' : '')
  if (q.includes('全链路')) return '全链路事件数据有助于广告效果归因和优化，建议完整回传。通过全链路数据，广告主可以追踪用户从点击到转化的每一个环节，精准分析投放效果，及时发现并优化转化漏斗中的问题环节。此外，完整的数据回传还能帮助系统更好地进行智能出价和人群定向，提升广告投放的整体ROI。' + (context.includes('归因') ? '\n如果你需要更详细的归因分析方法，也可以继续提问。' : '')
  if (q.includes('图片格式')) return '图片需为JPG/PNG格式，透明区域建议保留为白色背景，避免展示异常。上传广告素材时，建议遵循平台的尺寸和分辨率要求，确保图片清晰度和加载速度。对于含有透明区域的图片，建议在设计时预览不同背景下的效果，避免因透明像素导致广告展示不完整或影响用户体验。' + (context.includes('素材') ? '\n如需获取素材设计规范，可随时向我咨询。' : '')
  if (q.includes('创意排行榜')) return '创意排行榜可帮助你了解当前表现最佳的广告创意，助力优化投放策略。通过排行榜，广告主可以快速识别高转化、高点击的创意内容，及时调整和复制成功经验。同时，排行榜还能反映不同受众对创意的偏好，为后续创意制作和投放策略提供数据支持。建议定期关注并分析排行榜变化，持续提升广告效果。' + (context.includes('优化') ? '\n如果你想了解具体的优化建议，可以详细描述你的投放目标。' : '')
  // 默认：如用户连续追问，AI会承接上下文
  if (context && q.length < 10) return '针对您的追问，结合上文内容，建议持续关注数据表现，并灵活调整策略。如需更详细分析，请补充更多业务背景。'
  return '感谢提问，您的问题已收到，AI助手会持续学习为您提供更优解答。广告投放是一个动态优化的过程，建议结合实际业务目标和数据表现，灵活调整策略。如需更深入的数据分析或个性化建议，欢迎随时咨询AI助手，我们将为您提供专业支持。';
}

// 操作按钮功能
function markResolved(index) {
  console.log('标记已解决:', index)
  // 可添加已解决标记逻辑
}

function markUnresolved(index) {
  console.log('标记未解决:', index)
  // 可添加未解决标记逻辑
}

function copyText(text) {
  navigator.clipboard.writeText(text).then(() => {
    console.log('已复制到剪贴板')
  })
}

function quoteText(text) {
  input.value = `引用：${text}`
  console.log('已引用到输入框')
}

function toggleFavorite(index) {
  chatList.value[index].favorite = !chatList.value[index].favorite
  if (chatList.value[index].favorite && !chatList.value[index].favoriteTime) {
    chatList.value[index].favoriteTime = new Date().toLocaleString()
    // 记录提问内容
    if (chatList.value[index].role === 'ai') {
      // 找到上一条用户消息
      let userMsg = null
      for (let i = index - 1; i >= 0; i--) {
        if (chatList.value[i].role === 'user') {
          userMsg = chatList.value[i].text
          break
        }
      }
      chatList.value[index].favoriteQuestion = userMsg
    }
  }
  if (!chatList.value[index].favorite) {
    chatList.value[index].favoriteTime = undefined
    chatList.value[index].favoriteQuestion = undefined
  }
  console.log('收藏状态:', chatList.value[index].favorite)
}

function toggleShowAllQuestions() {
  showAllQuestions.value = !showAllQuestions.value
}

// 暴露方法给父组件
defineExpose({
  clearChat,
  getFavorites,
  updateFavorites,
  getHistory
})
</script>

<style scoped>
.chat-mini-view {
  padding: 24px 18px 12px 18px;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  margin: 0;
}
.greet {
  font-size: 1rem;
  color: #232946;
  margin-bottom: 16px;
  font-weight: 500;
}
.suggest-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 18px;
}
.suggest-item {
  background: #e9efff;
  color: #3e4a89;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 0.98rem;
  cursor: pointer;
  transition: background 0.2s;
}
.suggest-item:hover {
  background: #dbeafe;
}
.chat-input-area {
  margin-top: auto;
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(44,62,80,0.04);
  padding: 8px 12px;
}
.chat-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 1rem;
  background: transparent;
}
.send-btn {
  background: #3e4a89;
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}
.send-btn:disabled {
  background: #bfc8e6;
  cursor: not-allowed;
}
.chat-list {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.msg {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 0.98rem;
  line-height: 1.6;
  border-radius: 8px;
  padding: 4px;
  transition: background 0.2s;
}
.msg:hover {
  background: rgba(233, 239, 255, 0.3);
}
.msg.ai .ai-avatar {
  font-size: 1.2rem;
}
.msg.user .user-avatar {
  font-size: 1.2rem;
}
.msg-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-width: 100%;
  box-sizing: border-box;
}
.msg-text {
  background: #f6f8fc;
  border-radius: 8px;
  padding: 6px 12px;
  color: #232946;
  word-break: break-all;
}
.msg.user .msg-text {
  background: #e9efff;
  color: #3e4a89;
}
.msg-actions {
  display: flex;
  gap: 4px;
  align-items: center;
  animation: fadeIn 0.2s ease-in;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}
.action-btn {
  background: none;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  padding: 2px;
  border-radius: 4px;
  transition: background 0.2s;
  opacity: 0.6;
}
.action-btn:hover {
  background: #e9efff;
  opacity: 1;
}
.action-btn.active {
  opacity: 1;
  color: #ffd700;
}
.toggle-questions {
  color: #3e4a89;
  cursor: pointer;
  font-size: 0.95rem;
  margin-top: 4px;
  text-align: left;
  user-select: none;
}
.toggle-questions:hover {
  text-decoration: underline;
}
.welcome-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 70vh;
  gap: 24px;
}
.welcome-logo {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 2px 12px rgba(44,62,80,0.10);
}
.welcome-title {
  font-size: 1.35rem;
  color: #232946;
  font-weight: bold;
  text-align: center;
  letter-spacing: 1px;
}
.combined-input-container {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 14px;
  margin-bottom: 12px;
  width: 100%;
}

.dropdown-container {
  display: flex;
  gap: 12px;
  flex: 0 0 40%;
  margin-bottom: 0;
  padding: 0;
}

.dropdown-wrapper {
  flex: 1;
}

.account-dropdown, .module-dropdown {
  width: 100%;
  height: 44px;
  padding: 8px 12px;
  border: 1px solid #e9efff;
  border-radius: 8px;
  background: #fff;
  font-size: 1rem;
  color: #232946;
  outline: none;
  box-shadow: 0 2px 4px rgba(44,62,80,0.04);
  transition: border-color 0.2s;
}

.chat-input-area.beautify-input {
  flex: 1;
  margin-top: 0;
}

.account-dropdown:focus, .module-dropdown:focus {
  border-color: #3e4a89;
}

.beautify-input {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(44,62,80,0.06);
  padding: 10px 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 0;
}
.beautify-input .chat-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 1.08rem;
  background: transparent;
  padding: 8px 0;
  height: 44px;
  box-sizing: border-box;
}
.beautify-btn {
  background: linear-gradient(90deg, #ff9100 0%, #ffb300 100%);
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(255,145,0,0.08);
  transition: background 0.2s, box-shadow 0.2s;
}
.beautify-btn:disabled {
  background: #ffe0b2;
  color: #fff;
  cursor: not-allowed;
}
.beautify-btn:hover:not(:disabled) {
  background: linear-gradient(90deg, #ffb300 0%, #ff9100 100%);
  box-shadow: 0 4px 16px rgba(255,145,0,0.16);
}
.welcome-logo.no-radius {
  border-radius: 0;
}
.no-scrollbar {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>