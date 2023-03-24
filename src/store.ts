import {writable} from "svelte/store"

export const tool = writable<tools>("move");
export const penprops = writable<penprops>({
  width: 30,
  color: "#000",
  drag: false
});
export const blocks = writable<Dict<block>>({});