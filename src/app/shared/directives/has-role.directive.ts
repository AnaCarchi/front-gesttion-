import { Directive, Input, TemplateRef, ViewContainerRef, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Directive({
  selector: '[hasRole]'
})
export class HasRoleDirective {

  private auth = inject(AuthService);

  constructor(
    private tpl: TemplateRef<any>,
    private vcr: ViewContainerRef
  ) {}

  @Input() set hasRole(role: string) {
    const user = this.auth.getCurrentUser();
    const has = user?.roles?.some(r => r.name === role);
    this.vcr.clear();
    if (has) this.vcr.createEmbeddedView(this.tpl);
  }
}
