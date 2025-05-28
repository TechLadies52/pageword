"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Sparkles, FileText, ImageIcon, Lightbulb, Paperclip, Minimize2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
  isHtml?: boolean
}

interface ChatInterfaceProps {
  isOpen: boolean
  onClose: () => void
  sharedContent?: string | null
  onContentShared?: () => void
}

export default function ChatInterface({
  isOpen,
  onClose,
  sharedContent = null,
  onContentShared = () => {},
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Handle shared content from the rich text editor
  useEffect(() => {
    if (sharedContent && isOpen) {
      const sharedMessage: Message = {
        id: Date.now().toString(),
        content: sharedContent,
        isUser: true,
        timestamp: new Date(),
        isHtml: true,
      }

      setMessages((prev) => [...prev, sharedMessage])

      // Simulate AI response to the shared content
      setIsLoading(true)
      setTimeout(() => {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: `Recebi seu conteúdo formatado. Posso ajudar a editar, expandir ou revisar este texto. O que você gostaria de fazer com ele?`,
          isUser: false,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, aiMessage])
        setIsLoading(false)
        onContentShared()
      }, 1000)
    }
  }, [sharedContent, isOpen, onContentShared])

  const suggestedActions = [
    {
      icon: <Sparkles className="h-4 w-4" />,
      text: "Ajudar com formatação de texto",
      color: "text-blue-400",
    },
    {
      icon: <FileText className="h-4 w-4" />,
      text: "Revisar e melhorar o documento",
      color: "text-green-400",
    },
    {
      icon: <ImageIcon className="h-4 w-4" />,
      text: "Sugerir estrutura do documento",
      color: "text-purple-400",
    },
    {
      icon: <Lightbulb className="h-4 w-4" />,
      text: "Corrigir gramática e ortografia",
      color: "text-yellow-400",
    },
  ]

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Entendi sua pergunta: "${userMessage.content}". Como assistente IA do Notion, posso ajudá-lo com criação de páginas, organização de conteúdo, análise de documentos e muito mais. Como posso ajudá-lo especificamente?`,
        isUser: false,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
      setIsLoading(false)
    }, 1000)
  }

  const handleSuggestedAction = (action: string) => {
    setInputValue(action)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed bottom-20 right-6 w-96 h-[500px] bg-[#1a1a1a] border border-gray-700 rounded-lg shadow-2xl z-40 flex flex-col">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <span className="text-black font-serif text-sm">𝒯</span>
          </div>
          <div>
            <h3 className="text-white font-medium">Como posso ajudar?</h3>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-white">
          <Minimize2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="space-y-3">
            {suggestedActions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleSuggestedAction(action.text)}
                className="w-full text-left p-3 rounded-lg bg-[#2a2a2a] hover:bg-[#333] transition-colors border border-gray-700"
              >
                <div className="flex items-center space-x-3">
                  <div className={action.color}>{action.icon}</div>
                  <span className="text-gray-300 text-sm">{action.text}</span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
                <div
                  className={cn(
                    "max-w-[80%] p-3 rounded-lg",
                    message.isUser ? "bg-blue-600 text-white" : "bg-[#2a2a2a] text-gray-300 border border-gray-700",
                    message.isHtml && "max-w-full w-full",
                  )}
                >
                  {message.isHtml ? (
                    <div
                      className="text-sm prose prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: message.content }}
                    />
                  ) : (
                    <p className="text-sm">{message.content}</p>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-[#2a2a2a] text-gray-300 border border-gray-700 p-3 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Peça qualquer coisa à IA..."
              className="bg-[#2a2a2a] border-gray-600 text-white placeholder-gray-400 pr-20"
              disabled={isLoading}
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-1">
                <Paperclip className="h-4 w-4" />
              </Button>
              <span className="text-xs text-gray-500">Todas as fontes</span>
            </div>
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            size="sm"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
