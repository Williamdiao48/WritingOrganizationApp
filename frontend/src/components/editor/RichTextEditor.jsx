import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';
import './editor.css';

// Handles TipTap JSON strings, TipTap doc objects, and legacy plain text
function parseContent(raw) {
    if (!raw) return null;
    if (typeof raw === 'object') return raw;
    try {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.type === 'doc') return parsed;
    } catch {}
    // Fallback: wrap plain text in a paragraph node
    return {
        type: 'doc',
        content: [{ type: 'paragraph', content: raw ? [{ type: 'text', text: raw }] : [] }],
    };
}

function countWords(node) {
    if (!node) return 0;
    if (node.type === 'text') return (node.text || '').split(/\s+/).filter(Boolean).length;
    if (node.content) return node.content.reduce((acc, child) => acc + countWords(child), 0);
    return 0;
}

// Props: content (TipTap JSON string | doc object | plain text | null)
//        onChange(jsonDoc) — called on every edit
//        onWordCountChange(n) — called on every edit and on mount
// Use key={entityId} on this component to reset editor when switching entities.
export default function RichTextEditor({ content, onChange, onWordCountChange }) {
    const editor = useEditor({
        extensions: [StarterKit],
        content: parseContent(content),
        editorProps: {
            attributes: { class: 'ProseMirror' },
        },
        onUpdate({ editor }) {
            const json = editor.getJSON();
            onChange?.(json);
            onWordCountChange?.(countWords(json));
        },
    });

    // Report initial word count once editor mounts
    useEffect(() => {
        if (editor && onWordCountChange) {
            onWordCountChange(countWords(editor.getJSON()));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editor]);

    if (!editor) return null;

    const ToolbarBtn = ({ label, active, onClick, title, italic }) => (
        <button
            type="button"
            className={`toolbar-btn${italic ? ' italic' : ''}${active ? ' is-active' : ''}`}
            onClick={onClick}
            title={title || label}
        >
            {label}
        </button>
    );

    return (
        <div className="rich-editor-wrapper">
            <div className="rich-editor-toolbar">
                <ToolbarBtn
                    label="B"
                    active={editor.isActive('bold')}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    title="Bold"
                />
                <ToolbarBtn
                    label="I"
                    italic
                    active={editor.isActive('italic')}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    title="Italic"
                />
                <span className="toolbar-divider" />
                <ToolbarBtn
                    label="H1"
                    active={editor.isActive('heading', { level: 1 })}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                />
                <ToolbarBtn
                    label="H2"
                    active={editor.isActive('heading', { level: 2 })}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                />
                <ToolbarBtn
                    label="H3"
                    active={editor.isActive('heading', { level: 3 })}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                />
                <span className="toolbar-divider" />
                <ToolbarBtn
                    label="• List"
                    active={editor.isActive('bulletList')}
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    title="Bullet list"
                />
                <ToolbarBtn
                    label="1. List"
                    active={editor.isActive('orderedList')}
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    title="Numbered list"
                />
                <span className="toolbar-divider" />
                <ToolbarBtn
                    label='" Quote'
                    active={editor.isActive('blockquote')}
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    title="Blockquote"
                />
            </div>
            <EditorContent editor={editor} className="tiptap-content" />
        </div>
    );
}
