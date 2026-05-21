/* eslint-disable-next-line import/no-extraneous-dependencies -- Included in Obsidian */
import { EditorView, WidgetType } from "@codemirror/view"
import CalctexPlugin from "./main"

export class ResultWidget extends WidgetType {
  insertLocation: number
  resultText: string
  keyListener: (event: KeyboardEvent) => void

  constructor(
    public view: EditorView,
    public index: number,
    public text: string,
  ) {
    super()
  }

  toDOM(_view: EditorView): HTMLElement {
    activeDocument.removeEventListener("keydown", this.keyListener, true)

    /* eslint-disable-next-line obsidianmd/prefer-create-el -- So we can return it */
    const div = activeDocument.createElement("span")
    div.className = "result-text"

    this.insertLocation = this.index
    this.resultText = this.text

    div.innerText = this.text
    this.keyListener = (event) => {
      if (event.key !== CalctexPlugin.INSTANCE.settings.completionTriggerKey)
        return
      event.preventDefault()
      this.insertToDOM()
    }
    activeDocument.addEventListener("keydown", this.keyListener, true)
    div.onclick = () => {
      this.insertToDOM()
    }

    return div
  }

  destroy(dom: HTMLElement): void {
    activeDocument.removeEventListener("keydown", this.keyListener, true)
    dom.remove()
  }

  insertToDOM() {
    const transaction = this.view.state.update({
      changes: {
        from: this.insertLocation,
        to: this.insertLocation,
        insert: this.resultText,
      },
      selection: {
        anchor: this.insertLocation + this.resultText.length,
        head: this.insertLocation + this.resultText.length,
      },
    })
    this.view.dispatch(transaction)

    activeDocument.removeEventListener("keydown", this.keyListener, true)
  }
}
