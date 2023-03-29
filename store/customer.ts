import { Module, Mutation, VuexModule } from "vuex-module-decorators";

@Module({
  name: 'initialize',
  stateFactory: true,
  namespaced: true,
})
export default class Customer extends VuexModule {
  device: string = ''
}
