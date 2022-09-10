import { Component, For } from 'solid-js'
import { categoryStore } from '../../store/category'
import { CategoryItem } from './styled'
import Input from '../../components/Input'

const Cost: Component = () => {
  const onInput = (id: number) => (value: InputEvent) => console.log(value)

  return (
    <div>
      <For each={categoryStore.items}>
        {(category) => (
          <CategoryItem>
            <span>{category.name}</span>
            <Input value={''} onInput={onInput(category.id)} />
          </CategoryItem>
        )}
      </For>
    </div>
  )
}

export default Cost
