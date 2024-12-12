<template>
  <div class="animate-pulse space-y-6">
    <!-- City and Temperature Skeleton -->
    <div class="flex items-center justify-between">
      <div class="space-y-2">
        <div class="h-8 w-48 bg-white/20 rounded"></div>
        <div class="h-4 w-32 bg-white/20 rounded"></div>
      </div>
      <div class="h-16 w-24 bg-white/20 rounded"></div>
    </div>

    <!-- Weather Description Skeleton -->
    <div class="h-32 bg-white/20 rounded-xl"></div>

    <!-- Weather Details Skeleton -->
    <div class="grid grid-cols-2 gap-4">
      <div class="h-28 bg-white/20 rounded-xl"></div>
      <div class="h-28 bg-white/20 rounded-xl"></div>
    </div>

    <!-- Hourly Forecast Skeleton -->
    <div class="space-y-4">
      <div class="h-6 w-40 bg-white/20 rounded"></div>
      <div class="flex gap-4 overflow-x-auto pb-4">
        <div v-for="n in 8" :key="n" class="flex-shrink-0 w-[100px] h-[180px] bg-white/20 rounded-xl"></div>
      </div>
    </div>
  </div>
</template>
