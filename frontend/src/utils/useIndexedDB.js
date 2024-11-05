import { openDB } from 'idb'

const dbPromise = openDB('ChatAppDB', 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('chats')) {
      const store = db.createObjectStore('chats', { keyPath: 'id', autoIncrement: true })
      store.createIndex('user', 'user', { unique: false })
    }
  }
})

export const isIndexedDBAvailable = () => {
  return 'indexedDB' in window
}

export const saveMessage = async (userId, message) => {
  try {
    if (!userId || !message) {
      console.error('Invalid userId or message. Cannot save.')
      return
    }
    const db = await dbPromise
    await db.put('chats', { user: userId, message })
  } catch (error) {
    console.error('Failed to save message:', error)
  }
}

export const getMessagesByUser = async (userId) => {
  try {
    if (!userId) {
      return []
    }
    const db = await dbPromise
    return await db.getAllFromIndex('chats', 'user', userId)
  } catch (error) {
    console.error('Failed to retrieve messages:', error)
    return []
  }
}

export const initializeMessages = async (defaultMessages) => {
  const db = await dbPromise
  const existingMessages = await db.getAll('chats')

  if (existingMessages.length === 0) {
    for (const { userId, message } of defaultMessages) {
      await saveMessage(userId, message)
    }
    console.log('Initialized default messages in IndexedDB.')
  }
}

export const initializeMessagesById = async (userId, defaultMessages) => {
  const db = await dbPromise
  const existingMessages = await db.getAllFromIndex('chats', 'user', userId)

  if (existingMessages.length === 0) {
    for (const message of defaultMessages) {
      await saveMessage(userId, message)
    }
  } else {
    console.log('Messages already exist for user:', userId)
  }
}

export const checkConversationExists = async (userId) => {
  const messages = await getMessagesByUser(userId)
  return messages.length > 0
}

export const deleteDatabase = async () => {
  try {
    indexedDB.deleteDatabase('ChatAppDB')
    return true
  } catch (error) {
    console.error(`Failed to delete database "ChatAppDB":`, error)
  }
}
