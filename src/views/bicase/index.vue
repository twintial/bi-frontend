<template>
  <div style="padding:30px;">
    <el-alert :closable="false" title="这里做智能分析应用的查询" type="success">
      <router-view />
    </el-alert>
  </div>
</template>
