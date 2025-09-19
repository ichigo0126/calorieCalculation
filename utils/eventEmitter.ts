// React Native用の軽量EventEmitter
class SimpleEventEmitter {
  private listeners: { [key: string]: Function[] } = {}

  on(event: string, callback: Function) {
    if (!this.listeners[event]) {
      this.listeners[event] = []
    }
    this.listeners[event].push(callback)
  }

  off(event: string, callback: Function) {
    if (!this.listeners[event]) return
    this.listeners[event] = this.listeners[event].filter(cb => cb !== callback)
  }

  emit(event: string, ...args: any[]) {
    if (!this.listeners[event]) return
    this.listeners[event].forEach(callback => callback(...args))
  }
}

export const eventEmitter = new SimpleEventEmitter()

// イベント定数
export const EVENTS = {
  MEAL_ADDED: 'meal_added',
  MEAL_UPDATED: 'meal_updated',
  MEAL_DELETED: 'meal_deleted',
  PROFILE_UPDATED: 'profile_updated',
}