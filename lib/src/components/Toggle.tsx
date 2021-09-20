import React, { memo } from 'react'
import { TouchableOpacity } from 'react-native'
import colors from '../constants/colors'
import { ToggleProps } from '../constants/types'
import Icon from './Icon'

function Toggle(props: ToggleProps) {
  const { checked, onTouch, iconColor = colors.secondary } = props
  return (
    <TouchableOpacity onPress={onTouch} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} {...props}>
      <Icon name={checked ? 'deleteCircle' : 'addCircle'} fill={iconColor} />
    </TouchableOpacity>
  )
}

export default memo(Toggle)
