# Vuex Type Helper

Type level helper to ensure type safety in Vuex.

## Installation

```bash
# npm
$ npm install vuex-type-helper

# yarn
$ yarn add vuex-type-helper
```

## Example

```ts
import * as Vuex from 'vuex'
import { DefineGetters, DefineMutations, DefineActions, Dispatcher, Committer } from 'vuex-type-helper'

/**
 * Declare module types
 */
export interface CounterState {
  count: number
}

export interface CounterGetters {
  // getterName: returnType
  half: number
}

export interface CounterMutations {
  // mutationName: mutationPayloadType
  inc: {
    amount: number
  }
}

export interface CounterActions {
  // actionName: actionPayloadType
  incAsync: {
    amount: number
    delay: number
  }
}

/**
 * Implement the module
 */
const state: CounterState = {
  count: 0
}

const getters: DefineGetters<CounterGetters, CounterState> = {
  half: state => state.count / 2
}

const mutations: DefineMutations<CounterMutations, CounterState> = {
  inc (state, { amount }) {
    state.count += amount
  }
}

const actions: DefineActions<CounterActions, CounterState, CounterMutations, CounterGetters> = {
  incAsync ({ commit }, payload) {
    setTimeout(() => {
      commit('inc', payload)
    }, payload.delay)
  }
}

/**
 * Create a store as same as the ordinary way
 */
const store = new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})

/**
 * Annotate dispatch/commit type with declared actions/mutations type
 */
store.dispatch<Dispatcher<CounterActions>>({
  type: 'incAsync',
  amount: 1,
  delay: 1000
})

store.commit<Committer<CounterMutations>>({
  type: 'inc',
  amount: 1
})
```

## License

MIT