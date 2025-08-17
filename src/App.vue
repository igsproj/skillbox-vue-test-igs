<script setup lang="ts">

import { useTemplateRef } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import { useSharedStore } from '@/stores/shared'

const router = useRouter()

const disabledCheckBox = useTemplateRef('disabled')
const props = useSharedStore()

</script>

<template>

  <body>
    <main class="container">
      <form :action="$route.path" method="get" class="form" name="test-form">
        <h1>vue custom select</h1>
        <p class="warn">Внимание! Все сообщения выводятся в консоль</p>
        <div class="comp-descr">
          <RouterView />
          <p>Стрелки вверх-вниз : выбор при закрытом списке или подсветка элемента при открытом. Enter: открыть список если закрыт, выбрать элемент если открыт.
            Space - открыть список, если выключен редактор (аналог стандартного select). Esc - закрыть. Tab - работает при закрытом списке.</p>
        </div>
        <span>Стандартный select</span>
        <select class="standart-select">
          <option value="r">red</option>
          <option value="g">green</option>
          <option value="b">blue</option>
        </select>

        <p>Значения</p>
        <fieldset class="fieldset">
          <p>
            Значение для placeholder (Enter вызывает submit в форме)
          </p>
          <input type="text" v-model="props.placeHolder" class="value">
          <p>
            Выбранный индекс:
          </p>
          <input type="number" class="value" v-model="props.selectedIndex">
        </fieldset>

        <input type="submit" hidden></input>
      </form>

      <p>Тип инициализации: (см. консоль)</p>
      <fieldset class="fieldset">
        <div class="fieldset-item" @click="router.push({ name: 'init1' })">
          <input type="radio" name="init-type" id="init-type-1" checked>
          <label for="init-type-1">Массив примитивных значений, где label и value элемента - одно и то же значение</label>
        </div>
        <div class="fieldset-item"  @click="router.push({ name: 'init2' })">
          <input type="radio" name="init-type" id="init-type-2">
          <label for="init-type-2">Массив объектов. Label и value элемента берутся из свойств объекта. [{ label: “Option 1”, value: 1}, { label: “Option 2”, value: 2 }]
          </label>
        </div>
        <div class="fieldset-item" @click="router.push({ name: 'init3' })">
          <input type="radio" name="init-type" id="init-type-3">
          <label for="init-type-3">Массив объектов. Label и value элемента указываются вручную. [{ name: “Option 1”, id: 1}, { name: “Option 2”, id: 2 }] (поле для label = name, поле для value = id)
          </label>
        </div>
        <div class="fieldset-item" @click="router.push({ name: 'init4' })">
          <input type="radio" name="init-type" id="init-type-4">
          <label for="init-type-4">Объект. Value - название поля объекта. Label - значение поля, если его тип примитивный. { value1: “Option 1”, value2: “Option 2” }
          </label>
        </div>
        <div class="fieldset-item" @click="router.push({ name: 'init5' })">
          <input type="radio" name="init-type" id="init-type-5">
          <label for="init-type-5">Объект. Берётся его поле label и value по умолчанию{ value1: { label: “Option 1”, value: “1” }, value2: { label: “Option 2”, value: 2 } }
          </label>
        </div>
        <div class="fieldset-item" @click="router.push({ name: 'init6' })">
          <input type="radio" name="init-type" id="init-type-6">
          <label for="init-type-6">Объект. Поля указываем вручную. { value1: { title: “Option 1”, id: “1” }, value2: { title: “Option 2”, id: 2 } }
          </label>
        </div>
      </fieldset>

      <p>Внешний вид:</p>
      <fieldset class="fieldset">
        <div class="fieldset-item" @click="() => {props.controlImgNoImg = true; props.controlImgStyle = 'custom-select__img custom-select__img--fullwidth'; props.inputStyle = 'custom-select__input--noimg'}">
          <input type="radio" name="view-type" id="view-type-1" checked >
          <label for="view-type-1">Без иконки. Список открывается по клику в любом месте select</label>
        </div>

        <div class="fieldset-item" @click="() => {props.controlImgNoImg = true; props.controlImgStyle = 'custom-select__img custom-select__input--noimg'; props.inputStyle = 'custom-select__input--noimg'}">
          <input type="radio" name="view-type" id="view-type-2">
          <label for="view-type-2">Без иконки. Список открывается только с клавиатуры (Enter - открыть, Esc - закрыть)</label>
        </div>

        <div class="fieldset-item" @click="() => {props.controlImgNoImg = false; props.controlImgStyle = 'custom-select__img custom-select__img--right'; props.inputStyle = 'custom-select__input--imgright'}">
          <input type="radio" name="view-type" id="view-type-3">
          <label for="view-type-3">С иконкой справа</label>
        </div>

        <div class="fieldset-item" @click="() => {props.controlImgNoImg = false; props.controlImgStyle = 'custom-select__img custom-select__img--left'; props.inputStyle = 'custom-select__input--imgleft'}">
          <input type="radio" name="view-type" id="view-type-4">
          <label for="view-type-4">С иконкой слева</label>
        </div>

        <div class="fieldset-item" @click="() => {props.filterOn = true}">
          <input type="radio" name="editor" id="view-type-5" checked>
          <label for="view-type-5">Редактор включен (доступно редактирование в input). При открытом списке работает фильтрация ввода</label>
        </div>

        <div class="fieldset-item" @click="() => {props.filterOn = false}">
          <input type="radio" name="editor" id="view-type-6">
          <label for="view-type-6">Редактор отключен</label>
        </div>

        <div class="fieldset-item" @click="() => {props.disabledFlag = disabledCheckBox?.checked ?? false}">
          <input type="checkbox" name="" id="view-type-7" ref="disabled">
          <label for="view-type-7">Режим 'disabled'</label>
        </div>
      </fieldset>

    </main>
  </body>
</template>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  padding-top: 20px;
}

.warn {
  margin-bottom: 20px;
}

.fieldset {
  padding: 10px;
  display: flex;
  flex-direction: column;
  row-gap: 10px;
  margin-bottom: 20px;
}

.value {
  width: 200px;
}

.comp-descr {
  display: flex;
  column-gap: 20px;
}

.fieldset-item {
  display: flex;
  column-gap: 10px;
  align-items: flex-start;
}

.container {
  max-width: 1440px;
  margin: 0 auto;
}

.custom-select--style {
  width: 200px;
  margin-bottom: 20px;
}

.standart-select {
  display: block;
  width: 200px;
  margin-bottom: 20px;
}

.form {
  margin-bottom: 20px;
}
</style>
