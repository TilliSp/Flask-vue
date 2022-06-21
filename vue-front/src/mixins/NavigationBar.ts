import { Component, Vue } from 'vue-property-decorator'
import { userModule } from '@/store'

interface RouterLinks {
  text: string
  icon: string
  link: string
}

@Component
export default class NavigationMixin extends Vue {
  public items: Array<RouterLinks> = [
    {
      text: 'Search',
      icon: 'clipboard-text-search',
      link: '/search'
    },
    { text: 'Applications', icon: 'bell', link: '/applications' },
    { text: 'Projects', icon: 'account-tie-voice', link: '/ownprojects' },
    {
      text: 'Participation',
      icon: 'account-eye',
      link: '/participantprojects'
    }
  ]

  public async logout(): Promise<void> {
    await userModule.actions.logOut().then(() => {
      this.$router.push('/')
    })
  }
}
