import React, { useState, memo, useMemo, Fragment } from 'react'
import { isEmpty, find } from 'lodash'
import { View, FlatList, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet } from 'react-native'
import Icon from './src/components/Icon'
import colors from './src/constants/colors'
import { SelectBoxProps, ToggleProps } from './src/constants/types'

const hitSlop = { top: 14, bottom: 14, left: 14, right: 14 }

const kOptionsHeight = { width: '100%', maxHeight: 180 }

const renderItemStyle = { flexShrink: 1 }
function Toggle(props: ToggleProps) {
  const { checked, onTouch, iconColor = colors.secondary } = props
  return (
    <TouchableOpacity onPress={onTouch} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} {...props}>
      <Icon name={checked ? 'deleteCircle' : 'addCircle'} fill={iconColor} />
    </TouchableOpacity>
  )
}

const SelectBox: React.FC<SelectBoxProps> = ({
  labelStyle,
  containerStyle,
  inputFilterContainerStyle,
  inputFilterStyle,
  optionsLabelStyle,
  optionContainerStyle,
  multiOptionContainerStyle,
  multiOptionsLabelStyle,
  multiListEmptyLabelStyle,
  listEmptyLabelStyle,
  selectedItemStyle,
  removeItemsSelected,
  editStatus,
  listEmptyText = 'No results found',
  ...props
}) => {
  const {
    noEditable,
    selectIcon,
    label,
    inputPlaceholder = 'Search',
    hideInputFilter,
    width = '100%',
    isMulti,
    options,
    value,
    selectedValues,
    arrowIconColor = colors.secondary,
    searchIconColor = colors.secondary,
    toggleIconColor = colors.secondary,
    bottomBarColor = colors.white,
    searchInputProps,
    multiSelectInputFieldProps,
    listOptionProps = {},
    onChange,
    onMultiSelect
  } = props

  const [inputValue, setInputValue] = useState<string>('')

  const [showOptions, setShowOptions] = useState<boolean>(false)

  function renderLabel(item: any) {
    return <Text style={[styles.kOptionsLabelStyle, optionsLabelStyle]}>{item}</Text>
  }

  function renderItem({ item }: { item: any }) {
    function onPressMultiItem() {
      return () => (onMultiSelect ? onMultiSelect(item) : null)
    }

    function onPressItem() {
      return () => {
        setShowOptions(false)
        return onChange ? onChange(item) : null
      }
    }

    return (
      <View style={[styles.kOptionContainerStyle, optionContainerStyle]}>
        {isMulti ? (
          <>
            <TouchableOpacity hitSlop={hitSlop} style={renderItemStyle} onPress={onPressMultiItem()}>
              {renderLabel(item.item)}
            </TouchableOpacity>
            <Toggle
              iconColor={toggleIconColor}
              checked={selectedValues.some((i: any) => item.id === i.id)}
              onTouch={onPressMultiItem()}
            />
          </>
        ) : (
          <>
            <TouchableOpacity hitSlop={hitSlop} style={renderItemStyle} onPress={onPressItem()}>
              {renderLabel(item.item)}
              <View />
            </TouchableOpacity>
          </>
        )}
      </View>
    )
  }

  function renderGroupItem({ item }: { item: any }) {
    const { onTapClose, options } = props
    const label = find(options, (o) => o.id === item.id)
    function onPressItem() {
      return () => (onTapClose ? onTapClose(item) : null)
    }
    return (
      <View style={[styles.kMultiOptionContainerStyle, multiOptionContainerStyle]}>
        <Text style={[styles.kMultiOptionsLabelStyle, multiOptionsLabelStyle]}>{label?.item}</Text>
        {removeItemsSelected ? (
          <TouchableOpacity hitSlop={hitSlop} onPress={onPressItem()}>
            <Icon name='closeCircle' fill='#fff' width={21} height={21} />
          </TouchableOpacity>
        ) : null}
      </View>
    )
  }

  const filteredSuggestions = useMemo(
    () => options.filter((suggestion: any) => suggestion.item.toLowerCase().indexOf(inputValue.toLowerCase()) > -1),
    [inputValue, options]
  )

  function onPressShowOptions() {
    editStatus ? editStatus(showOptions) : null
    return () => setShowOptions(!showOptions)
  }
  function multiListEmptyComponent() {
    return (
      <TouchableOpacity style={styles.emptyComponent} hitSlop={hitSlop} onPress={onPressShowOptions()}>
        <Text style={[styles.kMultiListEmptyLabelStyle, multiListEmptyLabelStyle]}>{inputPlaceholder}</Text>
      </TouchableOpacity>
    )
  }

  function optionListEmpty() {
    return (
      <View style={styles.optionListView}>
        <Text style={[styles.kListEmptyLabelStyle, listEmptyLabelStyle]}>{listEmptyText}</Text>
      </View>
    )
  }
  function keyExtractor() {
    return (o: any) => `${o.id}-${Math.random()}`
  }

  function HeaderComponent() {
    function onChangeText() {
      return (value: string) => setInputValue(value)
    }
    return (
      <>
        {!hideInputFilter && (
          <View style={[styles.kInputFilterContainerStyle, inputFilterContainerStyle]}>
            <TextInput
              value={inputValue}
              placeholder={inputPlaceholder}
              onChangeText={onChangeText()}
              style={[styles.kInputFilterStyle, inputFilterStyle]}
              placeholderTextColor='#000'
              {...searchInputProps}
            />
            <Icon name='searchBoxIcon' fill={searchIconColor} />
          </View>
        )}
        <ScrollView keyboardShouldPersistTaps='always' />
      </>
    )
  }

  return (
    <Fragment>
      <View
        style={{
          width
        }}
      >
        <Text style={[styles.kLabelStyle, labelStyle]}>{label}</Text>
        <View style={[styles.kContainerStyle, containerStyle, { borderColor: bottomBarColor }]}>
          <View style={styles.kContainer}>
            {isMulti ? (
              <FlatList
                data={selectedValues}
                extraData={{ inputValue, showOptions }}
                keyExtractor={keyExtractor()}
                renderItem={renderGroupItem}
                horizontal={true}
                ListEmptyComponent={multiListEmptyComponent}
                {...multiSelectInputFieldProps}
              />
            ) : (
              <TouchableOpacity hitSlop={hitSlop} onPress={onPressShowOptions()}>
                <Text
                  style={[
                    styles.kSelectedItemStyle,
                    { color: isEmpty(value?.item) ? colors.black_300 : colors.black },
                    selectedItemStyle
                  ]}
                >
                  {value?.item || inputPlaceholder || label}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          {noEditable ? null : (
            <TouchableOpacity onPress={onPressShowOptions()} hitSlop={hitSlop}>
              {selectIcon ? selectIcon : <Icon name={showOptions ? 'upArrow' : 'downArrow'} fill={arrowIconColor} />}
            </TouchableOpacity>
          )}
        </View>
        {/* Options wrapper */}
        {showOptions && (
          <FlatList
            data={filteredSuggestions || options}
            extraData={options}
            keyExtractor={keyExtractor()}
            renderItem={renderItem}
            numColumns={1}
            horizontal={false}
            initialNumToRender={5}
            maxToRenderPerBatch={20}
            windowSize={10}
            ListEmptyComponent={optionListEmpty}
            style={[kOptionsHeight, listOptionProps.style]}
            ListHeaderComponent={HeaderComponent()}
            {...listOptionProps}
          />
        )}
      </View>
    </Fragment>
  )
}

SelectBox.defaultProps = {
  label: 'Label',
  options: [
    {
      item: 'Aston Villa FC',
      id: 'AVL'
    },
    {
      item: 'West Ham United FC',
      id: 'WHU'
    },
    {
      item: 'Stoke City FC',
      id: 'STK'
    },
    {
      item: 'Sunderland AFC',
      id: 'SUN'
    }
  ]
}

const styles = StyleSheet.create({
  optionListView: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 4
  },
  groupItem: {
    marginLeft: 15
  },
  emptyComponent: {
    flexGrow: 1,
    width: '100%'
  },
  kContainer: {
    paddingRight: 20,
    flexGrow: 1
  },
  kOptionsLabelStyle: {
    fontSize: 17,
    color: colors.black_600
  },
  kOptionContainerStyle: {
    borderColor: colors.gray_light,
    borderBottomWidth: 1,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingVertical: 12,
    paddingRight: 10,
    justifyContent: 'space-between'
  },
  kMultiOptionContainerStyle: {
    flexDirection: 'row',
    borderRadius: 20,
    paddingVertical: 5,
    paddingRight: 5,
    paddingLeft: 10,
    marginRight: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondary,
    flexGrow: 1
  },
  kMultiOptionsLabelStyle: {
    fontSize: 10,
    color: colors.white,
    padding: 4,
    marginRight: 5
  },
  kMultiListEmptyLabelStyle: {
    fontSize: 17,
    color: colors.black_300
  },
  kListEmptyLabelStyle: {
    fontSize: 17,
    color: colors.black_600
  },
  kLabelStyle: {
    fontSize: 12,
    color: colors.black_600,
    paddingBottom: 4
  },
  kContainerStyle: {
    flexDirection: 'row',
    width: '100%',
    borderColor: colors.blue_400,
    borderBottomWidth: 1,
    paddingTop: 6,
    paddingRight: 20,
    paddingBottom: 8
  },
  kSelectedItemStyle: {
    fontSize: 17
  },
  kInputFilterContainerStyle: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: colors.blue_400,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 18,
    justifyContent: 'space-between'
  },
  kInputFilterStyle: {
    paddingVertical: 14,
    paddingRight: 8,
    color: colors.black,
    fontSize: 12,
    flexGrow: 1
  }
})
export default memo(SelectBox)
