import type { ComponentInterface } from '@stencil/core';
import { Component, Element, Host, h } from '@stencil/core';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 */
@Component({
  tag: 'ion-bottom-bar-item',
  styleUrls: ['bottom-bar-item.scss'],
})
export class BottomBarItem implements ComponentInterface {
  @Element() el!: HTMLElement;

  render() {
    return (
      <Host>
        <slot name="icon"></slot>
        <slot name="label"></slot>
      </Host>
    );
  }
}
