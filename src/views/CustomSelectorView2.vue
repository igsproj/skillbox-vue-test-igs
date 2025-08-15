<script setup lang="ts">
import CustomSelectCore from '@/components/CustomSelectCore.vue'

import { ref } from 'vue'
import { useSharedStore } from '@/stores/shared'

const props = useSharedStore()

// работаем с массивом или с объектом для selectItems
const selectItems = ref([])

// по умолчанию: без явного указания полей (используем label и value)
const labelField = ref(null)
const valueField = ref(null)

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

const selectedIndex = ref(0)

selectItems.value.push({label: 'red', value: 'r'})
selectItems.value.push({label: 'red1', value: 'r1'})
selectItems.value.push({label: 'green', value: 'g'})
selectItems.value.push({label: 'blue', value: 'b'})

// кастомные стили если нужно
const wrapStyle = ref('custom-select--style')
const itemsStyle = ref('custom-select__items--style')
const itemStyle = ref('custom-select__item--style')

const placeholder = ref('введите значение')

function onInput(text) {
  selectedIndex.value = -1
}

function onSelect(node) {
  // Выбор в списке не устанавливает элемент, а только его возвращает. Чтобы выбрать элемент, нужно установить selectedIndex.value = node.index
  if (node) {
    console.log(node)
    selectedIndex.value = Number(node.getAttribute('data-index'))
  }
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
    :placeholder="placeholder"
    :filterOn="props.filterOn"
    :controlImgOn="true"
    :controlImgNoImg="props.controlImgNoImg"
    :autoCloseSelectOn="true"
    :selectedIndex="selectedIndex"
    :disabled="props.disabledFlag"
    @inputText="(text) => onInput(text)"
    @selectItem="(obj) => onSelect(obj)"
    @kbArrowDown="
      () => {
        selectedIndex++
      }
    "
    @kbArrowUp="
      () => {
        selectedIndex--
      }
    "
    @kbArrowDownEnd="
      () => {
        selectedIndex = 0
      }
    "
    @kbArrowUpEnd="
      (lastIndex) => {
        selectedIndex = lastIndex
      }
    "
    @selectedIndexError="() => console.log('bad selected index = ', selectedIndex)"
  >
    <template #option="optionProps">
      {{ optionProps.label }}
    </template>
  </CustomSelectCore>
</template>
