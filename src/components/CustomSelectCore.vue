<script setup lang="ts">
import { ref, watch, useTemplateRef, onMounted, onUnmounted, onUpdated } from 'vue'

import ControlImg from '@/components/ControlImg.vue'
import TriDown from '@/assets/icons/TriDown.vue'
import TriUp from '@/assets/icons/TriUp.vue'

function clone(src: [] | Record<string, any> | undefined): [] | Record<string, any> | undefined {
  if (src) return JSON.parse(JSON.stringify(src))
}

function setFocus(domElem: HTMLElement): void {
  if (domElem && document.activeElement !== domElem) domElem.focus()
}

function getItemValue(item: string | Record<string, any>, field: string, def: string): string {
  if (typeof item === 'string') return item

  if (Object.keys(item).length) {
    if (field && item[field]) return item[field]

    if (def && item[def]) return item[def]
  }

  return ''
}

function getItemByIndex(index: number | undefined): null | Record<string, any> {
  if (index === undefined || isNaN(index)) return null

  let cnt = 0

  for (const key in srcItems) {
    if (cnt === index) return { index: cnt, value: srcItems[key] }
    ++cnt
  }

  return null
}

function filteredInput(
  items: [] | Record<string, any> | undefined,
  text: string,
  field: string,
  def: string,
): [] | Record<string, any> {
  if (Array.isArray(items))
    return items.filter((elem) => {
      const val = getItemValue(elem, field, def)
      if (val.startsWith(text)) return val
    })

  const out: Record<string, any> = {}
  for (const key in items) {
    const item = items[key]
    const val = getItemValue(item, field, def)

    if (val.startsWith(text)) out[key] = item
  }

  return out
}

function setItemBySelectedIndex(): void {
  if (!checkSelectedIndex()) {
    emits('selectedIndexError')
    return
  }

  const item = getItemByIndex(props.selectedIndex)

  if (item) {
    selected = String(item.index)
    selectInput.value = getItemValue(item.value, props.labelField ?? '', 'label')
  }
}

function checkSelectedIndex(): boolean {
  if (props.selectedIndex === undefined) return false

  if (props.selectedIndex < 0 || props.selectedIndex > itemsCnt) return false

  return true
}

function resetFilter(): void {
  filteredItems.value = clone(srcItems)
}

function selectFromList(elem: HTMLElement): void {
  selected = elem.getAttribute('data-index') ?? ''

  if (props.autoCloseSelectOn) {
    show.value = false
    setFocus(input.value as HTMLElement)
  }
}

function keysProcessRoot(ev: KeyboardEvent): void {
  if (ev.key === 'Tab' && show.value) {
    // отключаем 'Tab' при показе списка
    ev.preventDefault()
    return
  }

  if (ev.code === 'Space' && !props.filterOn) {
    // Если редактор выключен, можно показывать список по Space (как в стандартном select)
    if (!show.value) {
      show.value = true
      return
    }
  }

  if (ev.key === 'Enter') {
    ev.preventDefault()

    if ((ev.target as HTMLElement).localName === 'input') {
      if (!show.value) {
        // Открыть список
        show.value = true
        return
      }

      if (curActiveElem) {
        // Выбрать элемент
        selectFromList(curActiveElem)
      }
    }

    return
  }

  if (ev.key === 'Escape' && show.value) {
    show.value = false
    return
  }

  // Стрелки
  if (['ArrowDown', 'ArrowUp'].includes(ev.key)) {
    if (!show.value) {
      if (!checkSelectedIndex()) {
        emits('selectedIndexError')
        return
      }

      // список закрыт, выбираем значения стрелками
      const cnt = ul.value ? ul.value.children.length - 1 : 0

      if (props.selectedIndex === undefined)
      return

      if (ev.key === 'ArrowDown') {
        if (/*props.selectedIndex !== undefined &&*/ props.selectedIndex < cnt) emits('kbArrowDown')
        else emits('kbArrowDownEnd')
      }

      if (ev.key === 'ArrowUp') {
        if (/*props.selectedIndex !== undefined &&*/ props.selectedIndex > 0) emits('kbArrowUp')
        else emits('kbArrowUpEnd', cnt)
      }
    }

    // список открыт, двигаемся по нему стрелками
    if (show.value) {
      if (ev.key === 'ArrowDown') {
        // после редактирования curActiveElem === null
        if (!curActiveElem) curActiveElemIndex = -1

        if (ul.value && curActiveElemIndex < ul.value.children.length - 1) {
          resetCurActiveElem()
          setCurActiveElem(++curActiveElemIndex)
        }
      }

      if (ev.key === 'ArrowUp') {
        if (!curActiveElem && ul.value) curActiveElemIndex = ul.value.children.length

        if (curActiveElemIndex > 0) {
          resetCurActiveElem()
          setCurActiveElem(--curActiveElemIndex)
        }
      }
    }
  }
}

