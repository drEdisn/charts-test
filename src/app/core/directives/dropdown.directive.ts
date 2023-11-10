import { DOCUMENT } from "@angular/common";
import { Directive, Inject, Input, OnInit, TemplateRef, ViewContainerRef, signal } from "@angular/core";

@Directive({
  selector: '[dropdown]',
  standalone: true
})
export class DropdownDirective implements OnInit {

  @Input({ alias: 'dropdown', required: true }) dropdownSelector!: HTMLElement;
  private isOpen = signal<boolean>(false);

  constructor(
    private template: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    @Inject(DOCUMENT) private dom: Document
  ) {}

  ngOnInit(): void {
    this.dropdownSelector.addEventListener('click', (event) => {
      event.stopPropagation();
      this.isOpen.update((prev) => !prev);
      this.checkElement();
    });
    this.checkElement();
  }

  checkElement(): void {
    if (this.isOpen()) {
      this.viewContainer
        .createEmbeddedView(this.template)
        .markForCheck();
    } else {
      this.viewContainer.clear();
    }
  }
}
