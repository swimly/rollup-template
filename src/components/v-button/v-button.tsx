import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'v-button',
  styleUrl: 'v-button.css',
  shadow: true,
})
export class VButton {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