function findDomElemsByAttr(
  data: HTMLCollection | undefined,
  attr: string,
  attrVal: string,
): HTMLElement | undefined {
  if (data)
    for (let i = 0; i < data.length; ++i) {
      if (data[i].getAttribute(attr) === attrVal) return data[i] as HTMLElement
    }
}

function initSrcItems(): void {
  srcItems = clone(props.items) // копия исходных props.items
  console.log(srcItems)
  if (srcItems) itemsCnt = Object.keys(srcItems).length - 1
}

function resetCurActiveElem(): void {
  if (curActiveElem) curActiveElem.classList.remove('custom-select__item--active')

  curActiveElem = null
}

function setCurActiveElem(index: number | undefined): void {
  if (index === undefined) return
  curActiveElem = ul.value ? (ul.value.children[index] as HTMLElement) : null
  if (curActiveElem) {
    curActiveElem.classList.add('custom-select__item--active')
    curActiveElemIndex = index
  }
}

//********************************************************

function onSetSelectItem(val: string): void {
  emits('selectItem', findDomElemsByAttr(ul.value?.children, 'data-index', val))
  resetFilter() //TODO ???
}

function onInput(): void {
  emits('inputText', selectInput.value)

  if (props.filterOn) {
    // фильтрация ввода в редакторе
    filteredItems.value = filteredInput(
      srcItems,
      selectInput.value,
      props.labelField ?? '',
      'label',
    )

    if (!show.value) show.value = true
  }
}

// Возвращаем фокус в input, если открыт список (чтобы не пойти гулять по другим элементам)
function onBlur(ev: Event): void {
  if (show.value) setFocus(input.value as HTMLElement)
}

function onControlImgClick(ev: Event, action: boolean): void {
  if (props.disabled) return

  show.value = action

  setFocus(input.value as HTMLElement)
}

function onMouseOverItem(ev: Event): void {
  if (!mouseOverEnabled) {
    mouseOverEnabled = true
    return
  }

  if (curActiveElem && curActiveElem !== ev.target) {
    curActiveElem.classList.remove('custom-select__item--active')
  }
  curActiveElem = ev.target as HTMLElement
  curActiveElem.classList.add('custom-select__item--active')
}

function onClickOutside(ev: Record<string, any>) {
  if (!ev.rootElement) show.value = false // закрыть при клике за пределами компонента
}

// для всех кликов внутри компонента ev.rootElement = ul.value
function clickRoot(ev: Record<string, any>) {
  ev.rootElement = ul.value
}

//***********************************************************

const props = defineProps({
  items: Object,
  wrapStyle: String,
  inputStyle: String,
  itemsStyle: String,
  itemStyle: String,
  controlImgStyle: String,
  labelField: String,
  valueField: String,
  placeholder: String,
  filterOn: Boolean,
  controlImgOn: Boolean,
  controlImgNoImg: Boolean,
  autoCloseSelectOn: Boolean,
  selectedIndex: Number,
  disabled: Boolean,
})

const emits = defineEmits([
  'inputText',
  'selectItem',
  'kbArrowDown',
  'kbArrowDownEnd',
  'kbArrowUp',
  'kbArrowUpEnd',
  'selectedIndexError',
])

const selectInput = ref('') // текущий текст в input (v-model)
const show = ref(false)

let srcItems: Record<string, any> | undefined = {}
let selected = ''
let curActiveElem: HTMLElement | null // li который выделяем как выбранный
let curActiveElemIndex = 0
let mouseOverEnabled = true
let itemsCnt = 0

initSrcItems()
const filteredItems = ref(clone(srcItems)) // клонируем начальные значения (чтобы не изменять srcItems на фильтрации вывода)

const input = useTemplateRef('select-input') //ref(null)
const ul = useTemplateRef('select-ul')

// следим за установкой props.selectedIndex
watch(
  () => props.selectedIndex,
  (newValue, oldValue) => {
    setItemBySelectedIndex()
  },
)

