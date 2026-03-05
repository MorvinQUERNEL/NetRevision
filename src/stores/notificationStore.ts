import { create } from 'zustand'

interface NotificationSettings {
  enabled: boolean
  dailyReminder: boolean
  reminderHour: number
  challengeAlerts: boolean
  streakAlerts: boolean
}

interface NotificationStore {
  settings: NotificationSettings
  permission: NotificationPermission
  updateSettings: (partial: Partial<NotificationSettings>) => void
  requestPermission: () => Promise<void>
  scheduleReminder: () => void
  sendNotification: (title: string, body: string, url?: string) => void
}

const getStoredSettings = (): NotificationSettings => {
  try {
    const stored = localStorage.getItem('nr_notification_settings')
    if (stored) return JSON.parse(stored)
  } catch {}
  return {
    enabled: false,
    dailyReminder: true,
    reminderHour: 19,
    challengeAlerts: true,
    streakAlerts: true,
  }
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  settings: getStoredSettings(),
  permission: typeof Notification !== 'undefined' ? Notification.permission : 'default',

  updateSettings: (partial) => {
    set((s) => {
      const settings = { ...s.settings, ...partial }
      localStorage.setItem('nr_notification_settings', JSON.stringify(settings))
      return { settings }
    })
  },

  requestPermission: async () => {
    if (typeof Notification === 'undefined') return
    const perm = await Notification.requestPermission()
    set({ permission: perm })
    if (perm === 'granted') {
      get().updateSettings({ enabled: true })
      get().scheduleReminder()
    }
  },

  scheduleReminder: () => {
    const { settings } = get()
    if (!settings.enabled || !settings.dailyReminder) return

    const now = new Date()
    const target = new Date()
    target.setHours(settings.reminderHour, 0, 0, 0)
    if (target <= now) target.setDate(target.getDate() + 1)

    const delay = target.getTime() - now.getTime()
    setTimeout(() => {
      get().sendNotification(
        'Temps de reviser !',
        'N\'oublie pas ta session de revision quotidienne sur NetRevision.',
        '/dashboard'
      )
      get().scheduleReminder()
    }, delay)
  },

  sendNotification: (title, body, url) => {
    const { settings, permission } = get()
    if (!settings.enabled || permission !== 'granted') return

    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.ready.then((reg) => {
        reg.showNotification(title, {
          body,
          icon: '/logo-192.png',
          badge: '/favicon-32.png',
          data: { url: url || '/' },
        })
      })
    } else {
      new Notification(title, { body, icon: '/logo-192.png' })
    }
  },
}))
