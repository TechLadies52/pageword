"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import Placeholder from "@tiptap/extension-placeholder"
import TextAlign from "@tiptap/extension-text-align"
import {
  Bold,
  Italic,
  UnderlineIcon,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  LinkIcon,
  ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Code,
  Quote,
  Undo,
  Redo,
  Download,
  MessageSquare,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface RichTextEditorProps {
  onShareToChat?: (content: string) => void
}

export default function RichTextEditor({ onShareToChat }: RichTextEditorProps) {
  const [isLinkInputVisible, setIsLinkInputVisible] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")
  const [isImageInputVisible, setIsImageInputVisible] = useState(false)
  const [imageUrl, setImageUrl] = useState("")

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-400 underline cursor-pointer hover:text-blue-300",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-md max-w-full my-4",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder: "Comece a escrever seu documento...",
      }),
    ],
    content: "",
    editorProps: {
      attributes: {
        class: "prose prose-invert max-w-none focus:outline-none min-h-[400px] px-6 py-4 text-gray-200",
      },
    },
  })

  const setLink = () => {
    if (!editor) return

    if (linkUrl === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run()
      return
    }

    // Add https:// if not present
    const url = linkUrl.startsWith("http") ? linkUrl : `https://${linkUrl}`

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()

    setLinkUrl("")
    setIsLinkInputVisible(false)
  }

  const addImage = () => {
    if (!editor) return

    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run()
      setImageUrl("")
      setIsImageInputVisible(false)
    }
  }

  const exportDocument = () => {
    if (!editor) return

    const htmlContent = editor.getHTML()
    const textContent = editor.getText()
    const jsonContent = editor.getJSON()

    // Log the formatted document to console
    console.log("=== DOCUMENT EXPORT ===")
    console.log("HTML Content:", htmlContent)
    console.log("Plain Text:", textContent)
    console.log("JSON Structure:", jsonContent)
    console.log("Word Count:", textContent.split(/\s+/).filter((word) => word.length > 0).length)
    console.log("Character Count:", textContent.length)
    console.log("======================")

    // You could also create a downloadable file here in the future
    // const blob = new Blob([htmlContent], { type: 'text/html' })
    // const url = URL.createObjectURL(blob)
    // const a = document.createElement('a')
    // a.href = url
    // a.download = 'document.html'
    // a.click()
  }

  const shareToChat = () => {
    if (!editor || !onShareToChat) return

    const content = editor.getHTML()
    onShareToChat(content)
  }

  if (!editor) {
    return (
      <div className="border border-gray-800 rounded-lg bg-[#1e1e1e] p-8">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="border border-gray-800 rounded-lg bg-[#1e1e1e] overflow-hidden shadow-xl">
      {/* Document Header */}
      <div className="px-6 py-4 border-b border-gray-800 bg-[#252525]">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-200">Documento</h1>
            <p className="text-sm text-gray-400">Editor de texto rico</p>
          </div>
          <div className="flex items-center space-x-2">
            {onShareToChat && (
              <Button
                variant="outline"
                size="sm"
                onClick={shareToChat}
                className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Compartilhar no Chat
              </Button>
            )}
            <Button
              variant="default"
              size="sm"
              onClick={exportDocument}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-3 border-b border-gray-800 bg-[#252525]">
        {/* Text Formatting */}
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={cn(
              "text-gray-400 hover:text-white hover:bg-gray-700 h-8 w-8 p-0",
              editor.isActive("bold") && "bg-gray-700 text-white",
            )}
          >
            <Bold className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={cn(
              "text-gray-400 hover:text-white hover:bg-gray-700 h-8 w-8 p-0",
              editor.isActive("italic") && "bg-gray-700 text-white",
            )}
          >
            <Italic className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={cn(
              "text-gray-400 hover:text-white hover:bg-gray-700 h-8 w-8 p-0",
              editor.isActive("underline") && "bg-gray-700 text-white",
            )}
          >
            <UnderlineIcon className="h-4 w-4" />
          </Button>
        </div>

        <div className="w-px h-6 bg-gray-700 mx-2" />

        {/* Headings */}
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={cn(
              "text-gray-400 hover:text-white hover:bg-gray-700 h-8 w-8 p-0",
              editor.isActive("heading", { level: 1 }) && "bg-gray-700 text-white",
            )}
          >
            <Heading1 className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={cn(
              "text-gray-400 hover:text-white hover:bg-gray-700 h-8 w-8 p-0",
              editor.isActive("heading", { level: 2 }) && "bg-gray-700 text-white",
            )}
          >
            <Heading2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="w-px h-6 bg-gray-700 mx-2" />

        {/* Lists */}
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={cn(
              "text-gray-400 hover:text-white hover:bg-gray-700 h-8 w-8 p-0",
              editor.isActive("bulletList") && "bg-gray-700 text-white",
            )}
          >
            <List className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={cn(
              "text-gray-400 hover:text-white hover:bg-gray-700 h-8 w-8 p-0",
              editor.isActive("orderedList") && "bg-gray-700 text-white",
            )}
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
        </div>

        <div className="w-px h-6 bg-gray-700 mx-2" />

        {/* Alignment */}
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            className={cn(
              "text-gray-400 hover:text-white hover:bg-gray-700 h-8 w-8 p-0",
              editor.isActive({ textAlign: "left" }) && "bg-gray-700 text-white",
            )}
          >
            <AlignLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            className={cn(
              "text-gray-400 hover:text-white hover:bg-gray-700 h-8 w-8 p-0",
              editor.isActive({ textAlign: "center" }) && "bg-gray-700 text-white",
            )}
          >
            <AlignCenter className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            className={cn(
              "text-gray-400 hover:text-white hover:bg-gray-700 h-8 w-8 p-0",
              editor.isActive({ textAlign: "right" }) && "bg-gray-700 text-white",
            )}
          >
            <AlignRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="w-px h-6 bg-gray-700 mx-2" />

        {/* Special Formatting */}
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={cn(
              "text-gray-400 hover:text-white hover:bg-gray-700 h-8 w-8 p-0",
              editor.isActive("codeBlock") && "bg-gray-700 text-white",
            )}
          >
            <Code className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={cn(
              "text-gray-400 hover:text-white hover:bg-gray-700 h-8 w-8 p-0",
              editor.isActive("blockquote") && "bg-gray-700 text-white",
            )}
          >
            <Quote className="h-4 w-4" />
          </Button>
        </div>

        <div className="w-px h-6 bg-gray-700 mx-2" />

        {/* Media */}
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsLinkInputVisible(!isLinkInputVisible)}
            className={cn(
              "text-gray-400 hover:text-white hover:bg-gray-700 h-8 w-8 p-0",
              editor.isActive("link") && "bg-gray-700 text-white",
            )}
          >
            <LinkIcon className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsImageInputVisible(!isImageInputVisible)}
            className="text-gray-400 hover:text-white hover:bg-gray-700 h-8 w-8 p-0"
          >
            <ImageIcon className="h-4 w-4" />
          </Button>
        </div>

        <div className="w-px h-6 bg-gray-700 mx-2" />

        {/* History */}
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="text-gray-400 hover:text-white hover:bg-gray-700 h-8 w-8 p-0 disabled:opacity-50"
          >
            <Undo className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="text-gray-400 hover:text-white hover:bg-gray-700 h-8 w-8 p-0 disabled:opacity-50"
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Link Input */}
      {isLinkInputVisible && (
        <div className="p-3 bg-[#252525] border-b border-gray-800 flex items-center gap-3">
          <input
            type="text"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="Digite a URL (ex: https://exemplo.com)"
            className="flex-1 bg-[#1a1a1a] border border-gray-700 rounded px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setLink()
              } else if (e.key === "Escape") {
                setIsLinkInputVisible(false)
              }
            }}
            autoFocus
          />
          <Button size="sm" onClick={setLink} className="bg-blue-600 hover:bg-blue-700 text-white">
            Adicionar
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsLinkInputVisible(false)}
            className="text-gray-400 hover:text-white"
          >
            Cancelar
          </Button>
        </div>
      )}

      {/* Image Input */}
      {isImageInputVisible && (
        <div className="p-3 bg-[#252525] border-b border-gray-800 flex items-center gap-3">
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Digite a URL da imagem"
            className="flex-1 bg-[#1a1a1a] border border-gray-700 rounded px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addImage()
              } else if (e.key === "Escape") {
                setIsImageInputVisible(false)
              }
            }}
            autoFocus
          />
          <Button size="sm" onClick={addImage} className="bg-blue-600 hover:bg-blue-700 text-white">
            Adicionar
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsImageInputVisible(false)}
            className="text-gray-400 hover:text-white"
          >
            Cancelar
          </Button>
        </div>
      )}

      {/* Editor Content */}
      <div className="min-h-[500px] bg-[#1e1e1e]">
        <EditorContent editor={editor} />
      </div>

      {/* Status Bar */}
      <div className="px-6 py-2 bg-[#252525] border-t border-gray-800 flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center space-x-4">
          <span>
            Palavras:{" "}
            {
              editor
                .getText()
                .split(/\s+/)
                .filter((word) => word.length > 0).length
            }
          </span>
          <span>Caracteres: {editor.getText().length}</span>
        </div>
        <div>Pronto para edição</div>
      </div>
    </div>
  )
}
