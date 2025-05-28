"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import ChatInterface from "@/components/chat-interface"
import RichTextEditor from "@/components/rich-text-editor"

export default function NotionHomepage() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [sharedContent, setSharedContent] = useState<string | null>(null)

  const handleShareToChat = (content: string) => {
    setSharedContent(content)
    setIsChatOpen(true)
  }

  return (
    <div className="min-h-screen bg-[#191919] text-white">
      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="space-y-6">
          {/* Rich Text Editor */}
          <RichTextEditor onShareToChat={handleShareToChat} />
        </div>
      </main>

      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="w-12 h-12 rounded-full bg-white text-black hover:bg-gray-100 shadow-lg"
          size="sm"
        >
          {isChatOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <div className="flex items-center justify-center">
              <span className="text-lg font-serif">𝒯</span>
            </div>
          )}
        </Button>
      </div>

      {/* Chat Interface */}
      <ChatInterface
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        sharedContent={sharedContent}
        onContentShared={() => setSharedContent(null)}
      />
    </div>
  )
}
