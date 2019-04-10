import { ActionContext as BaseActionContext, Store } from 'vuex'

import './helpers'

interface BasePayload {
  type: string
}

interface RootOption {
  root: true
}

interface Dispatch<P> {
  <K extends keyof P>(type: K, payload: P[K]): Promise<any>
  <K extends keyof P>(payloadWithType: { type: K } & P[K]): Promise<any>

  // Fallback for root actions
  (type: string, payload: any, options: RootOption): Promise<any>
  <P extends BasePayload>(payloadWithType: P, options: RootOption): Promise<any>
}

interface Commit<P> {
  <K extends keyof P>(type: K, payload: P[K]): void
  <K extends keyof P>(payloadWithType: { type: K } & P[K]): void

  // Fallback for root mutations
  (type: string, payload: any, options: RootOption): void
  <P extends BasePayload>(payloadWithType: P, options: RootOption): void
}

interface ActionContext<State, Getters, Actions, Mutations>
  extends BaseActionContext<State, any> {
  getters: Getters
  dispatch: Dispatch<Actions>
  commit: Commit<Mutations>
}

export type DefineGetters<Getters, State, ExtraGetters = {}> = {
  [K in keyof Getters]: (
    state: State,
    getters: Getters & ExtraGetters,
    rootState: any,
    rootGetters: any
  ) => Getters[K]
}

export type DefineActions<
  Actions,
  State,
  Mutations,
  Getters = {},
  ExtraActions = {}
> = {
  [K in keyof Actions]: (
    this: Store<State>,
    ctx: ActionContext<State, Getters, Actions & ExtraActions, Mutations>,
    payload: Actions[K]
  ) => void | Promise<any>
}

export type DefineMutations<Mutations, State> = {
  [K in keyof Mutations]: (state: State, payload: Mutations[K]) => void
}

type Mapper<P> = { [K in keyof P]: { type: K } & P[K] }

export type Dispatcher<
  Actions,
  M extends Mapper<Actions> = Mapper<Actions>,
  K extends keyof M = keyof M
> = M[K]

export type Committer<
  Mutations,
  M extends Mapper<Mutations> = Mapper<Mutations>,
  K extends keyof M = keyof M
> = M[K]
