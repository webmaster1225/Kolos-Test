import { Server } from 'socket.io'

// This will be set by the custom server
let ioInstance: Server | null = null

export function setSocketInstance(io: Server) {
  ioInstance = io
}

export function getSocketInstance(): Server | null {
  return ioInstance
}

export function emitCallData(callData: any) {
  if (ioInstance) {
    ioInstance.emit('call_data', callData)
    console.log('Emitted call data via WebSocket:', callData)
  } else {
    console.warn('Socket.IO instance not available')
  }
}

