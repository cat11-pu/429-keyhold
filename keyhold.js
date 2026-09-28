// keyhold.js：键有没有被占、该键最早的候补、把占位换成新任务（基线：一律给假与零与空）
export function holdsKey(hold, key) {
  return false;
}

export function firstWaiting(queue, key) {
  return 0;
}

export function relayed(hold, key, task) {
  return hold;
}
