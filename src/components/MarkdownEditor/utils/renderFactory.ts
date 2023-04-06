import { defaultValueCtx, Editor, editorViewOptionsCtx, rootCtx } from '@milkdown/core'
import { listener, listenerCtx } from '@milkdown/plugin-listener'
import { gfm } from '@milkdown/preset-gfm'
import { outline } from '@milkdown/utils'
// import { iframe } from '../plugin/iframe'

export default function rendererFactory(
  root: HTMLElement,
  markdown: string,
  setOutlines?: React.Dispatch<React.SetStateAction<any[]>>,
) {
  const editor = Editor.make()
    .config(ctx => {
      ctx.set(rootCtx, root)
      ctx.set(defaultValueCtx, markdown)
      ctx.update(editorViewOptionsCtx, prev => ({ ...prev, editable: () => false }))
      ctx.get(listenerCtx).mounted(ctx => {
        setOutlines?.(outline()(ctx))
      })
    })
    // .use(iframe)
    .use(gfm)
    .use(listener)

  return editor
}
