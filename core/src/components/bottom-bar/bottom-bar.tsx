import type { ComponentInterface } from '@stencil/core';
import { Component, Element, Host, Prop, h } from '@stencil/core';
import type { KeyboardController } from '@utils/keyboard/keyboard-controller';
import { createKeyboardController } from '@utils/keyboard/keyboard-controller';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 */
@Component({
  tag: 'ion-bottom-bar',
  styleUrls: ['bottom-bar.scss'],
})
export class BottomBar implements ComponentInterface {
  private keyboardCtrl: KeyboardController | null = null;

  @Element() el!: HTMLElement;

  @Prop() transparent = false;

  @Prop() floating = false;

  async connectedCallback() {
    this.keyboardCtrl = await createKeyboardController(async (keyboardOpen, waitForResize) => {
      /**
       * If the keyboard is hiding, then we need to wait
       * for the webview to resize. Otherwise, the footer
       * will flicker before the webview resizes.
       */
      if (keyboardOpen === false && waitForResize !== undefined) {
        await waitForResize;
      }
    });
  }

  disconnectedCallback() {
    if (this.keyboardCtrl) {
      this.keyboardCtrl.destroy();
    }
  }

  render() {
    const { floating, transparent } = this;
    return (
      <Host
        class={{
          [`bottom-bar-floating`]: floating,

          [`bottom-bar-transparent`]: transparent,
        }}
      >
        <nav>
          <ul>
            <slot></slot>
          </ul>
        </nav>
      </Host>
    );
  }
}
