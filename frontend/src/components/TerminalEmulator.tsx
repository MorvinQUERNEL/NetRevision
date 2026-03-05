import { useState, useEffect, useRef, useCallback } from 'react'
import { DeviceState, processCommand, getPrompt } from '../data/ciscoCommands'

interface TerminalEmulatorProps {
  deviceState: DeviceState
  onStateChange: (state: DeviceState) => void
  welcomeMessage?: string
  mode?: 'cisco' | 'devops'
  onCommand?: (command: string) => void
}

interface TerminalLine {
  text: string
  type: 'input' | 'output' | 'system'
}

export default function TerminalEmulator({ deviceState, onStateChange, welcomeMessage, mode = 'cisco', onCommand }: TerminalEmulatorProps) {
  const [lines, setLines] = useState<TerminalLine[]>(() => {
    const initial: TerminalLine[] = []
    if (welcomeMessage) {
      initial.push({ text: welcomeMessage, type: 'system' })
    }
    initial.push({ text: '', type: 'system' }) // blank line
    return initial
  })
  const [currentInput, setCurrentInput] = useState('')
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [cursorVisible, setCursorVisible] = useState(true)

  const terminalRef = useRef<HTMLDivElement>(null)
  const inputCapture = useRef<HTMLDivElement>(null)

  // Blinking cursor
  useEffect(() => {
    const interval = setInterval(() => setCursorVisible(v => !v), 530)
    return () => clearInterval(interval)
  }, [])

  // Auto-scroll to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [lines])

  // Focus terminal on click
  const handleTerminalClick = useCallback(() => {
    inputCapture.current?.focus()
  }, [])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    e.preventDefault()

    if (e.key === 'Enter') {
      const prompt = mode === 'devops' ? '$ ' : getPrompt(deviceState)
      // Add the input line
      setLines(prev => [...prev, { text: `${prompt}${currentInput}`, type: 'input' }])

      if (currentInput.trim()) {
        if (mode === 'devops') {
          // DevOps mode: notify parent of command, show simple feedback
          if (onCommand) onCommand(currentInput.trim())
          setCommandHistory(prev => [...prev, currentInput])
        } else {
          // Cisco mode: process command through IOS state machine
          const result = processCommand(currentInput, deviceState)

          // Add output if any
          if (result.output) {
            const outputLines = result.output.split('\n')
            setLines(prev => [
              ...prev,
              ...outputLines.map(text => ({ text, type: 'output' as const })),
            ])
          }

          // Update command history
          setCommandHistory(prev => [...prev, currentInput])

          // Update device state
          onStateChange(result.newState)
        }
      }

      setCurrentInput('')
      setHistoryIndex(-1)
    } else if (e.key === 'Backspace') {
      setCurrentInput(prev => prev.slice(0, -1))
    } else if (e.key === 'ArrowUp') {
      setCommandHistory(prev => {
        const newIdx = historyIndex < prev.length - 1 ? historyIndex + 1 : historyIndex
        if (newIdx >= 0 && newIdx < prev.length) {
          setCurrentInput(prev[prev.length - 1 - newIdx])
          setHistoryIndex(newIdx)
        }
        return prev
      })
    } else if (e.key === 'ArrowDown') {
      if (historyIndex > 0) {
        const newIdx = historyIndex - 1
        setHistoryIndex(newIdx)
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIdx] || '')
      } else {
        setHistoryIndex(-1)
        setCurrentInput('')
      }
    } else if (e.key === 'Tab') {
      // Basic tab completion - just ignore for now
    } else if (e.key.length === 1) {
      setCurrentInput(prev => prev + e.key)
    }
  }, [currentInput, deviceState, historyIndex, commandHistory, onStateChange])

  const prompt = mode === 'devops' ? '$ ' : getPrompt(deviceState)

  return (
    <div data-theme="dark">
    <div
      ref={terminalRef}
      onClick={handleTerminalClick}
      style={{
        background: '#0a0e1a',
        border: '1px solid #1a2040',
        height: '100%',
        minHeight: 400,
        overflow: 'auto',
        padding: '12px 16px',
        fontFamily: 'var(--font-mono)',
        fontSize: 13,
        lineHeight: 1.6,
        color: '#00e5a0',
        cursor: 'text',
        position: 'relative',
      }}
    >
      {/* Hidden input catcher for focus */}
      <div
        ref={inputCapture}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
      />

      {/* Rendered lines */}
      {lines.map((line, i) => (
        <div key={i} style={{
          color: line.type === 'system' ? '#6366f1' : line.type === 'input' ? '#00e5a0' : '#94a3b8',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-all',
          minHeight: line.text ? undefined : '1.6em',
        }}>
          {line.text}
        </div>
      ))}

      {/* Current input line */}
      <div style={{ display: 'flex', whiteSpace: 'pre' }}>
        <span style={{ color: '#00e5a0' }}>{prompt}</span>
        <span style={{ color: '#e2e8f0' }}>{currentInput}</span>
        <span style={{
          color: '#00e5a0',
          opacity: cursorVisible ? 1 : 0,
          transition: 'opacity 0.05s',
        }}>_</span>
      </div>
    </div>
    </div>
  )
}
