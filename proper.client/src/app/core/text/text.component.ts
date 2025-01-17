import { CommonModule, CurrencyPipe } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import {
  Component,
  ElementRef,
  QueryList,
  Renderer2,
  TemplateRef,
  ViewChild,
  ViewChildren,
  ViewContainerRef,
} from '@angular/core';
import { GrammarService } from '../services/grammar.service';

@Component({
  selector: 'app-text',
  standalone: true,
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.css'],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    GrammarService,
  ]
})
export class TextComponent {
  @ViewChild('textWrapperTemplate', { static: true })
  textWrapperTemplate: TemplateRef<any> | undefined;

  @ViewChildren('dynamicDiv', { read: ElementRef })
  dynamicDivs: QueryList<ElementRef> | undefined;

  @ViewChild('mainContainer', { read: ViewContainerRef, static: true })
  container: ViewContainerRef | undefined;

  currentPrompt: ElementRef | null = null;
  currentPromptElement: HTMLElement | null = null;

  constructor(private renderer: Renderer2, private ai: GrammarService) { }

  ngOnInit() {
    this.createInputContainer()
  }


  //createResponseContainer(): void {
  //  this.createTextContainer().setText('test')?.setSelection();
  //  this.clearPreviousEditable();
  //}

  createTextContainer(): TextContainer {
    if (this.textWrapperTemplate && this.container) {
      const viewRef = this.container.createEmbeddedView(this.textWrapperTemplate);

      // Detect changes to ensure the element is rendered
      viewRef.detectChanges();

      // Get the root element of the created view
      const element = viewRef.rootNodes[0] as HTMLElement;

      // Return an object containing methods that operate on the created element
      const containerObject: TextContainer = {
        element,
        setText: (text: string) => {
          if (element) {
            this.renderer.setProperty(element.firstChild, 'textContent', text);
          } else {
            console.warn('No element available to set text content.');
          }
          return containerObject; // Return the same object for chaining
        },
        setSelection: () => {
          if (element) {
            const selection = window.getSelection();
            const range = document.createRange();

            // Ensure the element is focusable and select its contents
            element.focus();
            range.selectNodeContents(element);

            // Clear existing selections and apply the new one
            selection?.removeAllRanges();
            selection?.addRange(range);
            selection?.collapseToEnd();
          } else {
            console.warn('No element available for selection.');
          }
          return containerObject; // Return the same object for chaining
        },
      };

      return containerObject;
    }

    // Fallback object in case the container or template is missing
    return {
      setText: (text: string) => {
        console.warn('No container or template available.');
        return null; // No chaining possible
      },
      setSelection: () => {
        console.warn('No container or template available.');
        return null; // No chaining possible
      },
    };
  }


  createResponseContainer(): void {
    if (this.currentPromptElement) {
      this.ai.checkGrammar(this.currentPromptElement?.innerText).subscribe({
        next: (response) => {
          var prompt = response.correctedText;
          const container = this.createTextContainer().setText(prompt)?.setSelection();
          this.clearPreviousEditable();

          if (container?.element) {
            this.currentPromptElement = container.element
          }
        },
        error: (error) => {
          console.error('Error checking grammar:', error);
        }
      });;
    }
  }

  createInputContainer(): void {
    const container = this.createTextContainer();
    this.clearPreviousEditable();

    if (container.element) {
      this.currentPromptElement = container.element;
    }
  }

  clearPreviousEditable(): void {
    if (this.dynamicDivs && this.dynamicDivs.length > 0) {
      var lastElement = this.dynamicDivs.last;
      this.currentPrompt = lastElement;
      this.renderer.setAttribute(lastElement.nativeElement, 'contenteditable', 'false');
    }
  }

  // Gets what position default caret is at in active selection
  onInput(event: KeyboardEvent): void {
    console.log('Input event:', event);

    if (event.key === 'Enter') {
      event.preventDefault();

      if (window.getSelection) {
       window.getSelection()?.removeAllRanges();
      }

      this.createResponseContainer();
    }

    //const selection = window.getSelection();
    //const range = selection?.getRangeAt(0);

    //if (range) {
    //  const cursorPosition = range.startOffset;
    //  console.log('Cursor Position:', cursorPosition);
    //}
  }
}

interface TextContainer {
  element?: HTMLElement;
  setText: (text: string) => TextContainer | null;
  setSelection: () => TextContainer | null;
}
