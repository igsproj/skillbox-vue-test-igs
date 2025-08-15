import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useSharedStore = defineStore('sharedStore', () => {
  const controlImgNoImg = ref(true)
  const filterOn = ref(true)
  const disabledFlag = ref(false)

  const controlImgStyle = ref('custom-select__img custom-select__img--fullwidth')
  const inputStyle = ref('custom-select__input--style')

  return { controlImgNoImg, filterOn, disabledFlag, controlImgStyle, inputStyle }
})
