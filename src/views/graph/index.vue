<template>
  <div style="padding:30px;">
    <el-alert :closable="false" title="这里做知识图谱的查询" type="success">
      <router-view />
    </el-alert>
  </div>
</template>
