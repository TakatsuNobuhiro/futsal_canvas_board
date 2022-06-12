declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}
declare module 'vue-tweet-embed'

interface HTMLElementEvent<T extends HTMLElement> extends Event {
  target: T;
}
