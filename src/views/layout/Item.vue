<script>
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    iconName: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  render(h, context) {
    const { iconName, title } = context.props
    const vnodes = []

    if (iconName) {
      //vnodes.push(<svg-icon icon-class={icon}/>)
      vnodes.push(<icon class="svg-icon" name={iconName} scale='1.3'/>)
    }

    if (title) {
      vnodes.push(<span slot='title'>{(title)}</span>)
    }
    return vnodes
  }
}
</script>