// следим за изменениями в props.items
watch(
  () => props.items,
  (newValue, oldValue) => {
    initSrcItems()
    resetFilter()
  },
)

onMounted(() => {
  window.addEventListener('click', onClickOutside, false)
  setItemBySelectedIndex()
})

onUnmounted(() => {
  window.removeEventListener('click', onClickOutside, false)
})

onUpdated(() => {
  if (selected.length) onSetSelectItem(selected) // ?
  selected = ''

  if (show.value) {
    if (checkSelectedIndex()) {
      setCurActiveElem(props.selectedIndex)
      mouseOverEnabled = false // нельзя разрешать устанавливать элемент, если мышка стоит на одном из элементов списка (если только открыли)
    } else resetCurActiveElem()
  } else resetCurActiveElem()
})
</script>

<template>
  <div
    class="custom-select"
    :class="props.wrapStyle"
    @keydown="(ev) => keysProcessRoot(ev)"
    @click="(ev) => clickRoot(ev)"
  >
    <div>
      <input
        type="text"
        class="custom-select__input"
        :disabled="props.disabled"
        :class="props.inputStyle"
        :placeholder="props.placeholder"
        :readOnly="!props.filterOn"
        ref="select-input"
        v-model="selectInput"
        @input="onInput()"
        @blur="(ev) => onBlur(ev)"
      />

      <ControlImg
        @controlImgClick:first="(ev) => onControlImgClick(ev, true)"
        @controlImgClick:second="(ev) => onControlImgClick(ev, false)"
        :first="show"
        :controlImgStyle="props.controlImgStyle"
        :controlImgNoImg="props.controlImgNoImg"
        v-if="props.controlImgOn"
      >
        <template #img1>
          <TriDown />
        </template>

        <template #img2>
          <TriUp />
        </template>
      </ControlImg>
    </div>

    <ul
      class="list-reset custom-select__items"
      ref="select-ul"
      :class="props.itemsStyle"
      v-show="show"
    >
      <li
        v-for="(item, key, index) in filteredItems"
        :key="Array.isArray(filteredItems) ? key : index"
        :data-key="key"
        :data-index="Array.isArray(filteredItems) ? key : index"
        :value="getItemValue(item, props.valueField ?? '', 'value')"
        class="custom-select__item"
        :class="props.itemStyle"
        @click="(ev) => selectFromList(ev.target as HTMLElement)"
        @mouseover="(ev) => onMouseOverItem(ev)"
      >
        <slot name="option" :label="getItemValue(item, props.labelField ?? '', 'label')"></slot>
      </li>
    </ul>
  </div>
</template>

<style>
.list-reset {
  list-style: none;
  margin: 0;
  padding: 0;
}

.custom-select {
  position: relative;
  min-width: 200px;
}

.custom-select__input {
  width: 100%;
  background-color: #ffffff;
  border: 1px solid #116acc;
  border-radius: 7px;
  /* padding: 10px 25px 10px 15px; */
  padding: 10px;
}

.custom-select__input--noimg {
  padding: 10px;
}

.custom-select__input--imgright {
  padding: 10px 25px 10px 15px;
}

.custom-select__input--imgleft {
  padding: 10px 15px 10px 25px;
}

.custom-select__img {
  position: absolute;
  right: 0;
  top: 0;
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.custom-select__img--fullwidth {
  width: 100%;
  align-items: end;
}

.custom-select__img--left {
  left: 0;
  right: auto;
}

.custom-select__img--right {
  left: auto;
  right: 0;
}

.custom-select__items {
  position: absolute;
  filter: drop-shadow(0px 8px 8px rgba(0, 0, 0, 0.25));
  background-color: #ffffff;
  width: 100%;
  border-radius: 7px;
  padding-top: 10px;
  padding-bottom: 10px;
  top: 110%;
  max-height: 255px;
  overflow-y: scroll;
  height: auto;
}

.custom-select__item {
  cursor: pointer;
  padding: 10px 16px;
}

/* .custom-select__item:hover {
  background-color: #a0c3ff;
} */

.custom-select__item--active {
  background-color: #a0c3ff;
}

.custom-select__img:hover path {
  transition: fill 0.5s linear;
  fill: gray;
}

/* .custom-select__item:focus {
  border: none;
  background-color: #a0c3ff;
} */
</style>
