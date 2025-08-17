<script setup lang="ts">
import CustomSelectCore from '@/components/CustomSelectCore.vue'

import { ref } from 'vue'
import { useSharedStore } from '@/stores/shared'

const props = useSharedStore()

// работаем с массивом или с объектом для selectItems
const selectItems = ref<string[]>([])

// по умолчанию: без явного указания полей (используем label и value)
const labelField = ref()
const valueField = ref()

/*
selectedIndex

Установка выбранного значения в списке по его индексу (аналогично стандартному select)

Если меньше 0 или больше числа элементов, получаем событие @selectedIndexError

Инициализация :

const selectedIndex = ref(0 - (кол-во элементов - 1) )  - ок
const selectedIndex = ref() - ок (значение в input не будет выбрано). Кнопки корректно работают в режиме зацикливания ( обрабатываем @kbArrowDownEnd @kbArrowUpEnd ). Не работают без режима зацикливания пока элемент не выбран из списка
const selectedIndex = ref(undefined) - ok (аналогично ref())
const selectedIndex = ref(null) - поведение как у  ref(0), но элемент не будет выбран в input.

Прочие варианты - нет
*/

selectItems.value.push('red')
selectItems.value.push('red1')
selectItems.value.push('green')
selectItems.value.push('blue')

// кастомные стили если нужно
const wrapStyle = ref('custom-select--style')
const itemsStyle = ref('custom-select__items--style')
const itemStyle = ref('custom-select__item--style')

function onInput(text: string): void {
  props.selectedIndex = -1
}

function onSelect(node: HTMLElement): void {
  // Выбор в списке не устанавливает элемент, а только его возвращает. Чтобы выбрать элемент, нужно установить selectedIndex = node.index
  if (!node) return

  const newIndex = Number(node.getAttribute('data-index'))

  if (newIndex === props.selectedIndex)
    // событие установки. Выбранный элемент - node
    console.log(node)

  props.selectedIndex = Number(node.getAttribute('data-index'))
}
</script>

<template>
  <CustomSelectCore
    :items="selectItems"
    :wrapStyle="wrapStyle"
    :inputStyle="props.inputStyle"
    :itemsStyle="itemsStyle"
    :itemStyle="itemStyle"
    :controlImgStyle="props.controlImgStyle"
    :labelField="labelField"
    :valueField="valueField"
    :placeholder="props.placeHolder"
    :filterOn="props.filterOn"
    :controlImgOn="true"
    :controlImgNoImg="props.controlImgNoImg"
    :autoCloseSelectOn="true"
    :selectedIndex="props.selectedIndex"
    :disabled="props.disabledFlag"
    @inputText="(text) => onInput(text)"
    @selectItem="(obj) => onSelect(obj)"
    @kbArrowDown="
      () => {
        props.selectedIndex++
      }
    "
    @kbArrowUp="
      () => {
        props.selectedIndex--
      }
    "
    @kbArrowDownEnd="
      () => {
        props.selectedIndex = 0
      }
    "
    @kbArrowUpEnd="
      (lastIndex) => {
        props.selectedIndex = lastIndex
      }
    "
    @selectedIndexError="() => console.log('bad selected index = ', props.selectedIndex)"
  >
    <template #option="optionProps">
      {{ optionProps.label }}
    </template>
  </CustomSelectCore>
</template>
