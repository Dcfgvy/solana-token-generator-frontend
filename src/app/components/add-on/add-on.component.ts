import { AfterContentInit, Component, computed, ContentChild, ContentChildren, input, model, OnInit, Optional, output, QueryList, TemplateRef, WritableSignal } from '@angular/core';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { ControlContainer, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Tag } from 'primeng/tag';
import { AppSettingsService } from '../../app-settings/app-settings.service';
import { ServiceName } from '../../app-settings/types/service-name.type';

// For parent components' use
export interface AddOn {
  added: WritableSignal<boolean>;
  serviceName: ServiceName;
}

@Component({
  selector: 'app-add-on',
  imports: [ToggleSwitch, FormsModule, Tag, ReactiveFormsModule],
  templateUrl: './add-on.component.html',
  styleUrl: './add-on.component.scss'
})
export class AddOnComponent implements OnInit, AfterContentInit {
  // @ContentChild('[content]') content: any;
  // hasContent = computed(() => {
  //   return !!this.content;
  // })

  hasContent = false;
  
  // Query for elements with the 'content' attribute
  @ContentChildren('[content]', {descendants: true}) contentElements!: QueryList<any>;
  
  ngAfterContentInit() {
    // Check if any content elements were projected
    this.hasContent = this.contentElements.length > 0;
    
    // Listen for changes in case content is dynamically added/removed
    this.contentElements.changes.subscribe(elements => {
      this.hasContent = elements.length > 0;
    });
  }

  //** Pass the variable responsible for the number of selected add-ons  */
  added = model.required<boolean>();
  disabled = input<boolean>(false);
  serviceName = input.required<ServiceName>();
  chain = input<string>('solana');
  currency = input<string>('SOL');
  tag = input<string>('');
  tagSeverity = input<"warn" | "success" | "secondary" | "info" | "danger" | "contrast">('warn');

  formName = input<string | undefined>();
  onAdded = output();
  onRemoved = output();

  constructor(
    public readonly settingsService: AppSettingsService,
    @Optional() private controlContainer: ControlContainer
  ) {}

  protected _checked = false;
  protected onValueChange(event: any){
    const status = event.checked as boolean;
    if(status === true){
      this.onAdded.emit();
    } else {
      this.onRemoved.emit();
    }
    this.setControlState(status);
    this.added.set(status);
  }
  ngOnInit(): void {
    this._checked = this.added();
    this.setControlState(this.added());
  }

  servicePrice = computed(() => {
    return this.settingsService.settingsSignal()?.prices[this.chain()][this.serviceName()];
  })

  isFree = computed<boolean>(() => {
    return this.servicePrice()?.isTemporarilyFree || false;
  })
  usualCost = computed<number>(() => {
    return this.servicePrice()?.cost || 0;
  })
  cost = computed<number>(() => {
    if(this.isFree()) return 0; // makes an add-on free (so that a discount is shown)
    return this.usualCost();
  })

  private setControlState(enable: boolean) {
    if(!this.formName()) return;
    if (!this.controlContainer || !this.formName) {
      console.warn('No form control or formControlName provided');
      return;
    }
    
    const control = this.controlContainer.control?.get(this.formName()!);
    
    if (!control) {
      console.warn(`Control with name '${this.formName()}' not found in form group`);
      return;
    }
    
    if (enable) {
      control.enable();
    } else {
      control.disable();
    }
  }
}
