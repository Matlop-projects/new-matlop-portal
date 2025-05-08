import { Directive, ElementRef, EventEmitter, HostListener, Output, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appClickOutside]',
  standalone: true
})
export class ClickOutsideDirective {

  @HostListener('document:click', ['$event.target'])
  @Output() onClickOutSideCompleted = new EventEmitter<boolean>();

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  @HostListener('document:click', ['$event.target'])
  onClick(targetElement: HTMLElement) {
    const clickedInside = this.elementRef.nativeElement.contains(targetElement);
    if (!clickedInside) {
      this.hideElement();      
      this.onClickOutSideCompleted.emit(true)
    }
  }

  private hideElement() {
    this.renderer.setStyle(this.elementRef.nativeElement, 'display', 'none');
  }

  showElement() {
    this.renderer.setStyle(this.elementRef.nativeElement, 'display', 'block');
  }

}
