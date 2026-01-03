import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[hasPermission]'
})
export class HasPermissionDirective {

  @Input() set hasPermission(_: string) {
    // Placeholder: permisos reales si los agregas luego
  }

  constructor(
    private tpl: TemplateRef<any>,
    private vcr: ViewContainerRef
  ) {
    this.vcr.createEmbeddedView(this.tpl);
  }
}
